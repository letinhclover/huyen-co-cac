// ============================================================
// TuviTab.tsx — Tử Vi 60 Tuổi — Design System v5
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHoroscope, getCanChiYear } from "../data/horoscopes";

interface Props { birthYear?: number; }

export function TuviTab({ birthYear }: Props) {
  const [year,   setYear]   = useState(birthYear ?? new Date().getFullYear() - 30);
  const [gender, setGender] = useState<"nam" | "nu">("nam");

  const horo = getHoroscope(year, gender);
  const cc   = getCanChiYear(year);

  return (
    <div className="px-4 pb-4 flex flex-col gap-3">
      {/* Controls */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {/* Gender */}
          <div>
            <p className="section-label mb-2">Giới tính</p>
            <div className="flex gap-1 p-0.5 rounded-lg" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
              {(["nam","nu"] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className="flex-1 py-2 rounded-md text-xs font-semibold transition-all"
                  style={{ background: gender===g?"var(--gold)":"transparent", color: gender===g?"white":"var(--text-muted)" }}>
                  {g === "nam" ? "👨 Nam" : "👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          {/* Year */}
          <div>
            <p className="section-label mb-2">Năm sinh</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setYear(y => y-1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>−</button>
              <div className="flex-1 text-center">
                <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>{year}</p>
                <p className="text-[10px]" style={{ color:"var(--gold)" }}>{cc}</p>
              </div>
              <button onClick={() => setYear(y => y+1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {horo ? (
          <motion.div key={`${year}-${gender}`} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="card overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b" style={{ background:"var(--gold-bg)", borderColor:"var(--gold-border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)" }}>
                  {gender === "nam" ? "👨" : "👩"}
                </div>
                <div>
                  <p className="font-bold text-base font-display" style={{ color:"var(--text-primary)" }}>
                    {gender === "nam" ? "Nam Mạng" : "Nữ Mạng"} {cc}
                  </p>
                  <p className="text-xs" style={{ color:"var(--text-secondary)" }}>
                    Các năm: {horo.years.slice(0,4).join(", ")}...
                  </p>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-4">
              <div className="text-sm leading-relaxed prose-sm"
                style={{ color:"var(--text-secondary)" }}
                dangerouslySetInnerHTML={{ __html: horo.content.slice(0, 1800) + (horo.content.length > 1800 ? "..." : "") }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="no-data" className="card p-6 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>
              Chưa có tử vi cho {cc} {gender === "nam" ? "Nam" : "Nữ"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
