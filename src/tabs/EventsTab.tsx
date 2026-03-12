// ============================================================
// EventsTab.tsx — Sự Kiện & Nhắc Nhở
// - 18 ngày lễ VN (tính động mỗi năm)
// - Sự kiện cá nhân: tùy ý, lặp lại hàng năm, sửa/xóa
// - Thông báo khi sắp đến (≤7 ngày)
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lunarToSolar } from "../utils/astrology";

// ─── Types ───────────────────────────────────────────────────
interface PersonalEvent {
  id: string;
  name: string;
  type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number; // nếu có = sự kiện 1 lần; không có = lặp hàng năm
  repeat: boolean; // lặp hàng năm
  note?: string;
}

// ─── VN Holidays ──────────────────────────────────────────────
const VN_HOLIDAYS = [
  { name:"Tết Dương Lịch",       emoji:"🎆", day:1,  month:1,  type:"solar" as const },
  { name:"Tết Nguyên Đán (30 Tết)", emoji:"🧧", day:30, month:12, type:"lunar" as const },
  { name:"Tết Nguyên Đán (Mùng 1)", emoji:"🎊", day:1,  month:1,  type:"lunar" as const },
  { name:"Tết Nguyên Đán (Mùng 2)", emoji:"🎋", day:2,  month:1,  type:"lunar" as const },
  { name:"Tết Nguyên Đán (Mùng 3)", emoji:"🥳", day:3,  month:1,  type:"lunar" as const },
  { name:"Giỗ Tổ Hùng Vương",    emoji:"🏛️", day:10, month:3,  type:"lunar" as const },
  { name:"Ngày 30/4",            emoji:"🇻🇳", day:30, month:4,  type:"solar" as const },
  { name:"Ngày 1/5 Quốc Tế",    emoji:"✊",  day:1,  month:5,  type:"solar" as const },
  { name:"Quốc Khánh 2/9",      emoji:"🎗️", day:2,  month:9,  type:"solar" as const },
  { name:"Quốc Tế Phụ Nữ 8/3",  emoji:"🌸", day:8,  month:3,  type:"solar" as const },
  { name:"Ngày Phụ Nữ VN 20/10",emoji:"💐", day:20, month:10, type:"solar" as const },
  { name:"Ngày Nhà Giáo 20/11",  emoji:"📚", day:20, month:11, type:"solar" as const },
  { name:"Vu Lan Báo Hiếu",      emoji:"🪷", day:15, month:7,  type:"lunar" as const },
  { name:"Trung Thu",            emoji:"🏮", day:15, month:8,  type:"lunar" as const },
  { name:"Thần Tài (mùng 10 Giêng)", emoji:"💰", day:10, month:1, type:"lunar" as const },
  { name:"Rằm tháng Giêng",     emoji:"🌕", day:15, month:1,  type:"lunar" as const },
  { name:"Rằm tháng 7",         emoji:"🕯️", day:15, month:7,  type:"lunar" as const },
  { name:"Giáng Sinh 25/12",    emoji:"🎄", day:25, month:12, type:"solar" as const },
];

// ─── Helpers ──────────────────────────────────────────────────
const STORAGE_KEY = "hcc_personal_events";

function loadEvents(): PersonalEvent[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveEvents(e: PersonalEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); } catch {}
}

function todaySolar() {
  const n = new Date();
  return { day: n.getDate(), month: n.getMonth()+1, year: n.getFullYear() };
}

function nextSolarOccurrence(day: number, month: number): Date {
  const now = new Date();
  const thisYear = now.getFullYear();
  let d = new Date(thisYear, month-1, day);
  if (d < now) d = new Date(thisYear+1, month-1, day);
  return d;
}

function nextLunarOccurrence(lunarDay: number, lunarMonth: number): Date | null {
  const now = new Date();
  for (let y = now.getFullYear(); y <= now.getFullYear()+1; y++) {
    const r = lunarToSolar(lunarDay, lunarMonth, y);
    if (r) {
      const d = new Date(r.year, r.month-1, r.day);
      if (d >= now) return d;
    }
  }
  return null;
}

