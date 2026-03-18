// ============================================================
// SmartPrayer.tsx — Thư Viện Văn Khấn Smart Fill
// Tìm kiếm, đọc, tự động điền tên & địa chỉ realtime
// Font A+/A- cho người lớn tuổi
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRAYERS, PRAYER_CATEGORIES, searchPrayers, getPrayersByCategory, type Prayer } from "../data/prayers";

export function SmartPrayer() {
  const [search,   setSearch]   = useState("");
  const [catId,    setCatId]    = useState("");
  const [selected, setSelected] = useState<Prayer | null>(null);

  const filtered = useMemo(() => {
    const bySearch = searchPrayers(search);
    return catId ? bySearch.filter(p => p.category === catId) : bySearch;
  }, [search, catId]);

  if (selected) {
    return <PrayerReader prayer={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔍</span>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm bài khấn... (Giao thừa, Thần Tài, Khai trương...)"
          className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2"
            style={{ color:"var(--text-muted)" }}>✕</button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <button onClick={() => setCatId("")}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
          style={{ background:!catId?"var(--gold)":"var(--bg-elevated)", color:!catId?"white":"var(--text-muted)",
            border:`1px solid ${!catId?"transparent":"var(--border-subtle)"}` }}>
          Tất cả ({PRAYERS.length})
        </button>
        {PRAYER_CATEGORIES.map(c => {
          const count = getPrayersByCategory(c.id).length;
          const active = catId === c.id;
          return (
            <button key={c.id} onClick={() => setCatId(active ? "" : c.id)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap"
              style={{ background:active?"var(--gold)":"var(--bg-elevated)", color:active?"white":"var(--text-muted)",
                border:`1px solid ${active?"transparent":"var(--border-subtle)"}` }}>
              {c.emoji} {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      <AnimatePresence mode="wait">
        <motion.div key={search+catId} initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>Không tìm thấy bài khấn phù hợp</p>
            </div>
          ) : filtered.map(p => (
            <motion.button key={p.id} whileTap={{ scale:0.99 }} onClick={() => setSelected(p)}
              className="card p-4 text-left flex items-center gap-3 transition-all active:opacity-80">
              <span className="text-2xl flex-shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>{p.occasion}</p>
              </div>
              <span className="text-sm" style={{ color:"var(--text-faint)" }}>›</span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Prayer Reader ────────────────────────────────────────────
const FONT_SIZES = [14, 16, 18, 20, 22, 24];

function PrayerReader({ prayer, onBack }: { prayer: Prayer; onBack: () => void }) {
  const [tenTinChu, setTenTinChu] = useState(() => {
    try { return localStorage.getItem("hcc_ten_tin_chu") || ""; } catch { return ""; }
  });
  const [diaChi, setDiaChi] = useState(() => {
    try { return localStorage.getItem("hcc_dia_chi") || ""; } catch { return ""; }
  });
  const [fontIdx, setFontIdx] = useState(2);  // default 18px
  const fontSize = FONT_SIZES[fontIdx];

  const saveTen = (v: string) => {
    setTenTinChu(v);
    try { localStorage.setItem("hcc_ten_tin_chu", v); } catch {}
  };
  const saveDiaChi = (v: string) => {
    setDiaChi(v);
    try { localStorage.setItem("hcc_dia_chi", v); } catch {}
  };

  // Get today as Vietnamese string
  const today = new Date();
  const todayStr = `ngày ${today.getDate()} tháng ${today.getMonth()+1} năm ${today.getFullYear()}`;

  // Smart fill: replace variables, bold+gold them
  const renderContent = () => {
    let text = prayer.content;
    const replacements: [string, string][] = [
      ["[tên tín chủ]",       tenTinChu || "[tên tín chủ]"],
      ["[địa chỉ cư ngụ]",   diaChi    || "[địa chỉ cư ngụ]"],
      ["[ngày tháng]",        todayStr],
    ];

    // Split and highlight
    const parts: { text: string; isVar: boolean; filled: boolean }[] = [];

    // Simple tokenizer
    const varPattern = /(\[tên tín chủ\]|\[địa chỉ cư ngụ\]|\[ngày tháng\])/g;
    let lastIdx = 0;
    let match;
    while ((match = varPattern.exec(text)) !== null) {
      if (match.index > lastIdx)
        parts.push({ text: text.slice(lastIdx, match.index), isVar: false, filled: false });
      const varName = match[0];
      const replacement = replacements.find(r => r[0] === varName)?.[1] ?? varName;
      const isFilled = replacement !== varName;
      parts.push({ text: replacement, isVar: true, filled: isFilled });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length)
      parts.push({ text: text.slice(lastIdx), isVar: false, filled: false });

    return parts;
  };

  const parts = renderContent();

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.button whileTap={{ scale:0.9 }} onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>
          ←
        </motion.button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color:"var(--text-primary)" }}>{prayer.title}</p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>{prayer.occasion}</p>
        </div>
        {/* Font controls */}
        <div className="flex gap-1">
          <button onClick={() => setFontIdx(i => Math.max(0, i-1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs"
            style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>
            A-
          </button>
          <button onClick={() => setFontIdx(i => Math.min(FONT_SIZES.length-1, i+1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm"
            style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>
            A+
          </button>
        </div>
      </div>

      {/* Smart fill form */}
      <div className="card p-4">
        <p className="section-label mb-2.5">✍️ Điền Thông Tin (tự động cập nhật bài khấn)</p>
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-xs mb-1 block" style={{ color:"var(--text-muted)" }}>
              Tên tín chủ (họ và tên đầy đủ)
            </label>
            <input type="text" value={tenTinChu} onChange={e => saveTen(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color:"var(--text-muted)" }}>
              Địa chỉ cư ngụ
            </label>
            <input type="text" value={diaChi} onChange={e => saveDiaChi(e.target.value)}
              placeholder="Số 123, đường ABC, Phường XYZ, TP.HCM"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
          </div>
        </div>
      </div>

      {/* Prayer content */}
      <div className="card p-5">
        <p className="text-center leading-relaxed whitespace-pre-wrap"
          style={{ fontSize: `${fontSize}px`, color:"var(--text-primary)", lineHeight: 1.9 }}>
          {parts.map((part, i) => (
            part.isVar ? (
              <span key={i} style={{
                color: part.filled ? "var(--gold)" : "var(--accent-red)",
                fontWeight: "bold",
                textDecoration: part.filled ? "none" : "underline dotted",
              }}>
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            )
          ))}
        </p>
      </div>

      {/* Share / Copy buttons */}
      <div className="flex gap-2">
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => {
            const plainText = prayer.content
              .replace(/\[tên tín chủ\]/g, tenTinChu || "[tên tín chủ]")
              .replace(/\[địa chỉ cư ngụ\]/g, diaChi || "[địa chỉ cư ngụ]")
              .replace(/\[ngày tháng\]/g, todayStr);
            navigator.clipboard.writeText(plainText).then(() => alert("Đã sao chép văn khấn!")).catch(() => {});
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          📋 Sao chép
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => {
            const plainText = prayer.content
              .replace(/\[tên tín chủ\]/g, tenTinChu || "[tên tín chủ]")
              .replace(/\[địa chỉ cư ngụ\]/g, diaChi || "[địa chỉ cư ngụ]")
              .replace(/\[ngày tháng\]/g, todayStr);
            if (navigator.share) {
              navigator.share({ title: prayer.title, text: plainText }).catch(() => {});
            } else {
              navigator.clipboard.writeText(plainText).then(() => alert("Đã sao chép! Dán vào Zalo/FB để chia sẻ.")).catch(() => {});
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          📤 Chia sẻ
        </motion.button>
      </div>

      {/* Note */}
      <p className="text-xs text-center px-4" style={{ color:"var(--text-faint)" }}>
        Chữ màu vàng = đã điền thông tin · Chữ đỏ = chưa điền
      </p>
    </div>
  );
}
