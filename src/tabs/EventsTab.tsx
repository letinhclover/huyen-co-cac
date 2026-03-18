// ============================================================
// EventsTab.tsx — Sự Kiện & Nhắc Nhở  v2
// - Ngày lễ VN nâng cấp: startYear, số năm kỷ niệm, chi tiết lịch sử
// - Click ngày lễ → BottomSheet chi tiết
// - Sự kiện cá nhân: tùy ý, lặp lại hàng năm, sửa/xóa đúng
// - Toast success khi thêm/sửa/xóa
// - Sắp diễn ra: chỉ 30 ngày
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lunarToSolar } from "../utils/astrology";

// ─── Types ───────────────────────────────────────────────────
interface PersonalEvent {
  id: string;
  name: string;
  type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number;
  repeat: boolean;
  note?: string;
}

interface Holiday {
  name: string;
  emoji: string;
  day: number;
  month: number;
  type: "solar" | "lunar";
  startYear?: number;          // năm sự kiện lịch sử bắt đầu
  history?: string;            // mô tả ngắn ý nghĩa
}

// ─── VN Holidays với lịch sử ─────────────────────────────────
const VN_HOLIDAYS: Holiday[] = [
  {
    name: "Tết Dương Lịch", emoji: "🎆", day: 1, month: 1, type: "solar",
    history: "Ngày đầu tiên của năm theo lịch Gregorian, được nghỉ lễ chính thức tại Việt Nam.",
  },
  {
    name: "Rằm tháng Giêng (Tết Nguyên Tiêu)", emoji: "🌕", day: 15, month: 1, type: "lunar",
    history: "Rằm đầu năm âm lịch — ngày cúng bái, lễ Phật, người dân đi chùa cầu an và ngắm hoa đèn.",
  },
  {
    name: "Thần Tài (Mùng 10 Tháng Giêng)", emoji: "💰", day: 10, month: 1, type: "lunar",
    history: "Ngày vía Thần Tài — các gia đình, hộ kinh doanh cúng Thần Tài, mua vàng cầu tài lộc cả năm.",
  },
  {
    name: "Tết Nguyên Đán (30 Tết)", emoji: "🧧", day: 30, month: 12, type: "lunar",
    history: "Đêm giao thừa — khoảnh khắc chuyển giao năm cũ sang năm mới, gia đình sum vầy quây quần bên nhau.",
  },
  {
    name: "Tết Nguyên Đán (Mùng 1)", emoji: "🎊", day: 1, month: 1, type: "lunar",
    history: "Ngày đầu tiên của năm âm lịch, quan trọng nhất trong hệ thống lễ tết Việt Nam. Nghỉ lễ chính thức.",
  },
  {
    name: "Tết Nguyên Đán (Mùng 2)", emoji: "🎋", day: 2, month: 1, type: "lunar",
    history: "Ngày thứ 2 Tết — theo truyền thống, con cái thăm nhà ngoại, họ hàng thăm hỏi nhau.",
  },
  {
    name: "Tết Nguyên Đán (Mùng 3)", emoji: "🥳", day: 3, month: 1, type: "lunar",
    history: "Ngày thứ 3 Tết — thường là ngày tiễn ông Táo, cúng mộ tổ tiên theo tục lệ miền Nam.",
  },
  {
    name: "Quốc Tế Phụ Nữ 8/3", emoji: "🌸", day: 8, month: 3, type: "solar",
    startYear: 1910,
    history: "Ngày Quốc Tế Phụ Nữ — xuất phát từ phong trào đấu tranh quyền phụ nữ thế giới. Tại Việt Nam, đây là dịp tôn vinh người phụ nữ Việt Nam anh hùng.",
  },
  {
    name: "Giỗ Tổ Hùng Vương", emoji: "🏛️", day: 10, month: 3, type: "lunar",
    startYear: 2007,
    history: "Ngày Quốc lễ tưởng nhớ các Vua Hùng — người có công dựng nước. \"Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng Mười tháng Ba.\"",
  },
  {
    name: "Ngày Giải Phóng Miền Nam 30/4", emoji: "🇻🇳", day: 30, month: 4, type: "solar",
    startYear: 1975,
    history: "Ngày 30/4/1975 — kết thúc chiến tranh Việt Nam, thống nhất đất nước. Sự kiện lịch sử trọng đại nhất thế kỷ 20 của Việt Nam.",
  },
  {
    name: "Quốc Tế Lao Động 1/5", emoji: "✊", day: 1, month: 5, type: "solar",
    startYear: 1886,
    history: "Ngày Quốc Tế Lao Động — kỷ niệm phong trào đấu tranh của công nhân thế giới. Việt Nam nghỉ lễ chính thức từ 1975.",
  },
  {
    name: "Vu Lan Báo Hiếu", emoji: "🪷", day: 15, month: 7, type: "lunar",
    history: "Rằm tháng 7 âm lịch — Lễ Vu Lan, dịp con cái báo hiếu cha mẹ. Các Phật tử cài hoa hồng: đỏ (còn mẹ), trắng (mất mẹ).",
  },
  {
    name: "Rằm tháng 7 (Xá Tội Vong Nhân)", emoji: "🕯️", day: 15, month: 7, type: "lunar",
    history: "Ngày cúng cô hồn, thắp hương cho những linh hồn không nơi nương tựa. Nhiều gia đình cúng xôi, chè, bánh và thả tiền vàng.",
  },
  {
    name: "Quốc Khánh 2/9", emoji: "🎗️", day: 2, month: 9, type: "solar",
    startYear: 1945,
    history: "Ngày 2/9/1945 — Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.",
  },
  {
    name: "Trung Thu", emoji: "🏮", day: 15, month: 8, type: "lunar",
    history: "Tết Trung Thu — lễ hội của thiếu nhi, với bánh trung thu, đèn lồng, múa lân và ngắm trăng rằm.",
  },
  {
    name: "Ngày Phụ Nữ Việt Nam 20/10", emoji: "💐", day: 20, month: 10, type: "solar",
    startYear: 1930,
    history: "Ngày thành lập Hội Phụ Nữ Việt Nam (1930) — dịp tôn vinh vai trò và đóng góp to lớn của người phụ nữ Việt Nam trong gia đình và xã hội.",
  },
  {
    name: "Ngày Nhà Giáo Việt Nam 20/11", emoji: "📚", day: 20, month: 11, type: "solar",
    startYear: 1958,
    history: "Ngày Hiến chương các Nhà giáo (1958) — dịp học sinh, sinh viên bày tỏ lòng biết ơn thầy cô. Hoa, thiệp và những câu chúc thành kính.",
  },
  {
    name: "Giáng Sinh 25/12", emoji: "🎄", day: 25, month: 12, type: "solar",
    history: "Lễ Giáng Sinh — ngày kỷ niệm Chúa Giê-su ra đời. Tại Việt Nam, được đón chào rộng rãi như một dịp lễ hội với trang trí, quà tặng và sum vầy.",
  },
];

