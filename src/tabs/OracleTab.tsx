// ============================================================
// OracleTab.tsx — Nghi Thức Gieo Quẻ
// ============================================================

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORACLE_MESSAGES, OracleMessage } from "../data/fortunes";

type OracleState = "idle" | "shaking" | "revealing" | "done";

const CATEGORY_COLORS: Record<string, string> = {
  love:       "from-rose-500/20 to-pink-500/10 border-rose-500/20 text-rose-300",
  work:       "from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-300",
  healing:    "from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-300",
  motivation: "from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-300",
  money:      "from-emerald-500/20 to-green-500/10 border-emerald-500/20 text-emerald-300",
  friendship: "from-sky-500/20 to-cyan-500/10 border-sky-500/20 text-sky-300",
};

export function OracleTab() {
  const [state, setState] = useState<OracleState>("idle");
  const [currentOracle, setCurrentOracle] = useState<OracleMessage | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());

  const pickRandomOracle = useCallback(() => {
    let pool = ORACLE_MESSAGES.filter((m) => !usedIds.has(m.id));
    if (pool.length === 0) {
      setUsedIds(new Set());
      pool = ORACLE_MESSAGES;
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setUsedIds((prev) => new Set([...prev, picked.id]));
    return picked;
  }, [usedIds]);

  const handleCast = useCallback(async () => {
    if (state !== "idle" && state !== "done") return;
    setIsFlipped(false);
    setCurrentOracle(null);
    setState("shaking");

    // Shake for 2s
    await new Promise((r) => setTimeout(r, 2000));

    // Pick oracle
    const oracle = pickRandomOracle();
    setCurrentOracle(oracle);
    setState("revealing");

    // Brief delay then flip
    await new Promise((r) => setTimeout(r, 400));
    setIsFlipped(true);

    await new Promise((r) => setTimeout(r, 600));
    setState("done");
  }, [state, pickRandomOracle]);

  const colorClass = currentOracle ? CATEGORY_COLORS[currentOracle.category] : "";

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-amber-400/60 tracking-[0.35em] uppercase mb-1"
        >
          Nghi Thức Tâm Linh
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white/90"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Gieo Quẻ Hôm Nay
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/35 text-sm mt-2 leading-relaxed"
        >
          Hít thở sâu, tập trung vào điều bạn muốn hỏi,{" "}
          <br className="hidden sm:block" />
          rồi chạm vào cổ thư bên dưới
        </motion.p>
      </div>

      {/* Main oracle area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-6">

        {/* Ancient book / trigger area */}
        <OracleTrigger state={state} onCast={handleCast} />

        {/* Oracle card reveal */}
        <AnimatePresence>
          {currentOracle && (
            <OracleCard
              oracle={currentOracle}
              isFlipped={isFlipped}
              colorClass={colorClass}
            />
          )}
        </AnimatePresence>

        {/* Cast again button */}
        <AnimatePresence>
          {state === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCast}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-white/50 text-sm px-6 py-3 hover:border-amber-500/20 hover:text-amber-400/70 transition-all"
              >
                ✦ Gieo Quẻ Lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom note */}
      <div className="px-4 pb-6 text-center">
        <p className="text-white/15 text-xs tracking-wide">
          Mỗi quẻ là một góc nhìn — bạn mới là người quyết định hành động
        </p>
      </div>
    </div>
  );
}

// ─── Oracle Trigger (Shaking Book) ───────────────────────────

interface OracleTriggerProps {
  state: OracleState;
  onCast: () => void;
}

const shakeVariants = {
  idle: { rotate: 0, x: 0 },
  shaking: {
    rotate: [0, -6, 6, -8, 8, -5, 5, -3, 3, 0],
    x: [0, -4, 4, -6, 6, -4, 4, -2, 2, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 0.92, 1],
    },
  },
};

const glowVariants = {
  idle:     { opacity: 0.3, scale: 1 },
  shaking:  { opacity: [0.3, 0.8, 0.5, 1, 0.6, 0.9, 0.4, 0.8, 1, 0.5], scale: [1, 1.2, 1, 1.3, 1.1, 1.2, 1, 1.1, 1.3, 1], transition: { duration: 2 } },
  revealing:{ opacity: 1, scale: 1.3 },
  done:     { opacity: 0.2, scale: 0.9 },
};

