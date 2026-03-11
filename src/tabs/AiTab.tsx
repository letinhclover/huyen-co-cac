// ============================================================
// AiTab.tsx — Tab AI Luận Giải + Thần Số Học
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FortuneCard }          from "../components/FortuneCard";
import { UserProfile }          from "../utils/astrology";
import { buildNumerologyProfile, getPersonalYearInfo } from "../utils/numerology";

interface AiTabProps {
  date:          Date;
  userProfile:   UserProfile | null;
  onSetupProfile: () => void;
}

type SubTab = "ai" | "numerology";

export function AiTab({ date, userProfile, onSetupProfile }: AiTabProps) {
  const [sub, setSub] = useState<SubTab>("ai");

  return (
    <div className="pb-2">
      {/* Sub-tab switcher */}
      <div className="mx-4 mt-4 mb-1 flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6">
        {([
          { id: "ai"        as SubTab, emoji: "✨", label: "AI Luận Giải"  },
          { id: "numerology" as SubTab, emoji: "🔢", label: "Thần Số Học"  },
        ]).map(t => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSub(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all ${
              sub === t.id
                ? "bg-violet-500/25 border border-violet-400/30 text-violet-200"
                : "text-white/35 hover:text-white/55"
            }`}
          >
            <span>{t.emoji}</span>{t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sub === "ai" && (
          <motion.div key="ai"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <FortuneCard date={date} userProfile={userProfile} onSetupProfile={onSetupProfile} />
          </motion.div>
        )}
        {sub === "numerology" && (
          <motion.div key="num"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <NumerologyView userProfile={userProfile} onSetupProfile={onSetupProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Numerology View ──────────────────────────────────────────

function NumerologyView({ userProfile, onSetupProfile }: {
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}) {
  if (!userProfile) {
    return (
      <div className="mx-4 mt-3 rounded-2xl border border-white/8 bg-white/3 px-5 py-6 flex flex-col items-center gap-3 text-center">
        <span className="text-3xl">🔢</span>
        <p className="text-white/70 text-sm font-medium">Cần ngày sinh đầy đủ</p>
        <p className="text-white/30 text-xs leading-relaxed">Thiết lập bản mệnh để xem Thần Số Học cá nhân hóa</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onSetupProfile}
          className="rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs px-5 py-2">
          Thiết lập ngay →
        </motion.button>
      </div>
    );
  }

  // Lấy ngày tháng từ profile (lưu trong localStorage)
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem("huyen_co_cac_dob") ?? "null"); }
    catch { return null; }
  })() as { day: number; month: number; year: number } | null;

  if (!saved) {
    return (
      <div className="mx-4 mt-3 rounded-2xl border border-white/8 bg-white/3 px-5 py-6 flex flex-col items-center gap-3 text-center">
        <span className="text-3xl">📅</span>
        <p className="text-white/70 text-sm font-medium">Cần ngày và tháng sinh</p>
        <p className="text-white/30 text-xs leading-relaxed">Cập nhật ngày sinh đầy đủ trong tab Bản Mệnh</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onSetupProfile}
          className="rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs px-5 py-2">
          Cập nhật →
        </motion.button>
      </div>
    );
  }

  const num         = buildNumerologyProfile(saved.day, saved.month, saved.year);
  const pyInfo      = getPersonalYearInfo(num.personalYear);
  const currentYear = new Date().getFullYear();

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3">

      {/* Life Path — main card */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-violet-900/5 p-5">
        <div className="flex items-start gap-4">
          {/* Big number */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl border border-violet-400/30 bg-violet-500/15 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-violet-200">{num.lifePathNumber}</span>
            <span className="text-[9px] text-violet-400/60 tracking-widest uppercase mt-0.5">Con Số</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-violet-400/55 tracking-widest uppercase mb-1">Số Đường Đời</p>
            <p className="text-white/85 text-sm font-semibold leading-tight">{num.lifePathInfo.title}</p>
            <p className="text-amber-400/70 text-[10px] mt-1">{num.lifePathInfo.keyword}</p>
          </div>
        </div>

        <p className="text-white/60 text-xs leading-relaxed mt-4">{num.lifePathInfo.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-green-900/15 border border-green-500/15 px-3 py-2.5">
            <p className="text-[9px] text-green-400/60 tracking-widest uppercase mb-1.5">Thế Mạnh</p>
            {num.lifePathInfo.strengths.map((s, i) => (
              <p key={i} className="text-white/55 text-[10px] leading-relaxed">· {s}</p>
            ))}
          </div>
          <div className="rounded-xl bg-red-900/10 border border-red-500/10 px-3 py-2.5">
            <p className="text-[9px] text-red-400/50 tracking-widest uppercase mb-1.5">Thách Thức</p>
            {num.lifePathInfo.challenges.map((c, i) => (
              <p key={i} className="text-white/55 text-[10px] leading-relaxed">· {c}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Year */}
      <div className="rounded-2xl border border-amber-500/15 bg-amber-900/8 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/25 flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-base font-bold text-amber-300">{num.personalYear}</span>
          </div>
          <div>
            <p className="text-[9px] text-amber-400/55 tracking-widest uppercase">Năm Cá Nhân {currentYear}</p>
            <p className="text-white/80 text-sm font-medium">{pyInfo.title}</p>
          </div>
        </div>
        <p className="text-white/55 text-xs leading-relaxed">{pyInfo.summary}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {pyInfo.focus.split(" · ").map((f, i) => (
            <span key={i} className="text-[9px] text-amber-400/60 border border-amber-400/15 rounded-full px-2 py-0.5">{f}</span>
          ))}
        </div>
      </div>

      {/* Birth Day + Soul Urge */}
      <div className="grid grid-cols-2 gap-2">
        <MiniNumCard
          label="Số Ngày Sinh"
          n={num.birthDay}
          title={num.birthDayInfo.title.split("—")[1]?.trim() ?? ""}
          keyword={num.birthDayInfo.keyword}
          colorHex={num.birthDayInfo.colorHex}
        />
        <MiniNumCard
          label="Số Linh Hồn"
          n={num.soulUrge}
          title={num.soulUrgeInfo.title.split("—")[1]?.trim() ?? ""}
          keyword={num.soulUrgeInfo.keyword}
          colorHex={num.soulUrgeInfo.colorHex}
        />
      </div>

      {/* Color */}
      <div className="rounded-2xl border border-white/6 bg-white/3 px-4 py-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 flex-shrink-0"
          style={{ backgroundColor: num.lifePathInfo.colorHex + "55" }} />
        <div>
          <p className="text-[9px] text-white/30 tracking-widest uppercase">Màu May Mắn</p>
          <p className="text-white/65 text-xs">{num.lifePathInfo.color}</p>
        </div>
      </div>
    </div>
  );
}

function MiniNumCard({ label, n, title, keyword, colorHex }: {
  label: string; n: number; title: string; keyword: string; colorHex: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-3">
      <p className="text-[9px] text-white/30 tracking-widest uppercase mb-2">{label}</p>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl font-bold" style={{ color: colorHex }}>{n}</span>
        <p className="text-white/65 text-xs font-medium leading-tight">{title}</p>
      </div>
      <p className="text-white/35 text-[9px] leading-relaxed">{keyword}</p>
    </div>
  );
}
