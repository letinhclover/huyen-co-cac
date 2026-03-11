// ============================================================
// UtilsTab.tsx — Tiện Ích: 18 Mục Đích + Đổi Ngày + Xem Tuổi
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeDayFull, getGoodDaysInMonth, analyzeAge } from "../utils/almanac";
import { DayDetailPanel } from "../components/DayDetailPanel";
import { MUC_DICH_XEM_NGAY } from "../data/xem-ngay-muc-dich";

type Tool = "ngaytot" | "doingay" | "xemtuoi";
interface Props { birthYear?: number; }

export function UtilsTab({ birthYear }: Props) {
  const [tool, setTool] = useState<Tool>("ngaytot");
  const tools: { id: Tool; emoji: string; label: string }[] = [
    { id:"ngaytot", emoji:"📅", label:"Ngày Tốt" },
    { id:"doingay", emoji:"🔄", label:"Đổi Ngày" },
    { id:"xemtuoi", emoji:"👤", label:"Xem Tuổi" },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Sticky tab selector */}
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2.5 border-b"
        style={{ background: "var(--header-bg)", backdropFilter: "blur(12px)", borderColor: "var(--border-subtle)" }}>
        <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          {tools.map(t => (
            <button key={t.id} onClick={() => setTool(t.id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tool === t.id ? "var(--gold)" : "transparent",
                color: tool === t.id ? "white" : "var(--text-muted)",
              }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <AnimatePresence mode="wait">
          {tool === "ngaytot" && <NgayTotTool key="ngaytot" />}
          {tool === "doingay" && <DoiNgayTool key="doingay" />}
          {tool === "xemtuoi" && <XemTuoiTool key="xemtuoi" birthYear={birthYear} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tool 1: Ngày Tốt ────────────────────────────────────────
function NgayTotTool() {
  const now = new Date();
  const [month,    setMonth]   = useState(now.getMonth() + 1);
  const [year,     setYear]    = useState(now.getFullYear());
  const [mucDichId, setMucDichId] = useState(MUC_DICH_XEM_NGAY[0].id);
  const [expanded, setExpanded]= useState<number | null>(null);

  const mucDich = MUC_DICH_XEM_NGAY.find(m => m.id === mucDichId)!;

  const goodDays = useMemo(
    () => getGoodDaysInMonth(month, year, mucDich.field).filter(({ info }) => info.rating[mucDich.field] >= mucDich.minRating),
    [month, year, mucDichId]
  );

  const prevM = () => month === 1 ? (setMonth(12), setYear(y=>y-1)) : setMonth(m=>m-1);
  const nextM = () => month === 12 ? (setMonth(1), setYear(y=>y+1)) : setMonth(m=>m+1);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col gap-3">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevM} className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-colors"
          style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>‹</button>
        <p className="font-bold" style={{ color:"var(--text-primary)" }}>Tháng {month}/{year}</p>
        <button onClick={nextM} className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-colors"
          style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>›</button>
      </div>

      {/* Mục đích — scrollable grid */}
      <div>
        <p className="section-label mb-2">Mục Đích</p>
        <div className="grid grid-cols-3 gap-1.5">
          {MUC_DICH_XEM_NGAY.map(md => (
            <button key={md.id} onClick={() => setMucDichId(md.id)}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center transition-all"
              style={{
                background: mucDichId === md.id ? "var(--gold-bg)" : "var(--bg-surface)",
                border: `1px solid ${mucDichId === md.id ? "var(--gold-border)" : "var(--border-subtle)"}`,
                color: mucDichId === md.id ? "var(--gold)" : "var(--text-muted)",
              }}>
              <span className="text-lg leading-none">{md.emoji}</span>
              <span className="text-[10px] font-medium leading-tight">{md.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {mucDich.emoji} {mucDich.label}
          </p>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--gold-bg)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>
            {goodDays.length} ngày
          </span>
        </div>

        {goodDays.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-2xl mb-2">🌧</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Không có ngày tốt tháng này</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>Thử tháng khác</p>
          </div>
        ) : (
          <div className="divide-y" style={{ "--tw-divide-opacity": 1, borderColor: "var(--border-subtle)" } as React.CSSProperties}>
            {goodDays.slice(0, 12).map(({ day, info }) => {
              const r = info.rating[mucDich.field];
              return (
                <div key={day}>
                  <button className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors active:opacity-70"
                    style={{ background: expanded === day ? "var(--bg-elevated)" : "transparent" }}
                    onClick={() => setExpanded(expanded === day ? null : day)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: r >= 4 ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                        color: r >= 4 ? "var(--accent-emerald)" : "var(--gold)",
                        border: `1px solid ${r >= 4 ? "rgba(34,197,94,0.2)" : "var(--gold-border)"}`,
                      }}>
                      {day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{info.canChiDay}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{info.lunarDate} · {info.truc.ten}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className="text-[10px]" style={{ color: i<=r ? "var(--gold)" : "var(--border-medium)" }}>★</span>
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{expanded===day?"▲":"▼"}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expanded === day && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                        className="overflow-hidden px-4 pb-3">
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {info.saoTot.slice(0,4).map(s => (
                            <span key={s.id} className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
                              {s.name}
                            </span>
                          ))}
                          {info.ngayXauList.map(x => (
                            <span key={x} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background:"rgba(239,68,68,0.08)", color:"var(--accent-red)", border:"1px solid rgba(239,68,68,0.2)" }}>
                              ⚠ {x}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs mt-2" style={{ color:"var(--text-muted)" }}>{info.summary}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Tool 2: Đổi Ngày ────────────────────────────────────────
function DoiNgayTool() {
  const now = new Date();
  const [d, setD] = useState(now.getDate());
  const [m, setM] = useState(now.getMonth() + 1);
  const [y, setY] = useState(now.getFullYear());
  const date = useMemo(() => new Date(y, m - 1, d), [d, m, y]);

  const spinners = [
    { label:"Ngày", val:d, set:setD, min:1, max:31 },
    { label:"Tháng", val:m, set:setM, min:1, max:12 },
    { label:"Năm", val:y, set:setY, min:1900, max:2100 },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col gap-3">
      <div className="card p-4">
        <p className="section-label mb-3">Ngày Dương Lịch</p>
        <div className="grid grid-cols-3 gap-3">
          {spinners.map(({ label, val, set, min, max }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => set(v => Math.max(min,v-1))} className="w-8 h-8 rounded-lg text-lg flex items-center justify-center"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>−</button>
                <span className="w-10 text-center font-bold text-base" style={{ color:"var(--text-primary)" }}>{val}</span>
                <button onClick={() => set(v => Math.min(max,v+1))} className="w-8 h-8 rounded-lg text-lg flex items-center justify-center"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DayDetailPanel date={date} />
    </motion.div>
  );
}

// ─── Tool 3: Xem Tuổi ────────────────────────────────────────
function XemTuoiTool({ birthYear }: { birthYear?: number }) {
  const [by,        setBy]        = useState(birthYear ?? 1990);
  const [checkYear, setCheckYear] = useState(new Date().getFullYear());
  const analysis = useMemo(() => analyzeAge(by, checkYear), [by, checkYear]);

  const scoreColor = analysis.overall === "tốt" ? "var(--accent-emerald)" :
                     analysis.overall === "trung bình" ? "var(--gold)" :
                     analysis.overall === "cần cúng giải" ? "#f97316" : "var(--accent-red)";

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {[{ label:"Năm Sinh", val:by, set:setBy },
          { label:"Năm Kiểm Tra", val:checkYear, set:setCheckYear }].map(({ label, val, set }) => (
          <div key={label} className="card p-3">
            <p className="section-label mb-2">{label}</p>
            <div className="flex items-center gap-1 justify-center">
              <button onClick={() => set((v:number) => v-1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>−</button>
              <span className="w-14 text-center font-bold" style={{ color:"var(--text-primary)" }}>{val}</span>
              <button onClick={() => set((v:number) => v+1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="card p-4 flex items-center gap-4" style={{ borderColor: scoreColor + "33" }}>
        <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-2xl flex-shrink-0"
          style={{ border: `2px solid ${scoreColor}`, background: scoreColor + "12" }}>
          {analysis.overall === "tốt" ? "✅" : analysis.overall === "nên tránh" ? "🚫" : "⚠️"}
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color:"var(--text-muted)" }}>Tuổi {analysis.age} · Năm {checkYear}</p>
          <p className="text-lg font-bold" style={{ color: scoreColor }}>{analysis.overall.toUpperCase()}</p>
        </div>
      </div>

      {/* 3 hạn */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border-subtle)" }}>
          {[
            { label:"Kim Lâu", val:analysis.kimLau },
            { label:"Hoàng Ốc", val:analysis.hoangOc },
            { label:"Tam Tai", val:analysis.tamTai },
          ].map(({ label, val }) => (
            <div key={label} className="py-4 text-center">
              <p className="text-2xl mb-1">{val ? "⚠️" : "✅"}</p>
              <p className="text-xs font-medium" style={{ color:"var(--text-primary)" }}>{label}</p>
              <p className="text-xs mt-0.5 font-semibold" style={{ color: val ? "var(--accent-red)" : "var(--accent-emerald)" }}>
                {val ? "Có hạn" : "Bình an"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Việc lớn */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-2 divide-x" style={{ borderColor: "var(--border-subtle)" }}>
          {[{ label:"💍 Kết hôn", info:analysis.ketHon },
            { label:"🏗 Xây nhà", info:analysis.xayNha }].map(({ label, info }) => (
            <div key={label} className="p-4">
              <p className="text-xs mb-1" style={{ color:"var(--text-muted)" }}>{label}</p>
              <p className="text-xs font-semibold" style={{ color: info.good ? "var(--accent-emerald)" : "var(--accent-red)" }}>
                {info.good ? "✅ Thuận lợi" : "⚠️ " + info.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card p-4">
        {analysis.tips.map((tip:string, i:number) => (
          <p key={i} className="flex gap-2 text-xs leading-relaxed mb-1.5">
            <span style={{ color: "var(--gold)" }}>✦</span>
            <span style={{ color: "var(--text-secondary)" }}>{tip}</span>
          </p>
        ))}
      </div>
    </motion.div>
  );
}
