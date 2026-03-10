// ============================================================
// PersonalEnergy.tsx — Thanh Năng Lượng Cá Nhân Hóa
// ============================================================

import { useMemo } from "react";
import { motion } from "framer-motion";
import { UserProfile, calculateDailyEnergy } from "../utils/astrology";
import { ENERGY_ADVICES } from "../data/fortunes";

interface PersonalEnergyProps {
  userProfile: UserProfile | null;
  currentDate: Date;
  onSetupProfile: () => void;
}

export function PersonalEnergy({ userProfile, currentDate, onSetupProfile }: PersonalEnergyProps) {
  const energyResult = useMemo(() => {
    if (!userProfile) return null;
    return calculateDailyEnergy(userProfile, currentDate);
  }, [userProfile, currentDate]);

  const energyAdvice = useMemo(() => {
    if (!energyResult) return null;
    const matching = ENERGY_ADVICES.filter(
      (a) => a.level === energyResult.status.replace("mild_conflict", "medium").replace("conflict", "low").replace("harmony", "high") as "high" | "medium" | "low"
    );
    if (matching.length === 0) return ENERGY_ADVICES[0];
    const dateKey = currentDate.getDate() + currentDate.getMonth() * 31;
    return matching[dateKey % matching.length];
  }, [energyResult, currentDate]);

  // ─── No Profile State ────────────────────────────────────
  if (!userProfile || !energyResult || !energyAdvice) {
    return (
      <div className="mx-4 my-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg px-5 py-6 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
            🔮
          </div>
          <div>
            <p className="text-white/80 text-base font-medium mb-1">Chưa có Bản Mệnh</p>
            <p className="text-white/40 text-sm leading-relaxed">
              Thiết lập năm sinh để xem chỉ số năng lượng cá nhân hóa của bạn mỗi ngày
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSetupProfile}
            className="rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium px-6 py-2.5 hover:bg-amber-500/30 transition-colors"
          >
            Thiết Lập Bản Mệnh →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const score = energyResult.score;
  const barColor =
    score >= 70
      ? "from-emerald-500 to-emerald-400"
      : score >= 45
      ? "from-amber-500 to-amber-400"
      : "from-red-500 to-red-400";

  const glowColor =
    score >= 70
      ? "shadow-emerald-500/20"
      : score >= 45
      ? "shadow-amber-500/20"
      : "shadow-red-500/20";

  return (
    <div className="mx-4 my-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden shadow-xl ${glowColor}`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-amber-400/70 tracking-widest uppercase">Năng Lượng Hôm Nay</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                score >= 70 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                score >= 45 ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                "border-red-500/30 bg-red-500/10 text-red-400"
              }`}>
                {energyResult.statusLabel}
              </span>
            </div>
            <p className="text-white/85 text-sm leading-relaxed font-light">
              {energyResult.headline}
            </p>
          </div>
          {/* Score circle */}
          <EnergyScoreRing score={score} barColor={barColor} />
        </div>

        {/* Energy Bar */}
        <div className="px-5 pb-4">
          <div className="relative h-2.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 4 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/25 text-[10px]">Thấp</span>
            <span className="text-white/25 text-[10px]">Cao</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5" />

        {/* Main advice */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{energyAdvice.emoji}</span>
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-1">{energyAdvice.headline}</p>
              <p className="text-white/55 text-sm leading-relaxed">{energyResult.detail}</p>
            </div>
          </div>
        </div>

        {/* Detail advice tip */}
        <div className="mx-5 mb-5 rounded-xl bg-white/3 border border-white/5 px-4 py-3 flex items-start gap-2.5">
          <span className="text-amber-400/70 text-sm mt-0.5">💡</span>
          <p className="text-white/50 text-xs leading-relaxed flex-1">{energyAdvice.tip}</p>
        </div>

        {/* Lucky color + avoid row */}
        <div className="grid grid-cols-2 border-t border-white/5">
          <div className="px-5 py-3.5 border-r border-white/5">
            <p className="text-[10px] text-white/30 tracking-wider uppercase mb-1">Màu Hợp Hôm Nay</p>
            <p className="text-white/70 text-xs">{energyResult.luckyColor}</p>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-[10px] text-white/30 tracking-wider uppercase mb-1">Nên Tránh</p>
            <p className="text-white/70 text-xs">{energyResult.avoidAction}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Energy Score Ring ────────────────────────────────────────

interface EnergyScoreRingProps {
  score: number;
  barColor: string;
}

function EnergyScoreRing({ score, barColor }: EnergyScoreRingProps) {
  const radius = 22;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    barColor.includes("emerald") ? "#34d399" :
    barColor.includes("amber") ? "#f59e0b" :
    "#f87171";

  return (
    <div className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="28" cy="28" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <span className="relative text-white/90 text-sm font-semibold z-10">{score}%</span>
    </div>
  );
}
