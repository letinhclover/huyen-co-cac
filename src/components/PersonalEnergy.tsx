// ============================================================
// PersonalEnergy.tsx — Design System v5
// ============================================================
import { motion } from "framer-motion";
import { UserProfile, solarToLunar, getCanChiDay, toJDN } from "../utils/astrology";
import { OracleTab } from "../tabs/OracleTab";

interface Props {
  userProfile: UserProfile | null;
  currentDate: Date;
  onSetupProfile: () => void;
}

export function PersonalEnergy({ userProfile, currentDate, onSetupProfile }: Props) {
  if (!userProfile) {
    return (
      <div className="mx-4">
        <div className="card p-5 text-center">
          <p className="text-3xl mb-3">🌟</p>
          <p className="font-semibold mb-1" style={{ color:"var(--text-primary)" }}>Cá Nhân Hóa Vận Số</p>
          <p className="text-sm mb-4" style={{ color:"var(--text-muted)" }}>
            Thiết lập năm sinh để xem năng lượng ngày theo bản mệnh
          </p>
          <motion.button whileTap={{ scale:0.97 }} onClick={onSetupProfile}
            className="btn-gold px-6 py-2.5 rounded-2xl text-sm">
            Thiết lập ngay →
          </motion.button>
        </div>
      </div>
    );
  }

  const jdn         = toJDN(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
  const todayCanChi = getCanChiDay(jdn);
  const lunar       = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());

  return (
    <div className="mx-4 flex flex-col gap-2.5">
      {/* Profile mini */}
      <div className="card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)" }}>
          {userProfile.element === "kim" ? "🪙" : userProfile.element === "moc" ? "🌿" :
           userProfile.element === "thuy" ? "💧" : userProfile.element === "hoa" ? "🔥" : "⛰️"}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
            {userProfile.canChiYear} · {userProfile.destinyName.split(" — ")[0]}
          </p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            Ngày {todayCanChi} · Tháng {lunar.canChiMonth}
          </p>
        </div>
        <div className="text-right">
          <p className="section-label mb-0.5">Hành</p>
          <p className="font-bold" style={{ color:"var(--gold)" }}>{userProfile.elementName} {userProfile.elementEmoji}</p>
        </div>
      </div>

      {/* Oracle tab inline */}
      <OracleTab />
    </div>
  );
}
