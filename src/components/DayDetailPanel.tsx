// ============================================================
// DayDetailPanel.tsx — Chi tiết ngày từ dữ liệu thật
// 12 Trực · 114 Sao · 28 Sao Bát Tú · Ngày xấu
// ============================================================

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeDayFull, type DayAnalysis } from "../utils/almanac";

interface Props {
  date: Date;
  compact?: boolean; // compact mode for calendar
}

function StarRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={i <= score ? "text-yellow-400" : "text-gray-700"}>★</span>
        ))}
      </div>
    </div>
  );
}

function TrucBadge({ truc }: { truc: DayAnalysis["truc"] }) {
  const color =
    truc.dinhGia === "tốt"          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
    truc.dinhGia === "xấu"          ? "bg-red-500/20 text-red-300 border-red-500/30" :
                                      "bg-gray-500/20 text-gray-300 border-gray-500/30";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${color} font-medium`}>
      {truc.ten}
    </span>
  );
}

export function DayDetailPanel({ date, compact = false }: Props) {
  const info: DayAnalysis = useMemo(() => {
    return analyzeDayFull(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }, [date]);

  const overallColor =
    info.rating.overall >= 4 ? "#22c55e" :
    info.rating.overall >= 3 ? "#eab308" :
    info.rating.overall >= 2 ? "#f97316" : "#ef4444";

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <TrucBadge truc={info.truc} />
        {info.saoTot.slice(0,2).map(s => (
          <span key={s.id} className="text-xs px-1.5 py-0.5 bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded">
            {s.name}
          </span>
        ))}
        {info.ngayXauList.map(x => (
          <span key={x} className="text-xs px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
            ⚠ {x}
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(15,20,40,0.9)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Chi Tiết Ngày</p>
            <p className="text-lg font-bold text-white">{info.canChiDay}</p>
            <p className="text-sm text-gray-400">{info.lunarDate}</p>
          </div>
          {/* Overall score circle */}
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-2"
            style={{ borderColor: overallColor }}>
            <span className="text-lg font-bold" style={{ color: overallColor }}>
              {info.rating.overall}
            </span>
            <span className="text-[9px] text-gray-500">/ 5</span>
          </div>
        </div>
        {/* Trực + ngày xấu badges */}
        <div className="flex flex-wrap gap-1.5">
          <TrucBadge truc={info.truc} />
          <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
            {info.saoBatTu.sao.split(" - ")[0]}
          </span>
          {info.ngayXauList.map(x => (
            <span key={x} className="text-xs px-2 py-0.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
              ⚠ {x}
            </span>
          ))}
        </div>
      </div>

      {/* Rating grid */}
      <div className="px-4 py-3 border-b border-white/6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Đánh Giá Theo Mục Đích</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <StarRow label="🏗 Xây dựng"  score={info.rating.xayDung} />
          <StarRow label="💼 Kinh doanh" score={info.rating.kinhDoanh} />
          <StarRow label="💍 Cưới hỏi"   score={info.rating.cuoiHoi} />
          <StarRow label="⚱ An táng"    score={info.rating.anTang} />
        </div>
      </div>

      {/* Sao tốt */}
      {info.saoTot.length > 0 && (
        <div className="px-4 py-3 border-b border-white/6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">✨ Sao Tốt Hôm Nay</p>
          <div className="flex flex-col gap-2">
            {info.saoTot.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-start gap-2">
                <span className="text-yellow-400 text-xs mt-0.5">●</span>
                <div>
                  <span className="text-sm text-white font-medium">{s.name}</span>
                  {s.info && <p className="text-xs text-gray-400 mt-0.5">{s.info}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sao xấu */}
      {info.saoXau.length > 0 && (
        <div className="px-4 py-3 border-b border-white/6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">🚫 Sao Xấu Hôm Nay</p>
          <div className="flex flex-wrap gap-1.5">
            {info.saoXau.map(s => (
              <span key={s.id} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trực mô tả */}
      <div className="px-4 py-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Trực {info.truc.ten} · {info.truc.dinhGia}
        </p>
        <p className="text-xs text-gray-400">
          {info.saoBatTu.sao} · Sao {info.saoBatTu.tot ? `Tốt: ${info.saoBatTu.tot}` : info.saoBatTu.xau ? `Xấu: ${info.saoBatTu.xau}` : "bình thường"}
        </p>
      </div>
    </motion.div>
  );
}
