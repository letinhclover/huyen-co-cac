// ============================================================
// AiTab.tsx — AI Luận Giải (Thần Số Học đã xóa)
// ============================================================

import { motion } from "framer-motion";
import { FortuneCard } from "../components/FortuneCard";
import { UserProfile } from "../utils/astrology";

interface AiTabProps {
  date: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

export function AiTab({ date, userProfile, onSetupProfile }: AiTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-4"
    >
      <FortuneCard date={date} userProfile={userProfile} onSetupProfile={onSetupProfile} />
    </motion.div>
  );
}
