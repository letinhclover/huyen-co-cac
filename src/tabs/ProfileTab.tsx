// ============================================================
// ProfileTab.tsx — Hồ Sơ Bản Mệnh + Affiliate
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildUserProfile, getShopeeProduct, UserProfile } from "../utils/astrology";

interface ProfileTabProps {
  userProfile: UserProfile | null;
  onProfileChange: (profile: UserProfile | null) => void;
}

const ELEMENT_STYLES: Record<string, { gradient: string; border: string; text: string; glow: string; icon: string }> = {
  kim:  { gradient: "from-slate-400/15 to-slate-500/5",   border: "border-slate-400/20",   text: "text-slate-300",   glow: "bg-slate-400/10",   icon: "🪙" },
  moc:  { gradient: "from-emerald-500/15 to-green-500/5", border: "border-emerald-500/20", text: "text-emerald-400", glow: "bg-emerald-500/10", icon: "🌳" },
  thuy: { gradient: "from-blue-500/15 to-cyan-500/5",     border: "border-blue-400/20",    text: "text-blue-400",    glow: "bg-blue-500/10",    icon: "💧" },
  hoa:  { gradient: "from-red-500/15 to-orange-500/5",    border: "border-red-400/20",     text: "text-red-400",     glow: "bg-red-500/10",     icon: "🔥" },
  tho:  { gradient: "from-amber-600/15 to-yellow-500/5",  border: "border-amber-500/20",   text: "text-amber-400",   glow: "bg-amber-500/10",   icon: "🌏" },
};

