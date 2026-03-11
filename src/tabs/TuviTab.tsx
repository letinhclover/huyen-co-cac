// ============================================================
// TuviTab.tsx — Tử Vi Trọn Đời 60 Tuổi Nam/Nữ
// Data: horoscope HTML assets từ Lịch VN 2026
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { getHoroscope, getCanChiYear } from "../data/horoscopes";

interface Props {
  birthYear?: number;
}

export function TuviTab({ birthYear }: Props) {
  const [year, setYear]     = useState(birthYear ?? 1990);
  const [gender, setGender] = useState<"nam" | "nu">("nam");
  const [result, setResult] = useState<ReturnType<typeof getHoroscope> | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const r = getHoroscope(year, gender);
    setResult(r);
    setSearched(true);
  };

  const canChi = getCanChiYear(year);

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-xl font-bold text-white">Tử Vi Trọn Đời</h2>
        <p className="text-sm text-gray-400 mt-0.5">60 tuổi Nam Mạng & Nữ Mạng</p>
      </div>

      {/* Input card */}
      <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(15,20,40,0.9)" }}>
        {/* Year picker */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Năm Sinh</p>
        <div className="flex items-center gap-3 mb-4">
          <button
            className="w-10 h-10 rounded-full border border-white/15 text-white text-lg flex items-center justify-center active:opacity-70"
            onClick={() => setYear(y => y - 1)}
          >−</button>
          <div className="flex-1 text-center">
            <p className="text-3xl font-bold text-white">{year}</p>
            <p className="text-sm text-yellow-400">{canChi}</p>
          </div>
          <button
            className="w-10 h-10 rounded-full border border-white/15 text-white text-lg flex items-center justify-center active:opacity-70"
            onClick={() => setYear(y => y + 1)}
          >+</button>
        </div>

        {/* Gender select */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Giới Tính</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(["nam", "nu"] as const).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                gender === g
                  ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                  : "bg-white/4 border-white/8 text-gray-400"
              }`}
            >
              {g === "nam" ? "👨 Nam Mạng" : "👩 Nữ Mạng"}
            </button>
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-3 rounded-xl font-semibold text-black"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
        >
          Xem Tử Vi
        </button>
      </div>

      {/* Result */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(15,20,40,0.9)" }}
        >
          {result ? (
            <>
              {/* Title */}
              <div className="px-4 pt-4 pb-3 border-b border-white/6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-yellow-500/40 flex items-center justify-center text-2xl">
                  {gender === "nam" ? "👨" : "👩"}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{result.canChi}</p>
                  <p className="text-sm text-yellow-400">{gender === "nam" ? "Nam Mạng" : "Nữ Mạng"}</p>
                  <p className="text-xs text-gray-500">
                    {result.years.filter(y => y >= 1920 && y <= 2040).join(" · ")}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-4">
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {result.content}
                </p>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-4xl mb-3">🤔</p>
              <p className="text-white font-medium">Không tìm thấy tử vi</p>
              <p className="text-sm text-gray-400 mt-1">
                Năm {year} ({canChi}) chưa có trong bộ dữ liệu
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick nav - years born */}
      {!searched && (
        <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(15,20,40,0.9)" }}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Năm Sinh Gần Đây</p>
          <div className="grid grid-cols-3 gap-2">
            {[1970,1975,1980,1985,1990,1995,2000,2005,2010].map(y => (
              <button
                key={y}
                onClick={() => { setYear(y); }}
                className="py-2 rounded-lg text-xs text-gray-300 border border-white/8 bg-white/3 active:opacity-70"
              >
                {y} · {getCanChiYear(y).split(" ")[1]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
