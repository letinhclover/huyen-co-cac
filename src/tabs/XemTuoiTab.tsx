// ============================================================
// XemTuoiTab.tsx — Xem Tuổi Hợp Nhau & Làm Ăn
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NGU_HANH_CHI, TUONG_SINH, TUONG_KHAC,
  LUC_HOP, LUC_XUNG, TAM_HOP, NAP_AM,
  KET_LUAN_CAP_DOI, KET_LUAN_LAM_AN,
  type KetLuanEntry,
} from "../data/xem-tuoi";
import { getCanChiYear } from "../data/horoscopes";

// ─── Helpers ──────────────────────────────────────────────────
const CHI_LIST = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const CAN_LIST = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];

const NH_LABEL: Record<string,string> = { kim:"Kim 🪙", moc:"Mộc 🌿", thuy:"Thủy 💧", hoa:"Hỏa 🔥", tho:"Thổ ⛰️" };
const NH_COLOR: Record<string,string> = {
  kim: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30",
  moc: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30",
  thuy:"text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30",
  hoa: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30",
  tho: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30",
};

function getChi(year: number) { return CHI_LIST[(year - 4 + 400) % 12]; }
function getCan(year: number) { return CAN_LIST[(year - 4 + 400) % 10]; }
function getNapAm(year: number) { return NAP_AM[getCanChiYear(year)] ?? "tho"; }

function calcScore(yearA: number, yearB: number): { diem: number; chiTiet: {label:string; diem:number; note:string}[] } {
  const chiA = getChi(yearA), chiB = getChi(yearB);
  const nhA  = getNapAm(yearA), nhB = getNapAm(yearB);
  const chiTiet: { label:string; diem:number; note:string }[] = [];
  let total = 0;

  // 1. Tương sinh / tương khắc nạp âm
  if (TUONG_SINH[nhA] === nhB || TUONG_SINH[nhB] === nhA) {
    chiTiet.push({ label:"Ngũ Hành Tương Sinh", diem:3, note:`${NH_LABEL[nhA]} sinh ${NH_LABEL[nhB]}` });
    total += 3;
  } else if (TUONG_KHAC[nhA] === nhB || TUONG_KHAC[nhB] === nhA) {
    chiTiet.push({ label:"Ngũ Hành Tương Khắc", diem:-2, note:`${NH_LABEL[nhA]} khắc ${NH_LABEL[nhB]}` });
    total -= 2;
  } else if (nhA === nhB) {
    chiTiet.push({ label:"Ngũ Hành Tương Hòa", diem:2, note:"Cùng hành, ổn định" });
    total += 2;
  } else {
    chiTiet.push({ label:"Ngũ Hành Bình Thường", diem:1, note:"Không tương sinh, không khắc" });
    total += 1;
  }

  // 2. Lục hợp
  const isLucHop = LUC_HOP.some(([a,b]) => (a===chiA&&b===chiB)||(a===chiB&&b===chiA));
  if (isLucHop) {
    chiTiet.push({ label:"Lục Hợp 🟢", diem:3, note:`${chiA} - ${chiB} lục hợp` });
    total += 3;
  }

  // 3. Tam hợp
  const isTamHop = TAM_HOP.some(g => g.includes(chiA) && g.includes(chiB));
  if (isTamHop) {
    chiTiet.push({ label:"Tam Hợp 🟢", diem:2, note:`Cùng nhóm tam hợp` });
    total += 2;
  }

  // 4. Lục xung
  const isLucXung = LUC_XUNG.some(([a,b]) => (a===chiA&&b===chiB)||(a===chiB&&b===chiA));
  if (isLucXung) {
    chiTiet.push({ label:"Lục Xung 🔴", diem:-3, note:`${chiA} xung ${chiB}` });
    total -= 3;
  }

  // Normalize to 0-10
  const diem = Math.max(0, Math.min(10, Math.round((total + 5) * 0.8)));
  return { diem, chiTiet };
}

function getKetLuan(diem: number, table: KetLuanEntry[]): KetLuanEntry | null {
  for (const e of table) {
    const [min, max] = e.diem.split("-").map(Number);
    if (diem >= min && diem <= max) return e;
  }
  return table[table.length - 1];
}

