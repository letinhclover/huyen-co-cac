// ============================================================
// CalendarBoard.tsx — Tờ Lịch Trung Tâm — Design System v5
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";

interface CalendarBoardProps { currentDate: Date; }

const WEEKDAYS = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const MONTHS_VI = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];

export function CalendarBoard({ currentDate }: CalendarBoardProps) {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [direction,   setDirection]   = useState(1);
  const prevRef = useRef(currentDate);

  useEffect(() => {
    if (currentDate.toDateString() !== prevRef.current.toDateString()) {
      setDirection(currentDate > prevRef.current ? 1 : -1);
      setDisplayDate(currentDate);
      prevRef.current = currentDate;
    }
  }, [currentDate]);

  const lunar   = solarToLunar(displayDate.getDate(), displayDate.getMonth()+1, displayDate.getFullYear());
  const weekday = WEEKDAYS[displayDate.getDay()];
  const monthName = MONTHS_VI[displayDate.getMonth()];

  const isWeekend = displayDate.getDay() === 0 || displayDate.getDay() === 6;
  const isToday   = displayDate.toDateString() === new Date().toDateString();

  return (
    <div className="px-4 pt-4">
      <AnimatePresence mode="wait">
        <motion.div key={displayDate.toDateString()}
          initial={{ opacity:0, y: direction>0?20:-20 }}
          animate={{ opacity:1, y:0, transition:{ type:"spring", damping:25, stiffness:260 } }}
          exit={{ opacity:0, y: direction>0?-20:20, transition:{ duration:0.12 } }}>

          {/* Main card */}
          <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow-float)" }}>
            {/* Gradient top accent */}
            <div className="h-1 w-full" style={{ background:"linear-gradient(90deg, var(--gold), var(--gold-light))" }} />

            {/* Header row */}
            <div className="flex items-start justify-between px-5 pt-4 pb-2">
              <div>
                <p className="section-label">{weekday}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color:"var(--text-secondary)" }}>
                  {monthName} · {displayDate.getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="section-label">Âm Lịch</span>
                <span className="text-sm" style={{ color:"var(--text-secondary)" }}>
                  {lunar.isLeapMonth?"Nhuận ":""}{lunar.day}/{lunar.month}
                </span>
              </div>
            </div>

            {/* Day number */}
            <div className="relative flex items-center justify-center py-2">
              <motion.span
                className="font-display font-bold select-none leading-none"
                style={{
                  fontSize: "7.5rem",
                  color: isWeekend ? "var(--gold)" : "var(--text-primary)",
                  textShadow: "0 2px 24px rgba(0,0,0,0.08)",
                }}
                initial={{ scale:0.92 }} animate={{ scale:1 }} transition={{ type:"spring", damping:14 }}>
                {String(displayDate.getDate()).padStart(2,"0")}
              </motion.span>
              {isToday && (
                <span className="absolute top-3 right-6 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
                  Hôm nay
                </span>
              )}
            </div>

            {/* Can Chi row */}
            <div className="flex items-center px-5 pb-4 pt-1 gap-0"
              style={{ borderTop:"1px solid var(--border-subtle)" }}>
              {[
                { label:"Ngày",  val:lunar.canChiDay,   accent:true  },
                { label:"Tháng", val:lunar.canChiMonth, accent:false },
                { label:"Năm",   val:lunar.canChiYear,  accent:false },
              ].map(({ label, val, accent }, i, arr) => (
                <div key={label} className={`flex-1 flex flex-col items-center py-3 ${i<arr.length-1 ? "border-r" : ""}`}
                  style={{ borderColor:"var(--border-subtle)" }}>
                  <span className="section-label mb-1">{label}</span>
                  <span className="text-sm font-semibold" style={{ color: accent?"var(--gold)":"var(--text-primary)" }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Day detail */}
      <div className="mt-3">
        <DayDetailPanel date={currentDate} />
      </div>
    </div>
  );
}