function OracleTrigger({ state, onCast }: OracleTriggerProps) {
  const isActive = state === "idle" || state === "done";

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl"
        variants={glowVariants}
        animate={state}
      />

      <motion.button
        variants={shakeVariants}
        animate={state === "shaking" ? "shaking" : "idle"}
        onClick={isActive ? onCast : undefined}
        whileHover={isActive ? { scale: 1.06 } : {}}
        whileTap={isActive ? { scale: 0.94 } : {}}
        className={`relative w-40 h-40 rounded-3xl border bg-gradient-to-br from-amber-900/30 via-stone-900/40 to-amber-950/30 backdrop-blur-lg flex flex-col items-center justify-center gap-2 shadow-2xl transition-colors ${
          isActive
            ? "border-amber-500/30 cursor-pointer hover:border-amber-400/50"
            : "border-white/10 cursor-default"
        }`}
      >
        {/* Inner decoration */}
        <div className="absolute inset-3 rounded-2xl border border-amber-500/10 pointer-events-none" />
        <div className="absolute inset-6 rounded-xl border border-amber-500/5 pointer-events-none" />

        {/* Book emoji / symbol */}
        <motion.span
          className="text-5xl select-none"
          animate={state === "shaking" ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
          transition={{ duration: 2 }}
        >
          📿
        </motion.span>

        {/* State text */}
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-amber-400/70 text-xs tracking-widest"
            >
              Chạm Để Gieo
            </motion.span>
          )}
          {state === "shaking" && (
            <motion.span
              key="shaking"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{ duration: 2 }}
              className="text-amber-300/90 text-xs tracking-widest"
            >
              Đang Chiêm...
            </motion.span>
          )}
          {(state === "revealing" || state === "done") && (
            <motion.span
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-amber-500/40 text-xs tracking-widest"
            >
              Đã Hiện
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Ripple effects when shaking */}
      <AnimatePresence>
        {state === "shaking" && (
          <>
            {[0, 0.4, 0.8].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute w-40 h-40 rounded-3xl border border-amber-400/20"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, delay, repeat: Infinity }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Oracle Card (Flip Reveal) ────────────────────────────────

interface OracleCardProps {
  oracle: OracleMessage;
  isFlipped: boolean;
  colorClass: string;
}

function OracleCard({ oracle, isFlipped, colorClass }: OracleCardProps) {
  const [r, g] = colorClass.split(" ");
  const gradientPart = r + " " + g;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm"
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}
        className="w-full"
      >
        {/* Back of card (shown first) */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "absolute", inset: 0, transform: "rotateY(180deg)" }}
          className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/20 to-stone-900/30 backdrop-blur-lg flex items-center justify-center min-h-32"
        >
          <span className="text-4xl opacity-40">✦</span>
        </div>

        {/* Front of card */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className={`rounded-3xl border bg-gradient-to-br ${gradientPart} backdrop-blur-lg overflow-hidden shadow-2xl`}
        >
          {/* Category header */}
          <div className={`px-5 pt-4 pb-3 flex items-center gap-2 border-b border-white/5`}>
            <span className="text-2xl">{oracle.emoji}</span>
            <div>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Thông Điệp</p>
              <p className={`text-xs font-medium ${colorClass.split(" ").slice(-1)[0]}`}>
                {oracle.categoryLabel}
              </p>
            </div>
          </div>

          {/* Oracle title */}
          <div className="px-5 pt-4 pb-2">
            <h2
              className="text-white/90 text-xl font-bold leading-snug mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {oracle.title}
            </h2>
            <p className="text-white/65 text-sm leading-relaxed">{oracle.message}</p>
          </div>

          {/* Action hint */}
          <div className="mx-5 mb-5 mt-3 rounded-xl bg-white/5 border border-white/8 px-4 py-2.5 flex items-center gap-2">
            <span className="text-amber-400/70 text-sm">→</span>
            <p className="text-white/50 text-xs leading-relaxed">{oracle.action}</p>
          </div>

          {/* Decorative bottom */}
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}