export function ProfileTab({ userProfile, onProfileChange }: ProfileTabProps) {
  const [inputYear, setInputYear] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setInputYear(String(userProfile.birthYear));
      setIsEditing(false);
    }
  }, [userProfile]);

  const handleSave = () => {
    const year = parseInt(inputYear, 10);
    if (isNaN(year) || year < 1920 || year > new Date().getFullYear()) {
      setError("Vui lòng nhập năm sinh hợp lệ (1920 đến nay)");
      return;
    }
    setError("");
    const profile = buildUserProfile(year);
    localStorage.setItem("huyen_co_cac_birth_year", String(year));
    onProfileChange(profile);
    setIsEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleReset = () => {
    localStorage.removeItem("huyen_co_cac_birth_year");
    onProfileChange(null);
    setInputYear("");
    setIsEditing(true);
  };

  const elementStyle = userProfile ? (ELEMENT_STYLES[userProfile.element] ?? ELEMENT_STYLES["tho"]) : null;
  const shopeeProduct = userProfile ? getShopeeProduct(userProfile.element) : null;

  return (
    <div className="min-h-full px-4 pt-6 pb-8 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[10px] text-amber-400/60 tracking-[0.35em] uppercase mb-1">Cá Nhân Hóa</p>
        <h1
          className="text-2xl font-bold text-white/90"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Hồ Sơ Bản Mệnh
        </h1>
      </div>

      {/* Input form */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg px-5 py-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <p className="text-white/85 text-sm font-medium">Nhập Năm Sinh Dương Lịch</p>
                <p className="text-white/35 text-xs">Để tính Can Chi và Bản Mệnh của bạn</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={inputYear}
                  onChange={(e) => { setInputYear(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="VD: 1998"
                  min={1920}
                  max={new Date().getFullYear()}
                  className="w-full rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 text-lg font-light px-4 py-3 outline-none focus:border-amber-500/40 focus:bg-white/10 transition-all tracking-widest"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium px-5 py-3 hover:bg-amber-500/30 transition-colors"
              >
                Xem Mệnh
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400/80 text-xs"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="saved-bar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-sm">Năm sinh:</span>
              <span className="text-white/80 text-sm font-medium tracking-widest">{userProfile?.birthYear}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-amber-400/60 text-xs hover:text-amber-400/90 transition-colors"
            >
              Chỉnh sửa
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destiny card */}
      <AnimatePresence>
        {userProfile && elementStyle && (
          <motion.div
            key="destiny"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Just saved toast */}
            <AnimatePresence>
              {justSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center py-2 px-4"
                >
                  ✓ Đã lưu Bản Mệnh của bạn
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main destiny card */}
            <div className={`rounded-3xl border ${elementStyle.border} bg-gradient-to-br ${elementStyle.gradient} backdrop-blur-lg overflow-hidden`}>
              {/* Top glow accent */}
              <div className={`h-1 w-full ${elementStyle.glow}`} />

              <div className="px-5 pt-5 pb-4">
                {/* Element icon + label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${elementStyle.glow} border ${elementStyle.border} flex items-center justify-center text-3xl`}>
                    {elementStyle.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 tracking-widest uppercase">Bản Mệnh Ngũ Hành</p>
                    <p className={`text-xl font-bold ${elementStyle.text}`}
                       style={{ fontFamily: "'Playfair Display', serif" }}>
                      Mệnh {userProfile.elementName}
                    </p>
                  </div>
                </div>

                {/* Destiny name */}
                <div className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 mb-4">
                  <p className="text-[10px] text-white/25 tracking-widest uppercase mb-1">Nạp Âm</p>
                  <p className="text-white/80 text-sm font-medium">{userProfile.destinyName}</p>
                </div>

                {/* Can Chi grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/4 border border-white/6 px-3 py-2.5">
                    <p className="text-[10px] text-white/25 tracking-widest uppercase mb-0.5">Can Chi Năm</p>
                    <p className={`text-base font-semibold ${elementStyle.text}`}>{userProfile.canChiYear}</p>
                  </div>
                  <div className="rounded-xl bg-white/4 border border-white/6 px-3 py-2.5">
                    <p className="text-[10px] text-white/25 tracking-widest uppercase mb-0.5">Năm Sinh</p>
                    <p className="text-base font-semibold text-white/70">{userProfile.birthYear}</p>
                  </div>
                </div>
              </div>

              {/* Element personality */}
              <div className="mx-5 mb-5">
                <ElementPersonality element={userProfile.element} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affiliate product section */}
      <AnimatePresence>
        {userProfile && shopeeProduct && (
          <motion.div
            key="shopee"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/8 to-rose-500/5 backdrop-blur-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center gap-2">
              <span className="text-lg">🛍️</span>
              <div>
                <p className="text-[10px] text-orange-400/60 tracking-widest uppercase">Gợi Ý Phong Thủy</p>
                <p className="text-white/70 text-sm font-medium">Dành riêng cho Mệnh {userProfile.elementName}</p>
              </div>
            </div>

            <div className="px-5 pt-4 pb-4 flex flex-col gap-3">
              {/* Product info */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl flex-shrink-0">
                  {shopeeProduct.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-white/85 text-sm font-medium mb-1">{shopeeProduct.name}</p>
                  <p className="text-white/45 text-xs leading-relaxed">{shopeeProduct.description}</p>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center gap-3">
                <span className="text-orange-400/70 text-sm font-medium">{shopeeProduct.price}</span>
                <motion.a
                  href={shopeeProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-orange-500 text-white text-sm font-semibold text-center py-2.5 px-4 shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-colors"
                >
                  Mua trên Shopee 🛒
                </motion.a>
              </div>

              <p className="text-white/20 text-[10px] text-center">
                Đây là gợi ý dựa trên bản mệnh của bạn
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset button */}
      {userProfile && !isEditing && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="text-white/15 text-xs text-center hover:text-white/30 transition-colors py-2"
        >
          Xóa dữ liệu và bắt đầu lại
        </motion.button>
      )}
    </div>
  );
}

// ─── Element Personality Blurb ────────────────────────────────

const ELEMENT_PERSONALITIES: Record<string, string> = {
  kim:  "Bạn có tư duy logic sắc bén và khả năng đưa ra quyết định chính xác. Bạn trung thực và thẳng thắn — đôi khi hơi thẳng, nhưng mọi người luôn tin tưởng bạn vì vậy.",
  moc:  "Bạn có trực giác tốt và khả năng thích nghi mạnh mẽ. Bạn kiên trì như cây — dù gió thổi vẫn bám chặt đất. Bạn rất hợp với công việc sáng tạo và cần sự phát triển dài hạn.",
  thuy: "Bạn nhạy cảm, thấu cảm và khéo léo trong giao tiếp. Như nước — bạn biết cách lách qua mọi trở ngại mà không tạo ra xung đột. Bạn làm bình yên những người xung quanh.",
  hoa:  "Bạn nhiệt huyết, đam mê và truyền cảm hứng cho người khác. Bạn là người đi đầu, không ngại thử thứ mới. Chỉ cần nhớ — lửa cần được kiểm soát để không đốt cháy chính mình nhé.",
  tho:  "Bạn đáng tin cậy, kiên định và có tư duy thực tế. Bạn là người mọi người tìm đến khi cần lời khuyên ổn định. Bạn xây nền tảng vững chắc — ít hào nhoáng nhưng bền vững lâu dài.",
};

function ElementPersonality({ element }: { element: string }) {
  const text = ELEMENT_PERSONALITIES[element] ?? ELEMENT_PERSONALITIES["tho"];
  return (
    <div className="rounded-xl bg-white/3 border border-white/5 px-4 py-3">
      <p className="text-[10px] text-white/25 tracking-widest uppercase mb-1.5">Tính Cách Bản Mệnh</p>
      <p className="text-white/55 text-xs leading-relaxed">{text}</p>
    </div>
  );
}