// ─── Year Picker ──────────────────────────────────────────────
function YearPicker({ label, value, onChange }: { label: string; value: number; onChange: (v:number) => void }) {
  const cc = getCanChiYear(value);
  return (
    <div className="card p-4">
      <p className="section-label mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <button onClick={() => onChange(value - 1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold transition-colors"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>−</button>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
          <p className="text-xs font-medium" style={{ color: "var(--gold)" }}>{cc}</p>
        </div>
        <button onClick={() => onChange(value + 1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold transition-colors"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>+</button>
      </div>
    </div>
  );
}

// ─── Score Meter ──────────────────────────────────────────────
function ScoreMeter({ diem }: { diem: number }) {
  const color = diem >= 7 ? "#22c55e" : diem >= 5 ? "#eab308" : diem >= 3 ? "#f97316" : "#ef4444";
  const label = diem >= 7 ? "Hợp" : diem >= 5 ? "Trung bình" : diem >= 3 ? "Cần chú ý" : "Không hợp";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke="var(--border-subtle)" />
          <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke={color}
            strokeLinecap="round" strokeDasharray={`${(diem/10)*201} 201`} style={{ transition:"stroke-dasharray 0.8s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{diem}</span>
          <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>/10</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
interface Props { birthYear?: number; }

export function XemTuoiTab({ birthYear }: Props) {
  const [mode, setMode]    = useState<"capdoi"|"laman">("capdoi");
  const [yearA, setYearA]  = useState(birthYear ?? 1990);
  const [yearB, setYearB]  = useState(1992);
  const [shown, setShown]  = useState(false);

  const { diem, chiTiet }  = useMemo(() => calcScore(yearA, yearB), [yearA, yearB]);
  const table              = mode === "capdoi" ? KET_LUAN_CAP_DOI : KET_LUAN_LAM_AN;
  const ketLuan            = useMemo(() => getKetLuan(diem, table), [diem, table]);

  const nhA = getNapAm(yearA), nhB = getNapAm(yearB);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>👫</div>
          <div>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Xem Tuổi</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Hợp nhau · Làm ăn · Ngũ hành</p>
          </div>
        </div>
        {/* Mode toggle */}
        <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          {([["capdoi","💑 Hợp Đôi"],["laman","🤝 Làm Ăn"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setShown(false); }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: mode === id ? "var(--gold)" : "transparent",
                       color: mode === id ? "white" : "var(--text-muted)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Year pickers */}
        <div className="grid grid-cols-2 gap-3">
          <YearPicker label={mode==="capdoi" ? "👨 Chàng / Người 1" : "👤 Người 1"} value={yearA} onChange={setYearA} />
          <YearPicker label={mode==="capdoi" ? "👩 Nàng / Người 2" : "👥 Người 2"} value={yearB} onChange={setYearB} />
        </div>

        {/* Ngũ hành */}
        <div className="card p-3 flex items-center gap-2 justify-center">
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${NH_COLOR[nhA]}`}>{NH_LABEL[nhA]}</span>
          <span style={{ color: "var(--text-muted)" }}>⟷</span>
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${NH_COLOR[nhB]}`}>{NH_LABEL[nhB]}</span>
        </div>

        {/* CTA */}
        <motion.button whileTap={{ scale:0.97 }} onClick={() => setShown(true)}
          className="btn-gold w-full py-3.5 rounded-2xl font-semibold text-base">
          ✦ Xem Kết Quả
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {shown && ketLuan && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="flex flex-col gap-3">

              {/* Score */}
              <div className="card p-4 flex items-center gap-4">
                <ScoreMeter diem={diem} />
                <div className="flex-1">
                  <p className="font-bold text-base mb-0.5" style={{ color: "var(--text-primary)" }}>{ketLuan.danh_gia}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ketLuan.tong_quan.slice(0,120)}...</p>
                </div>
              </div>

              {/* Chi tiết điểm */}
              <div className="card p-4">
                <p className="section-label mb-3">Phân Tích Chi Tiết</p>
                <div className="space-y-2">
                  {chiTiet.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{c.label}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.note}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: c.diem > 0 ? "var(--accent-emerald)" : "var(--accent-red)" }}>
                        {c.diem > 0 ? "+" : ""}{c.diem}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gợi ý */}
              {ketLuan.giai_phap.length > 0 && (
                <div className="card p-4">
                  <p className="section-label mb-3">Gợi Ý Hoá Giải</p>
                  <div className="space-y-2">
                    {ketLuan.giai_phap.slice(0,3).map((g, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "var(--gold)" }}>✦</span>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kết luận */}
              <div className="card p-4" style={{ borderColor: "var(--gold-border)", background: "var(--gold-bg)" }}>
                <p className="section-label mb-2">Kết Luận</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ketLuan.ket_luan}</p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
