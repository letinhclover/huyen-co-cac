// ============================================================
// OracleTab.tsx — Gieo Quẻ Ngẫu Nhiên — Design System v5
// ============================================================

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORACLE_MESSAGES, OracleMessage } from "../data/fortunes";

type OracleState = "idle" | "shaking" | "done";

export function OracleTab() {
  const [state,   setState]   = useState<OracleState>("idle");
  const [oracle,  setOracle]  = useState<OracleMessage | null>(null);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [shake,   setShake]   = useState(0);

  const pick = useCallback(() => {
    let pool = ORACLE_MESSAGES.filter(m => !usedIds.has(m.id));
    if (!pool.length) { setUsedIds(new Set()); pool = ORACLE_MESSAGES; }
    const p = pool[Math.floor(Math.random() * pool.length)];
    setUsedIds(prev => new Set([...prev, p.id]));
    return p;
  }, [usedIds]);

  const handleCast = useCallback(async () => {
    if (state === "shaking") return;
    setShake(s => s + 1);
    setState("shaking");
    await new Promise(r => setTimeout(r, 1800));
    setOracle(pick());
    setState("done");
  }, [state, pick]);

  const CAT_COLOR: Record<string,string> = {
    love:"#ec4899", work:"#3b82f6", healing:"#8b5cf6",
    motivation:"#f59e0b", money:"#22c55e", friendship:"#06b6d4",
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>🎴 Thẻ Năng Lượng</p>
        {state === "done" && (
          <button onClick={() => { setOracle(null); setState("idle"); }}
            className="text-xs" style={{ color:"var(--text-muted)" }}>
            ↻ Rút lại
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.button whileTap={{ scale:0.96 }} onClick={handleCast}
              className="w-full py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-secondary)" }}>
              <span>🀄</span> Rút thẻ năng lượng hôm nay
            </motion.button>
          </motion.div>
        )}

        {state === "shaking" && (
          <motion.div key="shaking" className="flex flex-col items-center gap-3 py-4">
            <motion.div className="text-4xl"
              animate={{ rotate:[0,-12,12,-12,12,0], scale:[1,1.1,1.1,1.1,1.1,1] }}
              transition={{ duration:0.8, repeat:2 }}>
              🀄
            </motion.div>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>Đang định khí...</p>
          </motion.div>
        )}

        {state === "done" && oracle && (
          <motion.div key="done" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="rounded-2xl p-4" style={{
              background: (CAT_COLOR[oracle.category]||"var(--gold)") + "10",
              border: `1px solid ${(CAT_COLOR[oracle.category]||"var(--gold)") + "30"}`,
            }}>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{oracle.emoji || "🌟"}</span>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: CAT_COLOR[oracle.category]||"var(--gold)" }}>
                    {oracle.category?.toUpperCase()}
                  </p>
                  <p className="text-sm leading-relaxed font-medium" style={{ color:"var(--text-primary)" }}>{oracle.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color:"var(--text-secondary)" }}>{oracle.message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
