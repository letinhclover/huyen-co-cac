// ============================================================
// UtilsTab.tsx — Tiện Ích Lịch Vạn Niên
// Sử dụng dữ liệu thật từ lichvn.pak
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeDayFull, getGoodDaysInMonth, analyzeAge } from "../utils/almanac";
import { DayDetailPanel } from "../components/DayDetailPanel";

type Tool = "ngaytot" | "doingay" | "xemtuoi";

interface Props {
  birthYear?: number;
}

export function UtilsTab({ birthYear }: Props) {
  const [tool, setTool] = useState<Tool>("ngaytot");

  return (
    <div className="flex flex-col gap-0 pb-8">
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={{ background: "rgba(8,12,24,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="grid grid-cols-3 gap-1 rounded-xl p-1 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
          {([
            ["ngaytot", "🗓", "Ngày Tốt"],
            ["doingay", "🔄", "Đổi Ngày"],
            ["xemtuoi", "👤", "Xem Tuổi"],
          ] as [Tool, string, string][]).map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={"py-2 rounded-lg text-xs font-medium transition-all " + (tool === id ? "text-yellow-300 bg-yellow-500/15 border border-yellow-500/30" : "text-gray-400")}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4">
        <AnimatePresence mode="wait">
          {tool === "ngaytot"  && <NgayTotTool key="ngaytot" />}
          {tool === "doingay"  && <DoiNgayTool key="doingay" />}
          {tool === "xemtuoi"  && <XemTuoiTool key="xemtuoi" birthYear={birthYear} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NgayTotTool() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const [purpose, setPurpose] = useState<"kinhDoanh"|"cuoiHoi"|"xayDung"|"anTang">("kinhDoanh");
  const [expanded, setExpanded] = useState<number | null>(null);

  const goodDays = useMemo(() => getGoodDaysInMonth(month, year, purpose), [month, year, purpose]);

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y+1); } else setMonth(m => m+1); };

  const purposeLabels: Record<string,string> = {
    kinhDoanh:"💼 Kinh Doanh", cuoiHoi:"💍 Cưới Hỏi", xayDung:"🏗 Xây Dựng", anTang:"⚱ An Táng"
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full border border-white/12 text-white flex items-center justify-center">‹</button>
        <p className="text-base font-bold text-white">Tháng {month}/{year}</p>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full border border-white/12 text-white flex items-center justify-center">›</button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {(["kinhDoanh","cuoiHoi","xayDung","anTang"] as const).map(p => (
          <button key={p} onClick={() => setPurpose(p)}
            className={"py-2 rounded-xl text-xs font-medium border transition-all " + (purpose === p ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300" : "bg-white/3 border-white/8 text-gray-400")}
          >{purposeLabels[p]}</button>
        ))}
      </div>
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(15,20,40,0.9)" }}>
        <div className="px-4 py-3 border-b border-white/6">
          <p className="text-sm text-gray-300">
            <span className="text-yellow-400 font-bold">{goodDays.length}</span> ngày tốt cho {purposeLabels[purpose].replace(/^[^ ]+ /,"")}
          </p>
        </div>
        {goodDays.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">Không có ngày tốt tháng này</p>
        ) : (
          <div className="divide-y divide-white/4">
            {goodDays.map(({ day, info }) => (
              <div key={day}>
                <button
                  className="w-full px-4 py-3 flex items-center justify-between active:bg-white/4"
                  onClick={() => setExpanded(expanded === day ? null : day)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: info.isTot ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)", color: info.isTot ? "#22c55e" : "#eab308" }}>
                      {day}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white">{info.canChiDay}</p>
                      <p className="text-xs text-gray-400">{info.lunarDate} · Trực {info.truc.ten}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={"text-xs " + (i <= info.rating[purpose] ? "text-yellow-400" : "text-gray-700")}>★</span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs">{expanded===day?"▲":"▼"}</span>
                  </div>
                </button>
                <AnimatePresence>
                  {expanded === day && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden px-4 pb-3">
                      {info.saoTot.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {info.saoTot.slice(0,4).map(s => (
                            <span key={s.id} className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">{s.name}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400">{info.summary}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DoiNgayTool() {
  const now = new Date();
  const [day,   setDay]   = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const targetDate = useMemo(() => new Date(year, month - 1, day), [day, month, year]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col gap-3 pt-2">
      <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(15,20,40,0.9)" }}>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Chọn Ngày Dương Lịch</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label:"Ngày", val:day, set:setDay, min:1, max:31 },
            { label:"Tháng", val:month, set:setMonth, min:1, max:12 },
            { label:"Năm", val:year, set:setYear, min:1900, max:2100 },
          ].map(({ label, val, set, min, max }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="text-xs text-gray-500">{label}</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded text-white border border-white/12 text-sm active:opacity-70" onClick={() => set((v: number) => Math.max(min, v-1))}>−</button>
                <span className="w-10 text-center text-white text-sm font-bold">{val}</span>
                <button className="w-7 h-7 rounded text-white border border-white/12 text-sm active:opacity-70" onClick={() => set((v: number) => Math.min(max, v+1))}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DayDetailPanel date={targetDate} />
    </motion.div>
  );
}

function XemTuoiTool({ birthYear }: { birthYear?: number }) {
  const [by, setBy] = useState(birthYear ?? 1990);
  const curYear = new Date().getFullYear();
  const [checkYear, setCheckYear] = useState(curYear);
  const analysis = useMemo(() => analyzeAge(by, checkYear), [by, checkYear]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col gap-3 pt-2">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:"Năm Sinh", val:by, set:setBy },
          { label:"Năm Kiểm Tra", val:checkYear, set:setCheckYear },
        ].map(({ label, val, set }) => (
          <div key={label} className="rounded-2xl border border-white/8 p-3" style={{ background:"rgba(15,20,40,0.9)" }}>
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <div className="flex items-center gap-1 justify-center">
              <button className="w-7 h-7 rounded text-white border border-white/12 text-sm active:opacity-70" onClick={() => set((v: number) => v-1)}>−</button>
              <span className="w-14 text-center text-white font-bold">{val}</span>
              <button className="w-7 h-7 rounded text-white border border-white/12 text-sm active:opacity-70" onClick={() => set((v: number) => v+1)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(15,20,40,0.9)", borderColor: analysis.overallColor + "44" }}>
        <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Tuổi {analysis.age} · Năm {checkYear}</p>
            <p className="text-lg font-bold" style={{ color: analysis.overallColor }}>{analysis.overall.toUpperCase()}</p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl" style={{ borderColor: analysis.overallColor }}>
            {analysis.overall === "tốt" ? "✅" : analysis.overall === "nên tránh" ? "🚫" : "⚠️"}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/6">
          {[
            { label:"Kim Lâu", val:analysis.kimLau },
            { label:"Hoàng Ốc", val:analysis.hoangOc },
            { label:"Tam Tai",  val:analysis.tamTai },
          ].map(({ label, val }) => (
            <div key={label} className="py-3 text-center">
              <p className="text-lg">{val ? "⚠️" : "✅"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              <p className={"text-xs font-medium mt-0.5 " + (val ? "text-red-400" : "text-emerald-400")}>{val ? "Có hạn" : "Không"}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/6 border-t border-white/6">
          {[
            { label:"💍 Kết hôn", info:analysis.ketHon },
            { label:"🏗 Xây nhà", info:analysis.xayNha },
          ].map(({ label, info }) => (
            <div key={label} className="px-3 py-3">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={"text-xs font-medium " + (info.good ? "text-emerald-400" : "text-red-400")}>
                {info.good ? "✅ Thuận lợi" : "⚠️ " + info.reason}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-white/6">
          {analysis.tips.map((tip: string, i: number) => (
            <p key={i} className="text-xs text-gray-300 flex items-start gap-1.5 mb-1">
              <span className="text-yellow-500 mt-0.5">•</span>{tip}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
