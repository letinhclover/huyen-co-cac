// ============================================================
// UtilityTab.tsx — Tab Tiện Ích: La Bàn + Xem Tuổi + Văn Khấn
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FengShuiCompass } from "../components/FengShuiCompass";
import { SmartPrayer } from "../components/SmartPrayer";
import { XemTuoiTab } from "./XemTuoiTab";

type Tool = "laban" | "tuoi" | "vankhan";

interface Props { birthYear?: number; }

const TOOLS: { id: Tool; emoji: string; label: string }[] = [
  { id:"laban",   emoji:"🧭", label:"La Bàn"   },
  { id:"tuoi",    emoji:"👫", label:"Xem Tuổi" },
  { id:"vankhan", emoji:"🙏", label:"Văn Khấn" },
];

export function UtilityTab({ birthYear }: Props) {
  const [tool, setTool] = useState<Tool>("laban");

  return (
    <div className="flex flex-col pb-24">
      {/* Tool selector */}
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2.5 border-b"
        style={{ background:"var(--header-bg)", backdropFilter:"blur(12px)", borderColor:"var(--border-subtle)" }}>
        <div className="flex gap-1.5">
          {TOOLS.map(t => {
            const active = tool === t.id;
            return (
              <motion.button key={t.id} whileTap={{ scale:0.95 }} onClick={() => setTool(t.id)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all"
                style={{
                  background: active ? "var(--gold)" : "var(--bg-elevated)",
                  border: `1px solid ${active ? "transparent" : "var(--border-subtle)"}`,
                }}>
                <span className="text-xl leading-none">{t.emoji}</span>
                <span className="text-[10px] font-bold mt-1 leading-none"
                  style={{ color: active ? "white" : "var(--text-muted)" }}>
                  {t.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-3">
        <AnimatePresence mode="wait">
          {tool === "laban" && (
            <motion.div key="laban" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <FengShuiCompass />
            </motion.div>
          )}
          {tool === "tuoi" && (
            <motion.div key="tuoi" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <XemTuoiTab birthYear={birthYear} />
            </motion.div>
          )}
          {tool === "vankhan" && (
            <motion.div key="vankhan" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <SmartPrayer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
