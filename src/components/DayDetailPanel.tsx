// ============================================================
// DayDetailPanel.tsx — Chi tiết ngày — Design System v5
// ============================================================

import { useMemo } from "react";
import { motion } from "framer-motion";
import { analyzeDayFull, type DayAnalysis } from "../utils/almanac";

interface Props {
  date: Date;
  compact?: boolean;
}

function Stars({ score, max=5 }: { score:number; max?:number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:max}).map((_,i) => (
        <span key={i} className="text-xs" style={{ color: i<score ? "var(--gold)" : "var(--border-medium)" }}>★</span>
      ))}
    </div>
  );
}

export function DayDetailPanel({ date, compact=false }: Props) {
  const info: DayAnalysis = useMemo(
    () => analyzeDayFull(date.getDate(), date.getMonth()+1, date.getFullYear()),
    [date]
  );

  const overallColor =
    info.rating.overall >= 4 ? "var(--accent-emerald)" :
    info.rating.overall >= 3 ? "var(--gold)" :
    info.rating.overall >= 2 ? "#f97316" : "var(--accent-red)";

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
          {info.truc.ten}
        </span>
        {info.saoTot.slice(0,2).map(s => (
          <span key={s.id} className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ background:"var(--bg-surface)", color:"var(--text-muted)", border:"1px solid var(--border-subtle)" }}>
            {s.name}
          </span>
        ))}
        {info.ngayXauList.map(x => (
          <span key={x} className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ background:"rgba(239,68,68,0.08)", color:"var(--accent-red)", border:"1px solid rgba(239,68,68,0.2)" }}>
            ⚠ {x}
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="flex flex-col gap-2.5">

      {/* Header card */}
      <div className="card p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="section-label mb-1">Ngày {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</p>
            <p className="text-xl font-bold font-display" style={{ color:"var(--text-primary)" }}>{info.canChiDay}</p>
            <p className="text-sm mt-0.5" style={{ color:"var(--text-secondary)" }}>{info.lunarDate}</p>
          </div>
          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl"
            style={{ border:`2px solid ${overallColor}`, background: overallColor+"12" }}>
            <span className="text-xl font-bold" style={{ color: overallColor }}>{info.rating.overall}</span>
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>/5 điểm</span>
          </div>
        </div>
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
            Trực {info.truc.ten} · {info.truc.dinhGia}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background:"var(--bg-elevated)", color:"var(--text-muted)", border:"1px solid var(--border-subtle)" }}>
            {info.saoBatTu.sao.split(" - ")[0]}
          </span>
          {info.ngayXauList.map(x => (
            <span key={x} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background:"rgba(239,68,68,0.08)", color:"var(--accent-red)", border:"1px solid rgba(239,68,68,0.2)" }}>
              ⚠ {x}
            </span>
          ))}
        </div>
      </div>

      {/* Rating grid */}
      <div className="card p-4">
        <p className="section-label mb-3">Đánh Giá Theo Mục Đích</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            { label:"🏗 Xây dựng",   key:"xayDung" as const },
            { label:"💼 Kinh doanh", key:"kinhDoanh" as const },
            { label:"💍 Cưới hỏi",   key:"cuoiHoi" as const },
            { label:"⚱ An táng",    key:"anTang" as const },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs" style={{ color:"var(--text-muted)" }}>{label}</span>
              <Stars score={info.rating[key]} />
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
