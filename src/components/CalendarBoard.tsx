// ============================================================
// CalendarBoard.tsx — Tờ Lịch Trung Tâm
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";

interface CalendarBoardProps {
  currentDate: Date;
}

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const MONTHS_VI = [
  "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư",
  "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám",
  "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai",
];

const ELEMENT_COLORS: Record<string, string> = {
  Giáp: "text-emerald-400", Ất: "text-emerald-300",
  Bính: "text-red-400",     Đinh: "text-red-300",
  Mậu: "text-amber-500",   Kỷ: "text-amber-400",
  Canh: "text-slate-300",   Tân: "text-slate-200",
  Nhâm: "text-blue-400",    Quý: "text-blue-300",
};

export function CalendarBoard({ currentDate }: CalendarBoardProps) {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [direction, setDirection] = useState(1);
  const prevDateRef = useRef(currentDate);

  useEffect(() => {
    if (currentDate.toDateString() !== prevDateRef.current.toDateString()) {
      setDirection(currentDate > prevDateRef.current ? 1 : -1);
      setDisplayDate(currentDate);
      prevDateRef.current = currentDate;
    }
  }, [currentDate]);

  const lunar = solarToLunar(displayDate.getDate(), displayDate.getMonth() + 1, displayDate.getFullYear());
  const weekday = WEEKDAYS[displayDate.getDay()];
  const monthName = MONTHS_VI[displayDate.getMonth()];
  const dayNumber = displayDate.getDate();
  const year = displayDate.getFullYear();

  const canWord = lunar.canChiDay.split(" ")[0];
  const canColor = ELEMENT_COLORS[canWord] ?? "text-amber-300";

  const flipVariants = {
    initial: (d: number) => ({
      rotateX: d > 0 ? -90 : 90,
      opacity: 0,
      y: d > 0 ? 30 : -30,
    }),
    animate: {
      rotateX: 0,
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 180, duration: 0.5 },
    },
    exit: (d: number) => ({
      rotateX: d > 0 ? 90 : -90,
      opacity: 0,
      y: d > 0 ? -30 : 30,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="relative px-4 py-2">
      {/* Ambient glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={displayDate.toDateString()}
          custom={direction}
          variants={flipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ perspective: 1000 }}
          className="relative"
        >
          {/* Main calendar card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden shadow-2xl">

            {/* Top accent stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {/* Weekday + Month header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <div>
                <p className="text-amber-400/80 font-light tracking-[0.25em] text-xs uppercase">
                  {weekday}
                </p>
                <p className="text-white/40 text-xs font-light tracking-widest mt-0.5">
                  {monthName} · {year}
                </p>
              </div>
              {/* Lunar badge */}
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-amber-400/60 tracking-widest uppercase">Âm lịch</span>
                <span className="text-white/60 text-xs">
                  {lunar.isLeapMonth ? "Tháng nhuận " : "Tháng "}
                  {lunar.month} · {lunar.day}
                </span>
              </div>
            </div>

            {/* Giant day number */}
            <div className="relative flex items-end justify-center px-6 pb-2 pt-1">
              <motion.span
                className="font-display text-[9rem] leading-none font-bold text-white select-none"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 60px rgba(251,191,36,0.15)" }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {String(dayNumber).padStart(2, "0")}
              </motion.span>
              {/* Decorative line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Can Chi row */}
            <div className="flex items-center justify-center gap-3 px-6 py-3">
              <CanChiBadge label="Ngày" value={lunar.canChiDay} color={canColor} />
              <div className="w-px h-8 bg-white/10" />
              <CanChiBadge label="Tháng" value={lunar.canChiMonth} color="text-white/70" />
              <div className="w-px h-8 bg-white/10" />
              <CanChiBadge label="Năm" value={lunar.canChiYear} color="text-amber-400/80" />
            </div>

            {/* Bottom decorative footer */}
            <div className="px-6 pb-5 pt-1">
              <div className="rounded-2xl bg-white/3 border border-white/5 px-4 py-2.5 flex items-center gap-3">
                <span className="text-xl">🌙</span>
                <div className="flex-1">
                  <p className="text-white/35 text-[10px] tracking-widest uppercase mb-0.5">Ngày Âm Lịch</p>
                  <p className="text-white/70 text-sm font-light">
                    Ngày {lunar.day} tháng {lunar.isLeapMonth ? "(nhuận) " : ""}{lunar.month} năm {lunar.canChiYear}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 px-4">
        <DayDetailPanel date={currentDate} />
      </div>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────

interface CanChiBadgeProps {
  label: string;
  value: string;
  color: string;
}

function CanChiBadge({ label, value, color }: CanChiBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-1">
      <span className="text-[9px] text-white/30 tracking-widest uppercase">{label}</span>
      <span className={`text-sm font-medium tracking-wide ${color}`}>{value}</span>
    </div>
  );
}