// ─── Storage ──────────────────────────────────────────────────
const STORAGE_KEY = "hcc_personal_events";
function loadEvents(): PersonalEvent[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveEvents(e: PersonalEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────
function nextSolarOccurrence(day: number, month: number): Date {
  const now = new Date(); now.setHours(0,0,0,0);
  const thisYear = now.getFullYear();
  let d = new Date(thisYear, month - 1, day);
  if (d < now) d = new Date(thisYear + 1, month - 1, day);
  return d;
}

function nextLunarOccurrence(lunarDay: number, lunarMonth: number): Date | null {
  const now = new Date(); now.setHours(0,0,0,0);
  for (let y = now.getFullYear(); y <= now.getFullYear() + 1; y++) {
    const r = lunarToSolar(lunarDay, lunarMonth, y);
    if (r) {
      const d = new Date(r.year, r.month - 1, r.day);
      if (d >= now) return d;
    }
  }
  return null;
}

function daysDiff(d: Date): number {
  const now = new Date(); now.setHours(0,0,0,0);
  const t = new Date(d); t.setHours(0,0,0,0);
  return Math.round((t.getTime() - now.getTime()) / 86400000);
}

function formatDateShort(d: Date): string {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}

function countdownStyle(days: number): { text: string; color: string } {
  if (days === 0) return { text: "Hôm nay! 🎉", color: "var(--gold)" };
  if (days === 1) return { text: "Ngày mai ⏰", color: "#fb923c" };
  if (days <= 7)  return { text: `còn ${days} ngày`, color: "#f87171" };
  return { text: `còn ${days} ngày`, color: "var(--text-muted)" };
}

// ─── Toast hook ───────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (msg: string, type: "success"|"error" = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, type });
    timer.current = setTimeout(() => setToast(null), 2400);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { toast, show };
}

// ─── Main Component ───────────────────────────────────────────
export function EventsTab() {
  const [events,   setEvents]   = useState<PersonalEvent[]>(loadEvents);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [sheet,    setSheet]    = useState<Holiday | null>(null); // BottomSheet target
  const { toast, show: showToast } = useToast();

  // Form state
  const [fName,   setFName]   = useState("");
  const [fType,   setFType]   = useState<"solar"|"lunar">("solar");
  const [fDay,    setFDay]    = useState("");
  const [fMonth,  setFMonth]  = useState("");
  const [fRepeat, setFRepeat] = useState(true);
  const [fNote,   setFNote]   = useState("");
  const [fErr,    setFErr]    = useState("");

  // Upcoming (30 days)
  const currentYear = new Date().getFullYear();
  const upcomingHolidays = VN_HOLIDAYS.map(h => {
    const next = h.type === "solar"
      ? nextSolarOccurrence(h.day, h.month)
      : nextLunarOccurrence(h.day, h.month);
    return { ...h, next, days: next ? daysDiff(next) : 999 };
  }).filter(h => h.days >= 0 && h.days <= 30).sort((a,b) => a.days - b.days);

  const upcomingPersonal = events.map(ev => {
    const next = ev.type === "solar"
      ? (ev.repeat ? nextSolarOccurrence(ev.day, ev.month) : ev.year ? new Date(ev.year, ev.month-1, ev.day) : null)
      : nextLunarOccurrence(ev.day, ev.month);
    return { ...ev, next, days: next ? daysDiff(next) : 999 };
  }).filter(ev => ev.days >= 0 && ev.days <= 30).sort((a,b) => a.days - b.days);

  // Form helpers
  const resetForm = () => {
    setFName(""); setFType("solar"); setFDay(""); setFMonth("");
    setFRepeat(true); setFNote(""); setFErr(""); setEditId(null);
  };

  const startEdit = (ev: PersonalEvent) => {
    setFName(ev.name); setFType(ev.type); setFDay(String(ev.day)); setFMonth(String(ev.month));
    setFRepeat(ev.repeat); setFNote(ev.note ?? "");
    setEditId(ev.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!fName.trim()) { setFErr("Vui lòng nhập tên sự kiện"); return; }
    const d = parseInt(fDay), m = parseInt(fMonth);
    if (isNaN(d) || d < 1 || d > 31) { setFErr("Ngày không hợp lệ"); return; }
    if (isNaN(m) || m < 1 || m > 12) { setFErr("Tháng không hợp lệ"); return; }

    // ← Critical fix: snapshot fRepeat as boolean before state update
    const isRepeat: boolean = Boolean(fRepeat);
    const ev: PersonalEvent = {
      id: editId ?? Date.now().toString(),
      name: fName.trim(),
      type: fType,
      day: d,
      month: m,
      repeat: isRepeat,
      note: fNote.trim() || undefined,
    };
    let updated: PersonalEvent[];
    if (editId) {
      updated = events.map(e => e.id === editId ? ev : e);
      showToast("✅ Đã cập nhật sự kiện");
    } else {
      updated = [...events, ev];
      showToast("✅ Đã thêm sự kiện mới");
    }
    setEvents(updated); saveEvents(updated);
    setShowForm(false); resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated); saveEvents(updated);
    showToast(`🗑 Đã xóa: ${name}`);
  };

  return (
    <div className="px-4 pt-4 pb-28 flex flex-col gap-4">

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:-60 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-40 }}
            transition={{ type:"spring", damping:26, stiffness:300 }}
            className="fixed top-3 left-3 right-3 z-[60]"
            style={{ maxWidth:420, margin:"0 auto" }}>
            <div className="rounded-xl px-4 py-3 text-sm font-semibold text-white text-center"
              style={{ background: toast.type === "success" ? "#16a34a" : "#dc2626",
                       boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }}>
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Sắp diễn ra (holidays) ─── */}
      {upcomingHolidays.length > 0 && (
        <div>
          <p className="section-label mb-2 px-1">🇻🇳 Ngày Lễ Sắp Tới (30 ngày)</p>
          <div className="card overflow-hidden">
            {upcomingHolidays.map((h, i) => {
              const { text, color } = countdownStyle(h.days);
              const yearsCount = h.startYear ? currentYear - h.startYear : null;
              return (
                <motion.button key={`${h.name}-${i}`} whileTap={{ scale:0.98 }}
                  onClick={() => setSheet(h)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left ${i < upcomingHolidays.length-1 ? "border-b":""}`}
                  style={{ borderColor:"var(--border-subtle)", background: h.days===0?"var(--gold-bg)":"transparent" }}>
                  <span className="text-xl w-7 flex-shrink-0">{h.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate" style={{color:"var(--text-primary)"}}>{h.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {h.next && <p className="text-xs" style={{color:"var(--text-faint)"}}>{formatDateShort(h.next)}</p>}
                      {yearsCount !== null && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                          style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
                          {yearsCount} năm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-bold" style={{color}}>{text}</span>
                    <span className="text-xs" style={{color:"var(--text-faint)"}}>›</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Sự kiện cá nhân sắp tới ─── */}
      {upcomingPersonal.length > 0 && (
        <div>
          <p className="section-label mb-2 px-1">📌 Sự Kiện Của Bạn (30 ngày tới)</p>
          <div className="card overflow-hidden">
            {upcomingPersonal.map((ev, i) => {
              const { text, color } = countdownStyle(ev.days);
              return (
                <div key={ev.id}
                  className={`px-4 py-3 flex items-center gap-3 ${i < upcomingPersonal.length-1?"border-b":""}`}
                  style={{borderColor:"var(--border-subtle)",background:ev.days===0?"var(--gold-bg)":"transparent"}}>
                  <span className="text-xl w-7 flex-shrink-0">{ev.type==="lunar"?"🌙":"☀️"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{color:"var(--text-primary)"}}>{ev.name}</p>
                    <p className="text-xs mt-0.5" style={{color:"var(--text-faint)"}}>
                      {`${String(ev.day).padStart(2,"0")}/${String(ev.month).padStart(2,"0")}`}
                      {ev.type==="lunar"?" (ÂL)":""}{ev.repeat?" · 🔄":""}
                    </p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{color}}>{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Sự kiện cá nhân ─── */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="section-label">📌 Sự Kiện Của Tôi</p>
          <motion.button whileTap={{scale:0.93}} onClick={() => { resetForm(); setShowForm(v=>!v); }}
            className="text-sm font-bold px-3 py-1.5 rounded-xl"
            style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
            {showForm && !editId ? "✕ Đóng" : "+ Thêm"}
          </motion.button>
        </div>

        {/* ─ Form ─ */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
              exit={{opacity:0,height:0}} style={{overflow:"hidden"}} className="mb-3">
              <div className="card p-4 flex flex-col gap-3">
                <p className="font-bold text-sm" style={{color:"var(--text-primary)"}}>
                  {editId ? "✏️ Sửa sự kiện" : "➕ Thêm sự kiện mới"}
                </p>

                {/* Tên */}
                <div>
                  <p className="section-label mb-1.5">Tên sự kiện</p>
                  <input value={fName} onChange={e=>setFName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}
                    placeholder="Kỷ niệm ngày cưới, Giỗ Ông, Về quê..."/>
                </div>

                {/* Loại ngày + Ngày/Tháng */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="section-label mb-1.5">Loại ngày</p>
                    <div className="flex p-0.5 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
                      {(["solar","lunar"] as const).map(t=>(
                        <button key={t} onClick={()=>setFType(t)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                          style={{
                            background: fType===t ? "var(--gold)" : "transparent",
                            color: fType===t ? "white" : "var(--text-muted)"
                          }}>
                          {t==="solar"?"☀️ DL":"🌙 ÂL"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="section-label mb-1.5">Ngày / Tháng</p>
                    <div className="flex items-center gap-1">
                      <input type="number" value={fDay} onChange={e=>setFDay(e.target.value)} placeholder="DD"
                        className="w-0 flex-1 px-2 py-2.5 rounded-xl outline-none font-bold text-center text-sm min-w-0"
                        style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
                      <span style={{color:"var(--text-muted)"}}>/</span>
                      <input type="number" value={fMonth} onChange={e=>setFMonth(e.target.value)} placeholder="MM"
                        className="w-0 flex-1 px-2 py-2.5 rounded-xl outline-none font-bold text-center text-sm min-w-0"
                        style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
                    </div>
                  </div>
                </div>

                {/* Lặp lại */}
                <button onClick={()=>setFRepeat(v=>!v)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl text-left"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
                  <div>
                    <p className="text-sm font-semibold" style={{color:"var(--text-primary)"}}>🔄 Lặp lại hàng năm</p>
                    <p className="text-xs" style={{color:"var(--text-muted)"}}>
                      {fRepeat ? "Nhắc mỗi năm vào ngày này" : "Chỉ nhắc một lần"}
                    </p>
                  </div>
                  <div className="w-12 h-6 rounded-full relative flex-shrink-0 ml-3"
                    style={{background:fRepeat?"var(--gold)":"var(--border-medium)"}}>
                    <motion.div animate={{x: fRepeat ? 24 : 2}} transition={{type:"spring",damping:18,stiffness:300}}
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"/>
                  </div>
                </button>

                {/* Ghi chú */}
                <div>
                  <p className="section-label mb-1.5">Ghi chú (tùy chọn)</p>
                  <input value={fNote} onChange={e=>setFNote(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}
                    placeholder="Mua quà trước 2 ngày, gọi điện chúc..."/>
                </div>

                {fErr && <p className="text-xs font-medium" style={{color:"var(--accent-red)"}}>{fErr}</p>}

                <div className="flex gap-2">
                  <button onClick={()=>{setShowForm(false);resetForm();}}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{background:"var(--bg-elevated)",color:"var(--text-muted)"}}>
                    Huỷ
                  </button>
                  <motion.button whileTap={{scale:0.97}} onClick={handleSave}
                    className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{background:"var(--gold)"}}>
                    {editId ? "💾 Cập nhật" : "💾 Lưu sự kiện"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─ Danh sách ─ */}
        {events.length === 0 && !showForm ? (
          <div className="card p-6 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm" style={{color:"var(--text-muted)"}}>
              Chưa có sự kiện. Thêm kỷ niệm, sinh nhật, giỗ kị... để được nhắc nhở tự động.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map(ev => {
              const next = ev.type==="solar"
                ? (ev.repeat ? nextSolarOccurrence(ev.day,ev.month) : ev.year ? new Date(ev.year,ev.month-1,ev.day) : null)
                : nextLunarOccurrence(ev.day, ev.month);
              const days = next ? daysDiff(next) : null;
              const { text, color } = days !== null ? countdownStyle(days) : { text:"", color:"" };
              return (
                <motion.div key={ev.id} layout initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                  className="card px-4 py-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{ev.type==="lunar"?"🌙":"☀️"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{color:"var(--text-primary)"}}>{ev.name}</p>
                    <p className="text-xs mt-0.5" style={{color:"var(--text-muted)"}}>
                      {`${String(ev.day).padStart(2,"0")}/${String(ev.month).padStart(2,"0")}`}
                      {ev.type==="lunar"?" (ÂL)":""}
                      {ev.repeat ? " · 🔄 hàng năm" : ""}
                    </p>
                    {ev.note && <p className="text-xs mt-0.5 truncate" style={{color:"var(--text-faint)"}}>{ev.note}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {days !== null && <span className="text-xs font-bold" style={{color}}>{text}</span>}
                    <div className="flex gap-1">
                      <button onClick={()=>startEdit(ev)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                        style={{background:"var(--gold-bg)",color:"var(--gold)"}}>✏️</button>
                      <button onClick={()=>handleDelete(ev.id,ev.name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                        style={{background:"rgba(248,113,113,0.12)",color:"var(--accent-red)"}}>🗑</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Holiday BottomSheet ─── */}
      <AnimatePresence>
        {sheet && (
          <>
            {/* Backdrop */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-40" style={{background:"rgba(0,0,0,0.55)"}}
              onClick={()=>setSheet(null)}/>
            {/* Sheet */}
            <motion.div
              initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:28,stiffness:280}}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{maxWidth:480, margin:"0 auto", background:"var(--bg-elevated)",
                      boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{background:"var(--border-medium)"}}/>
              </div>
              <div className="px-6 pt-2 pb-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{sheet.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight"
                        style={{color:"var(--text-primary)"}}>{sheet.name}</h3>
                      {sheet.startYear && (
                        <p className="text-sm mt-0.5" style={{color:"var(--gold)"}}>
                          {sheet.startYear} · Kỷ niệm{" "}
                          <strong>{currentYear - sheet.startYear}</strong> năm
                        </p>
                      )}
                    </div>
                  </div>
                  <button onClick={()=>setSheet(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{background:"var(--bg-surface)",color:"var(--text-muted)"}}>✕</button>
                </div>

                {/* Next date */}
                {(() => {
                  const next = sheet.type==="solar"
                    ? nextSolarOccurrence(sheet.day, sheet.month)
                    : nextLunarOccurrence(sheet.day, sheet.month);
                  const days = next ? daysDiff(next) : null;
                  if (!next || days === null) return null;
                  const { text, color } = countdownStyle(days);
                  return (
                    <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl"
                      style={{background:"var(--gold-bg)",border:"1px solid var(--gold-border)"}}>
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-bold text-sm" style={{color:"var(--text-primary)"}}>
                          {next.toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                        </p>
                        <p className="text-sm font-semibold mt-0.5" style={{color}}>{text}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* History text */}
                {sheet.history && (
                  <div className="rounded-2xl px-4 py-3.5"
                    style={{background:"var(--bg-surface)",border:"1px solid var(--border-subtle)"}}>
                    <p className="section-label mb-2">📖 Ý nghĩa lịch sử</p>
                    <p className="text-sm leading-relaxed" style={{color:"var(--text-secondary)"}}>
                      {sheet.history}
                    </p>
                    {sheet.startYear && (
                      <p className="text-xs mt-2.5 font-semibold" style={{color:"var(--gold)"}}>
                        {sheet.startYear} → {currentYear}: {currentYear - sheet.startYear} năm
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