function daysDiff(d: Date): number {
  const now = new Date(); now.setHours(0,0,0,0);
  d = new Date(d); d.setHours(0,0,0,0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

function formatDateVI(d: Date): string {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}

function countdownLabel(days: number): { text: string; color: string } {
  if (days < 0)  return { text: "Đã qua", color: "var(--text-faint)" };
  if (days === 0) return { text: "Hôm nay! 🎉", color: "var(--gold)" };
  if (days === 1) return { text: "Ngày mai ⏰", color: "#fb923c" };
  if (days <= 7)  return { text: `còn ${days} ngày`, color: "#f87171" };
  return { text: `còn ${days} ngày`, color: "var(--text-muted)" };
}

// Trigger browser notification
function scheduleNotification(name: string, days: number) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted" && days > 0 && days <= 7) {
    const msg = days === 1 ? `Ngày mai có sự kiện: ${name}` : `Còn ${days} ngày: ${name}`;
    new Notification("📅 Lịch Vạn Niên AI", { body: msg, icon: "/pwa-192x192.png" });
  }
}

async function requestNotifPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

// ─── Component ────────────────────────────────────────────────
export function EventsTab() {
  const [events,   setEvents]   = useState<PersonalEvent[]>(loadEvents);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);

  // Form state
  const [fName,   setFName]   = useState("");
  const [fType,   setFType]   = useState<"solar"|"lunar">("solar");
  const [fDay,    setFDay]    = useState("");
  const [fMonth,  setFMonth]  = useState("");
  const [fYear,   setFYear]   = useState("");
  const [fRepeat, setFRepeat] = useState(true);
  const [fNote,   setFNote]   = useState("");
  const [fErr,    setFErr]    = useState("");

  // Request notification on first render
  useEffect(() => { requestNotifPermission(); }, []);

  // Notify upcoming events
  useEffect(() => {
    events.forEach(ev => {
      let next: Date | null = null;
      if (ev.type === "solar") next = nextSolarOccurrence(ev.day, ev.month);
      else next = nextLunarOccurrence(ev.day, ev.month);
      if (next) scheduleNotification(ev.name, daysDiff(next));
    });
  }, [events]);

  // Compute upcoming events (holidays + personal)
  const allItems = [
    ...VN_HOLIDAYS.map(h => {
      const next = h.type === "solar"
        ? nextSolarOccurrence(h.day, h.month)
        : nextLunarOccurrence(h.day, h.month);
      const days = next ? daysDiff(next) : 999;
      return { ...h, next, days, personal: false };
    }),
    ...events.map(ev => {
      const next = ev.type === "solar"
        ? (ev.repeat ? nextSolarOccurrence(ev.day, ev.month)
           : ev.year ? new Date(ev.year, ev.month-1, ev.day) : null)
        : nextLunarOccurrence(ev.day, ev.month);
      const days = next ? daysDiff(next) : 999;
      return { name: ev.name, emoji: "📌", day: ev.day, month: ev.month, type: ev.type, next, days, personal: true, id: ev.id, note: ev.note };
    }),
  ].filter(i => i.days >= 0 && i.days <= 60).sort((a,b) => a.days - b.days);

  const upcoming = allItems.slice(0, 8);
  const todayItems = allItems.filter(i => i.days === 0);

  // Form helpers
  const resetForm = () => { setFName(""); setFType("solar"); setFDay(""); setFMonth(""); setFYear(""); setFRepeat(true); setFNote(""); setFErr(""); setEditId(null); };

  const startEdit = (ev: PersonalEvent) => {
    setFName(ev.name); setFType(ev.type); setFDay(String(ev.day)); setFMonth(String(ev.month));
    setFYear(ev.year ? String(ev.year) : ""); setFRepeat(ev.repeat); setFNote(ev.note ?? "");
    setEditId(ev.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!fName.trim()) { setFErr("Vui lòng nhập tên sự kiện"); return; }
    const d = parseInt(fDay), m = parseInt(fMonth);
    if (isNaN(d)||d<1||d>31) { setFErr("Ngày không hợp lệ"); return; }
    if (isNaN(m)||m<1||m>12) { setFErr("Tháng không hợp lệ"); return; }
    const y = fYear ? parseInt(fYear) : undefined;
    const ev: PersonalEvent = { id: editId ?? Date.now().toString(), name: fName.trim(), type: fType, day: d, month: m, year: y, repeat: fRepeat || !y, note: fNote.trim() || undefined };
    const updated = editId ? events.map(e => e.id===editId ? ev : e) : [...events, ev];
    setEvents(updated); saveEvents(updated);
    setShowForm(false); resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated); saveEvents(updated);
  };

  return (
    <div className="px-4 pt-4 pb-4 flex flex-col gap-3">

      {/* Today's events */}
      {todayItems.length > 0 && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
          className="rounded-2xl px-4 py-3.5" style={{background:"linear-gradient(135deg,var(--gold-bg),var(--bg-elevated))",border:"1px solid var(--gold-border)"}}>
          <p className="section-label mb-2">🎉 Hôm nay có sự kiện</p>
          {todayItems.map(i=>(
            <p key={i.name} className="font-bold text-base" style={{color:"var(--gold)"}}>{i.emoji} {i.name}</p>
          ))}
        </motion.div>
      )}

      {/* Upcoming 60 days */}
      {upcoming.length > 0 && (
        <div>
          <p className="section-label mb-2 px-1">⏳ Sắp diễn ra (60 ngày tới)</p>
          <div className="card overflow-hidden">
            {upcoming.map((item, i) => {
              const { text, color } = countdownLabel(item.days);
              return (
                <div key={`${item.name}-${i}`}
                  className={`px-4 py-3 flex items-center gap-3 ${i<upcoming.length-1?"border-b":""}`}
                  style={{borderColor:"var(--border-subtle)",background:item.days===0?"var(--gold-bg)":"transparent"}}>
                  <span className="text-xl w-7 flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight" style={{color:"var(--text-primary)"}}>{item.name}</p>
                    {item.next && <p className="text-xs mt-0.5" style={{color:"var(--text-faint)"}}>{formatDateVI(item.next)}</p>}
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{color}}>{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personal events */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="section-label">📌 Sự Kiện Của Tôi</p>
          <motion.button whileTap={{scale:0.94}} onClick={()=>{resetForm();setShowForm(v=>!v);}}
            className="text-sm font-bold px-3 py-1.5 rounded-xl"
            style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
            + Thêm
          </motion.button>
        </div>

        {/* Form thêm/sửa */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
              style={{overflow:"hidden"}} className="mb-3">
              <div className="card p-4 flex flex-col gap-3">
                <p className="font-bold text-sm" style={{color:"var(--text-primary)"}}>
                  {editId ? "✏️ Sửa sự kiện" : "➕ Thêm sự kiện"}
                </p>

                <div>
                  <p className="section-label mb-1.5">Tên sự kiện</p>
                  <input value={fName} onChange={e=>setFName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none text-sm font-medium"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}
                    placeholder="Kỷ niệm ngày cưới, Ngày về quê, Giỗ Ông Nội..."/>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="section-label mb-1.5">Loại ngày</p>
                    <div className="flex gap-1 p-0.5 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
                      {(["solar","lunar"] as const).map(t=>(
                        <button key={t} onClick={()=>setFType(t)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold"
                          style={{background:fType===t?"var(--gold)":"transparent",color:fType===t?"white":"var(--text-muted)"}}>
                          {t==="solar"?"☀️ DL":"🌙 ÂL"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="section-label mb-1.5">Ngày / Tháng</p>
                    <div className="flex gap-1">
                      <input type="number" value={fDay} onChange={e=>setFDay(e.target.value)} placeholder="DD"
                        className="flex-1 px-2 py-2.5 rounded-xl outline-none font-bold text-center text-sm"
                        style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
                      <span className="py-2.5 text-sm" style={{color:"var(--text-muted)"}}>/</span>
                      <input type="number" value={fMonth} onChange={e=>setFMonth(e.target.value)} placeholder="MM"
                        className="flex-1 px-2 py-2.5 rounded-xl outline-none font-bold text-center text-sm"
                        style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
                    </div>
                  </div>
                </div>

                {/* Repeat toggle */}
                <div className="flex items-center justify-between py-2 px-3 rounded-xl"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
                  <div>
                    <p className="text-sm font-semibold" style={{color:"var(--text-primary)"}}>🔄 Lặp lại hàng năm</p>
                    <p className="text-xs" style={{color:"var(--text-muted)"}}>
                      {fRepeat ? "Nhắc mỗi năm vào ngày này" : "Chỉ nhắc một lần"}
                    </p>
                  </div>
                  <button onClick={()=>setFRepeat(v=>!v)}
                    className="w-12 h-6 rounded-full relative transition-all"
                    style={{background:fRepeat?"var(--gold)":"var(--border-medium)"}}>
                    <motion.div animate={{x:fRepeat?24:2}} transition={{type:"spring",damping:18,stiffness:300}}
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"/>
                  </button>
                </div>

                {/* Note */}
                <div>
                  <p className="section-label mb-1.5">Ghi chú (tuỳ chọn)</p>
                  <input value={fNote} onChange={e=>setFNote(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}
                    placeholder="Ví dụ: Mua quà trước 2 ngày..."/>
                </div>

                {fErr && <p className="text-xs" style={{color:"var(--accent-red)"}}>{fErr}</p>}

                <div className="flex gap-2">
                  <button onClick={()=>{setShowForm(false);resetForm();}}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{background:"var(--bg-elevated)",color:"var(--text-muted)"}}>
                    Huỷ
                  </button>
                  <motion.button whileTap={{scale:0.97}} onClick={handleSave}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{background:"var(--gold)"}}>
                    {editId ? "💾 Cập nhật" : "💾 Lưu"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event list */}
        {events.length === 0 && !showForm ? (
          <div className="card p-6 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm" style={{color:"var(--text-muted)"}}>
              Chưa có sự kiện. Thêm sinh nhật, kỷ niệm, giỗ kị... để được nhắc nhở.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map(ev => {
              const next = ev.type==="solar"
                ? (ev.repeat ? nextSolarOccurrence(ev.day,ev.month) : ev.year ? new Date(ev.year,ev.month-1,ev.day) : null)
                : nextLunarOccurrence(ev.day, ev.month);
              const days = next ? daysDiff(next) : null;
              const { text, color } = days !== null ? countdownLabel(days) : { text:"", color:"" };
              return (
                <motion.div key={ev.id} layout initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                  className="card px-4 py-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">
                    {ev.type==="lunar"?"🌙":"☀️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{color:"var(--text-primary)"}}>{ev.name}</p>
                    <p className="text-xs mt-0.5" style={{color:"var(--text-muted)"}}>
                      {`${String(ev.day).padStart(2,'0')}/${String(ev.month).padStart(2,'0')}`}
                      {ev.type==="lunar"?" (ÂL)":""}
                      {ev.repeat ? " · 🔄 hàng năm" : ""}
                    </p>
                    {ev.note && <p className="text-xs mt-0.5 truncate" style={{color:"var(--text-faint)"}}>{ev.note}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {days !== null && <span className="text-xs font-bold" style={{color}}>{text}</span>}
                    <div className="flex gap-1">
                      <button onClick={()=>startEdit(ev)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                        style={{background:"var(--gold-bg)",color:"var(--gold)"}}>✏️</button>
                      <button onClick={()=>handleDelete(ev.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                        style={{background:"rgba(248,113,113,0.12)",color:"var(--accent-red)"}}>🗑</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
