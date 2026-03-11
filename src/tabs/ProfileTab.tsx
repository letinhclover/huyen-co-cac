// ============================================================
// ProfileTab.tsx — Hồ Sơ Bản Mệnh — Design System v5
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildUserProfile, getShopeeProduct, UserProfile } from "../utils/astrology";

interface ProfileTabProps {
  userProfile: UserProfile | null;
  onProfileChange: (p: UserProfile | null) => void;
}

const ELEMENT_ICON: Record<string,string> = {
  kim:"🪙", moc:"🌿", thuy:"💧", hoa:"🔥", tho:"⛰️"
};
const ELEMENT_LABEL: Record<string,string> = {
  kim:"Kim", moc:"Mộc", thuy:"Thủy", hoa:"Hỏa", tho:"Thổ"
};
const ELEMENT_COLOR: Record<string,string> = {
  kim:"#94a3b8", moc:"#22c55e", thuy:"#3b82f6", hoa:"#ef4444", tho:"#f59e0b"
};

export function ProfileTab({ userProfile, onProfileChange }: ProfileTabProps) {
  const [inputDay,   setInputDay]   = useState("");
  const [inputMonth, setInputMonth] = useState("");
  const [inputYear,  setInputYear]  = useState("");
  const [error,      setError]      = useState("");
  const [isEditing,  setIsEditing]  = useState(!userProfile);
  const [justSaved,  setJustSaved]  = useState(false);

  useEffect(() => {
    if (userProfile) { setInputYear(String(userProfile.birthYear)); setIsEditing(false); }
    try {
      const dob = JSON.parse(localStorage.getItem("huyen_co_cac_dob") ?? "null");
      if (dob) { setInputDay(String(dob.day)); setInputMonth(String(dob.month)); }
    } catch { /* ignore */ }
  }, [userProfile]);

  const handleSave = () => {
    const y = parseInt(inputYear, 10);
    if (isNaN(y) || y < 1900 || y > 2020) {
      setError("Năm sinh không hợp lệ (1900–2020)"); return;
    }
    setError("");
    const profile = buildUserProfile(y);
    onProfileChange(profile);
    try {
      localStorage.setItem("huyen_co_cac_birth_year", String(y));
      const d = parseInt(inputDay,10), m = parseInt(inputMonth,10);
      if (!isNaN(d) && !isNaN(m) && d>=1&&d<=31&&m>=1&&m<=12)
        localStorage.setItem("huyen_co_cac_dob", JSON.stringify({ day:d, month:m, year:y }));
    } catch { /* ignore */ }
    setIsEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const shopee = userProfile ? getShopeeProduct(userProfile.element) : null;
  const elColor = userProfile ? ELEMENT_COLOR[userProfile.element] ?? "var(--gold)" : "var(--gold)";

  return (
    <div className="px-4 pt-4 flex flex-col gap-3">
      {/* Profile card */}
      {!isEditing && userProfile ? (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card overflow-hidden">
          {/* Color band */}
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${elColor}, ${elColor}88)` }} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="section-label mb-1">Bản Mệnh</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{ELEMENT_ICON[userProfile.element] ?? "✦"}</span>
                  <div>
                    <p className="text-xl font-bold font-display" style={{ color: elColor }}>
                      {ELEMENT_LABEL[userProfile.element]} {userProfile.element === "kim" ? "(Kim)" : ""}
                    </p>
                    <p className="text-sm" style={{ color:"var(--text-muted)" }}>{userProfile.destinyName}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn-ghost text-xs px-3 py-1.5 rounded-xl">
                ✎ Sửa
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"Năm sinh",  val: String(userProfile.birthYear) },
                { label:"Can Chi",   val: userProfile.canChiYear },
                { label:"Cung Phi",  val: String(userProfile.canIndex) },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
                  <p className="section-label mb-1">{label}</p>
                  <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>{val}</p>
                </div>
              ))}
            </div>

            {/* Lucky info */}
            <div className="mt-3 rounded-xl p-3"
              style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)" }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="section-label mb-0.5">Mệnh</p>
                  <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>{userProfile.destinyName.split(" — ")[0]}</p>
                </div>
                <div>
                  <p className="section-label mb-0.5">Hành</p>
                  <p className="font-bold text-sm" style={{ color:"var(--gold)" }}>{userProfile.elementName} {userProfile.elementEmoji}</p>
                </div>
              </div>
            </div>

            {justSaved && (
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="text-center text-sm mt-2" style={{ color:"var(--accent-emerald)" }}>
                ✓ Đã lưu bản mệnh
              </motion.p>
            )}
          </div>
        </motion.div>
      ) : (
        /* Input form */
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card p-5">
          <h2 className="font-display font-bold text-lg mb-1" style={{ color:"var(--text-primary)" }}>
            Thiết Lập Bản Mệnh
          </h2>
          <p className="text-sm mb-4" style={{ color:"var(--text-muted)" }}>
            Nhập năm sinh để cá nhân hóa toàn bộ ứng dụng
          </p>

          <div className="space-y-3">
            <div>
              <label className="section-label block mb-1.5">Năm Sinh *</label>
              <input type="number" placeholder="1990" value={inputYear}
                onChange={e => setInputYear(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-lg font-bold outline-none transition-all"
                style={{ background:"var(--bg-elevated)", border:`1px solid ${error?"var(--accent-red)":"var(--border-medium)"}`, color:"var(--text-primary)" }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="section-label block mb-1.5">Ngày (tuỳ chọn)</label>
                <input type="number" placeholder="15" value={inputDay}
                  onChange={e => setInputDay(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
              </div>
              <div>
                <label className="section-label block mb-1.5">Tháng (tuỳ chọn)</label>
                <input type="number" placeholder="6" value={inputMonth}
                  onChange={e => setInputMonth(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
              </div>
            </div>
            {error && <p className="text-sm" style={{ color:"var(--accent-red)" }}>{error}</p>}
          </div>

          <div className="flex gap-2 mt-4">
            {userProfile && (
              <button onClick={() => setIsEditing(false)} className="btn-ghost flex-1 py-3">Huỷ</button>
            )}
            <motion.button whileTap={{ scale:0.97 }} onClick={handleSave}
              className="btn-gold flex-1 py-3 rounded-2xl">
              Lưu Bản Mệnh →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Affiliate */}
      {shopee && userProfile && (
        <motion.a initial={{ opacity:0 }} animate={{ opacity:1 }} href={shopee.url} target="_blank" rel="noopener noreferrer"
          className="card p-4 flex items-center gap-3 transition-opacity active:opacity-70">
          <span className="text-3xl">{shopee.emoji}</span>
          <div className="flex-1">
            <p className="section-label mb-0.5">Vật phẩm hợp mệnh {ELEMENT_LABEL[userProfile.element]}</p>
            <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>{shopee.name}</p>
            <p className="text-xs mt-0.5" style={{ color:"var(--gold)" }}>Xem trên Shopee →</p>
          </div>
        </motion.a>
      )}
    </div>
  );
}
