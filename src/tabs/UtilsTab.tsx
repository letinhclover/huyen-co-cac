// ============================================================
// UtilsTab.tsx — Tiện Ích
// Đổi ngày âm↔dương · Tuổi xây nhà/kết hôn · Ngày tốt
// ============================================================

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunarFull, analyzeAge, getDayInfo, getGoodDaysInMonth, getGoodYears } from "../utils/almanac";
import { UserProfile } from "../utils/astrology";

interface UtilsTabProps {
  userProfile:    UserProfile | null;
  onSetupProfile: () => void;
}

type Tool = "convert" | "age" | "gooddays";

export function UtilsTab({ userProfile, onSetupProfile }: UtilsTabProps) {
  const [tool, setTool] = useState<Tool>("convert");

  const TOOLS = [
    { id: "convert"  as Tool, emoji: "🔄", label: "Đổi Ngày"  },
    { id: "age"      as Tool, emoji: "🏠", label: "Xem Tuổi"  },
    { id: "gooddays" as Tool, emoji: "📆", label: "Ngày Tốt"  },
  ];

  return (
    <div className="pb-2">
      {/* Tool selector */}
      <div className="mx-4 mt-4 mb-1 flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6">
        {TOOLS.map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.94 }} onClick={() => setTool(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition-all ${
              tool === t.id
                ? "bg-amber-500/20 border border-amber-400/30 text-amber-200"
                : "text-white/35 hover:text-white/55"
            }`}>
            <span>{t.emoji}</span>{t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tool === "convert" && (
          <motion.div key="conv" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DateConverter />
          </motion.div>
        )}
        {tool === "age" && (
          <motion.div key="age" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AgeChecker userProfile={userProfile} onSetupProfile={onSetupProfile} />
          </motion.div>
        )}
        {tool === "gooddays" && (
          <motion.div key="gd" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GoodDaysFinder />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 1. Đổi ngày dương ↔ âm ──────────────────────────────────

function DateConverter() {
  const today  = new Date();
  const [day,   setDay]   = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year,  setYear]  = useState(today.getFullYear());
  const [result, setResult] = useState<ReturnType<typeof solarToLunarFull> | null>(null);
  const [dayInfo, setDayInfo] = useState<ReturnType<typeof getDayInfo> | null>(null);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    setError("");
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      setError("Ngày tháng không hợp lệ"); return;
    }
    try {
      const r = solarToLunarFull(day, month, year);
      const d = getDayInfo(day, month, year);
      setResult(r);
      setDayInfo(d);
    } catch { setError("Không chuyển đổi được ngày này"); }
  }, [day, month, year]);

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3">
      {/* Input */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-[10px] text-white/35 tracking-widest uppercase mb-3">🔄 Nhập Ngày Dương Lịch</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Ngày</label>
            <input type="number" min={1} max={31} value={day}
              onChange={e => setDay(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Tháng</label>
            <input type="number" min={1} max={12} value={month}
              onChange={e => setMonth(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
          <div className="flex-1 flex-grow-2">
            <label className="text-[10px] text-white/30 mb-1 block">Năm</label>
            <input type="number" min={1900} max={2100} value={year}
              onChange={e => setYear(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
        </div>
        {error && <p className="text-red-400/70 text-xs mt-2">{error}</p>}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleConvert}
          className="w-full mt-3 py-2.5 rounded-xl bg-amber-500/18 border border-amber-400/25 text-amber-200 text-sm font-medium">
          Tra Cứu →
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && dayInfo && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">

            {/* Date info */}
            <div className="rounded-2xl border border-amber-500/15 bg-amber-900/8 p-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Dương lịch" value={`${result.weekday}, ${day}/${month}/${year}`} />
                <InfoRow label="Âm lịch" value={`${result.lunar.isLeap ? "Nhuận " : ""}${result.lunar.day}/${result.lunar.month}/${result.lunar.year}`} />
                <InfoRow label="Can Chi ngày" value={result.canChiDay} />
                <InfoRow label="Can Chi tháng" value={result.canChiMonth} />
                <InfoRow label="Can Chi năm" value={result.canChiYear} />
                <InfoRow label="Trực hôm nay" value={dayInfo.truc} />
              </div>
            </div>

            {/* Day rating */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/30 tracking-widest uppercase">Đánh Giá Ngày</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`text-sm ${i <= dayInfo.starCount ? "text-amber-400" : "text-white/15"}`}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-white/55 text-xs leading-relaxed mb-3">{dayInfo.trucMeaning}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-green-400/60 uppercase tracking-widest mb-1">✅ Nên làm</p>
                  {dayInfo.goodFor.slice(0, 4).map((g, i) => (
                    <p key={i} className="text-white/50 text-[10px]">· {g}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[9px] text-red-400/60 uppercase tracking-widest mb-1">❌ Nên tránh</p>
                  {dayInfo.badFor.slice(0, 4).map((b, i) => (
                    <p key={i} className="text-white/50 text-[10px]">· {b}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 2. Xem tuổi xây nhà / kết hôn ──────────────────────────

function AgeChecker({ userProfile, onSetupProfile }: { userProfile: UserProfile | null; onSetupProfile: () => void }) {
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState(userProfile?.birthYear ?? 1990);
  const [checkYear, setCheckYear] = useState(currentYear);
  const [result, setResult] = useState<ReturnType<typeof analyzeAge> | null>(null);
  const [goodXayNha, setGoodXayNha] = useState<number[]>([]);
  const [goodKetHon, setGoodKetHon] = useState<number[]>([]);

  const handleCheck = useCallback(() => {
    const r = analyzeAge(birthYear, checkYear);
    setResult(r);
    setGoodXayNha(getGoodYears(birthYear, "xayNha", currentYear, 3));
    setGoodKetHon(getGoodYears(birthYear, "ketHon", currentYear, 3));
  }, [birthYear, checkYear, currentYear]);

  const OVERALL_STYLE: Record<string, string> = {
    "tốt":              "border-green-500/25 bg-green-900/10",
    "trung bình":       "border-blue-500/20 bg-blue-900/8",
    "cần cúng giải":    "border-amber-500/25 bg-amber-900/10",
    "nên tránh":        "border-red-500/25 bg-red-900/10",
  };

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3">
      {/* Input */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-[10px] text-white/35 tracking-widest uppercase mb-3">🏠 Kim Lâu · Hoàng Ốc · Tam Tai</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Năm sinh</label>
            <input type="number" min={1920} max={2010} value={birthYear}
              onChange={e => setBirthYear(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Xem năm</label>
            <input type="number" min={2024} max={2040} value={checkYear}
              onChange={e => setCheckYear(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
        </div>
        {userProfile && (
          <button onClick={() => setBirthYear(userProfile.birthYear)}
            className="mt-2 text-amber-400/50 text-[10px] hover:text-amber-400/70 transition-colors">
            Dùng năm sinh của tôi ({userProfile.birthYear}) →
          </button>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          className="w-full mt-3 py-2.5 rounded-xl bg-amber-500/18 border border-amber-400/25 text-amber-200 text-sm font-medium">
          Kiểm Tra →
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">

            {/* Overall */}
            <div className={`rounded-2xl border p-4 ${OVERALL_STYLE[result.overall] ?? ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[9px] text-white/30 tracking-widest uppercase">Tuổi âm {result.age} · Năm {checkYear}</p>
                  <p className="text-white/85 text-sm font-semibold mt-0.5">
                    {result.overall === "tốt" ? "✅" : result.overall === "nên tránh" ? "🚫" : result.overall === "cần cúng giải" ? "⚠️" : "🔵"} Năm này {result.overall}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <Badge label="Kim Lâu" active={result.kimLau} color="red" />
                <Badge label="Hoàng Ốc" active={result.hoangOc} color="amber" />
                <Badge label="Tam Tai" active={result.tamTai} color="blue" />
              </div>
              {result.tips.map((t, i) => (
                <p key={i} className="text-white/50 text-xs leading-relaxed">· {t}</p>
              ))}
            </div>

            {/* Kết hôn / Xây nhà */}
            <div className="grid grid-cols-2 gap-2">
              <AnalysisCard icon="💍" title="Kết Hôn" good={result.ketHon.good} reason={result.ketHon.reason} />
              <AnalysisCard icon="🏗️" title="Xây Nhà" good={result.xayNha.good} reason={result.xayNha.reason} />
            </div>

            {/* Năm tốt gần nhất */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <p className="text-[10px] text-white/30 tracking-widest uppercase mb-3">Năm Tốt Sắp Tới</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] text-green-400/60 uppercase tracking-widest mb-1.5">💍 Kết hôn</p>
                  {goodKetHon.map(y => <p key={y} className="text-white/65 text-xs">· {y}</p>)}
                </div>
                <div>
                  <p className="text-[9px] text-green-400/60 uppercase tracking-widest mb-1.5">🏗️ Xây nhà</p>
                  {goodXayNha.map(y => <p key={y} className="text-white/65 text-xs">· {y}</p>)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 3. Ngày tốt trong tháng ─────────────────────────────────

function GoodDaysFinder() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year,  setYear]  = useState(today.getFullYear());
  const [days,  setDays]  = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const handleFind = useCallback(() => {
    const good = getGoodDaysInMonth(month, year);
    setDays(good);
    setChecked(true);
  }, [month, year]);

  const MONTHS = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
                  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3">
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-[10px] text-white/35 tracking-widest uppercase mb-3">📆 Ngày Tốt Trong Tháng</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Tháng</label>
            <select value={month} onChange={e => setMonth(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-amber-400/40 appearance-none text-center">
              {MONTHS.map((m, i) => <option key={i} value={i+1} className="bg-[#0B0F1A]">{m}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-white/30 mb-1 block">Năm</label>
            <input type="number" min={2024} max={2035} value={year}
              onChange={e => setYear(+e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm text-center focus:outline-none focus:border-amber-400/40" />
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleFind}
          className="w-full mt-3 py-2.5 rounded-xl bg-amber-500/18 border border-amber-400/25 text-amber-200 text-sm font-medium">
          Tìm Ngày Tốt →
        </motion.button>
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {days.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-5 text-center">
                <p className="text-white/40 text-sm">Không có ngày đặc biệt tốt trong tháng này</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/15 bg-amber-900/8 p-4">
                <p className="text-[10px] text-amber-400/55 tracking-widest uppercase mb-3">
                  ✨ {days.length} Ngày Tốt — {MONTHS[month-1]} {year}
                </p>
                <div className="flex flex-wrap gap-2">
                  {days.map(d => {
                    const info = getDayInfo(d, month, year);
                    return (
                      <div key={d} className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-center min-w-[56px]">
                        <p className="text-amber-200 text-base font-bold">{d}</p>
                        <p className="text-amber-400/60 text-[9px] mt-0.5">{info.truc}</p>
                        <div className="flex justify-center gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className={`text-[8px] ${i <= info.starCount ? "text-amber-400" : "text-white/10"}`}>★</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-white/25 text-[10px] mt-3 leading-relaxed">
                  * Dựa theo 12 Trực (Thành, Khai, Định, Mãn, Kiến). Vẫn nên kết hợp xem tuổi và Can Chi ngày cho việc quan trọng.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">{label}</p>
      <p className="text-white/75 text-xs font-medium">{value}</p>
    </div>
  );
}

function Badge({ label, active, color }: { label: string; active: boolean; color: "red" | "amber" | "blue" }) {
  const styles = {
    red:   active ? "border-red-400/40 bg-red-500/15 text-red-300"     : "border-white/8 bg-white/3 text-white/25",
    amber: active ? "border-amber-400/40 bg-amber-500/15 text-amber-300" : "border-white/8 bg-white/3 text-white/25",
    blue:  active ? "border-blue-400/40 bg-blue-500/15 text-blue-300"   : "border-white/8 bg-white/3 text-white/25",
  };
  return (
    <span className={`text-[10px] font-medium border rounded-full px-2.5 py-0.5 ${styles[color]}`}>
      {active ? "⚠ " : ""}{label}
    </span>
  );
}

function AnalysisCard({ icon, title, good, reason }: { icon: string; title: string; good: boolean; reason: string }) {
  return (
    <div className={`rounded-xl border p-3 ${good ? "border-green-500/20 bg-green-900/10" : "border-red-500/15 bg-red-900/8"}`}>
      <p className="text-xs font-medium text-white/70 mb-1">{icon} {title}</p>
      <p className={`text-[9px] font-bold mb-1 ${good ? "text-green-400" : "text-red-400"}`}>
        {good ? "✅ Thuận lợi" : "⚠️ Cần cân nhắc"}
      </p>
      <p className="text-white/40 text-[9px] leading-relaxed">{reason}</p>
    </div>
  );
}
