// ============================================================
// AiTab.tsx — AI Luận Giải + Thần Số Học — Design System v5
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FortuneCard } from "../components/FortuneCard";
import { UserProfile } from "../utils/astrology";
import { buildNumerologyProfile, getPersonalYearInfo } from "../utils/numerology";

interface AiTabProps {
  date: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

type SubTab = "ai" | "numerology";

export function AiTab({ date, userProfile, onSetupProfile }: AiTabProps) {
  const [sub, setSub] = useState<SubTab>("ai");

  return (
    <div className="px-4 pb-4 flex flex-col gap-3">
      {/* Sub-tab */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
        {([{ id:"ai" as SubTab, emoji:"✨", label:"AI Luận Giải" },
           { id:"numerology" as SubTab, emoji:"🔢", label:"Thần Số Học" }]).map(t => (
          <motion.button key={t.id} whileTap={{ scale:0.95 }} onClick={() => setSub(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all"
            style={{
              background: sub===t.id ? "var(--gold)" : "transparent",
              color: sub===t.id ? "white" : "var(--text-muted)",
            }}>
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sub === "ai" && (
          <motion.div key="ai" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <FortuneCard date={date} userProfile={userProfile} onSetupProfile={onSetupProfile} />
          </motion.div>
        )}
        {sub === "numerology" && (
          <motion.div key="num" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <NumerologyView userProfile={userProfile} onSetupProfile={onSetupProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NumerologyView({ userProfile, onSetupProfile }: { userProfile:UserProfile|null; onSetupProfile:()=>void }) {
  if (!userProfile) {
    return (
      <div className="card p-5 text-center">
        <p className="text-2xl mb-2">🔢</p>
        <p className="font-medium mb-1" style={{ color:"var(--text-primary)" }}>Cần năm sinh</p>
        <p className="text-sm mb-4" style={{ color:"var(--text-muted)" }}>Thiết lập bản mệnh để xem Thần Số Học</p>
        <motion.button whileTap={{ scale:0.97 }} onClick={onSetupProfile}
          className="btn-gold px-5 py-2.5 rounded-xl text-sm">Thiết lập ngay →</motion.button>
      </div>
    );
  }

  try {
    const savedDob = JSON.parse(localStorage.getItem("huyen_co_cac_dob") ?? "null");
    const d = savedDob?.day, m = savedDob?.month, y = userProfile.birthYear;
    if (!d || !m) {
      return (
        <div className="card p-5 text-center">
          <p className="text-2xl mb-2">📅</p>
          <p className="font-medium mb-1" style={{ color:"var(--text-primary)" }}>Cần ngày & tháng sinh</p>
          <p className="text-sm mb-4" style={{ color:"var(--text-muted)" }}>Thêm ngày và tháng ở tab Bản Mệnh</p>
          <motion.button whileTap={{ scale:0.97 }} onClick={onSetupProfile}
            className="btn-ghost px-5 py-2.5 rounded-xl text-sm">Cập nhật →</motion.button>
        </div>
      );
    }

    const num  = buildNumerologyProfile(d, m, y);
    const pyInfo = getPersonalYearInfo(num.personalYear);

    return (
      <div className="flex flex-col gap-2.5">
        {/* Life path */}
        <div className="card p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
            style={{ background:"var(--gold-bg)", border:"2px solid var(--gold-border)" }}>
            <span className="text-2xl font-bold font-display" style={{ color:"var(--gold)" }}>{num.lifePathNumber}</span>
            <span className="text-[9px]" style={{ color:"var(--text-muted)" }}>Đường Đời</span>
          </div>
          <div>
            <p className="font-bold text-base" style={{ color:"var(--text-primary)" }}>Số {num.lifePathNumber} — {num.lifePathInfo.title}</p>
            <p className="text-xs leading-relaxed mt-1" style={{ color:"var(--text-secondary)" }}>{num.lifePathInfo.description}</p>
          </div>
        </div>

        {/* Personal year */}
        <div className="card p-4">
          <p className="section-label mb-2">Năm Cá Nhân {new Date().getFullYear()} — Số {num.personalYear}</p>
          <p className="text-sm leading-relaxed" style={{ color:"var(--text-secondary)" }}>{pyInfo.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pyInfo.focus.split(" · ").map((f:string) => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Other numbers */}
        <div className="card overflow-hidden">
          <div className="grid grid-cols-3 divide-x" style={{ borderColor:"var(--border-subtle)" }}>
            {[
              { label:"Tâm Hồn",   val:num.soulUrge },
              { label:"Tâm Hồn",  val:num.soulUrge },
              { label:"Ngày Sinh", val:num.birthDay },
            ].map(({ label, val }) => (
              <div key={label} className="py-4 text-center">
                <p className="text-2xl font-bold font-display mb-1" style={{ color:"var(--gold)" }}>{val}</p>
                <p className="section-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch {
    return <div className="card p-4 text-center text-sm" style={{ color:"var(--text-muted)" }}>Không thể tính thần số học</div>;
  }
}