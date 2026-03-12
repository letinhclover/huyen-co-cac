// ============================================================
// CalendarBoard.tsx — Tờ Lịch + Lịch Tháng Picker v3
// - Nav buttons nhỏ gọn
// - Cho phép chọn ngày tương lai
// - Lunar converter đơn giản
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solarToLunar, lunarToSolar } from "../utils/astrology";
import { DayDetailPanel } from "./DayDetailPanel";
import { playTick } from "../utils/sounds";

interface CalendarBoardProps {
  currentDate: Date;
  onDateChange: (d: Date) => void;
}

const WD_SHORT  = ["CN","T2","T3","T4","T5","T6","T7"];
const WD_LONG   = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const MONTHS_VI = ["Th.1","Th.2","Th.3","Th.4","Th.5","Th.6","Th.7","Th.8","Th.9","Th.10","Th.11","Th.12"];

function today0(): Date { const d=new Date(); d.setHours(0,0,0,0); return d; }
function addDays(d:Date, n:number): Date { const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function sameDay(a:Date, b:Date): boolean {
  return a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();
}

function buildGrid(year:number, month:number): (Date|null)[][] {
  const first = new Date(year,month-1,1).getDay();
  const total = new Date(year,month,0).getDate();
  const cells:(Date|null)[] = Array(first).fill(null);
  for(let d=1;d<=total;d++) cells.push(new Date(year,month-1,d));
  while(cells.length%7!==0) cells.push(null);
  const rows:(Date|null)[][]=[];
  for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));
  return rows;
}

export function CalendarBoard({ currentDate, onDateChange }: CalendarBoardProps) {
  const [direction,  setDirection]  = useState(1);
  const prevRef = useRef(currentDate);

  useEffect(() => {
    if(!sameDay(currentDate,prevRef.current)){
      setDirection(currentDate>prevRef.current?1:-1);
      prevRef.current=currentDate;
    }
  },[currentDate]);

  const lunar    = solarToLunar(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear());
  const isToday  = sameDay(currentDate, today0());
  const isSunday  = currentDate.getDay() === 0;
  const isSaturday= currentDate.getDay() === 6;

  const go = (n:number) => { playTick(); onDateChange(addDays(currentDate,n)); };

  return (
    <div className="px-4 pt-4 flex flex-col gap-3">

      {/* ── Tờ Lịch ── */}
      <AnimatePresence mode="wait">
        <motion.div key={currentDate.toDateString()}
          initial={{opacity:0,y:direction>0?20:-20}}
          animate={{opacity:1,y:0,transition:{type:"spring",damping:26,stiffness:260}}}
          exit={{opacity:0,y:direction>0?-20:20,transition:{duration:0.10}}}>
          <div className="card overflow-hidden" style={{boxShadow:"var(--shadow-float)"}}>
            <div className="h-1.5 w-full" style={{background:"linear-gradient(90deg,var(--gold),var(--gold-light))"}}/>

            <div className="flex items-start justify-between px-5 pt-4 pb-1">
              <div>
                <p className="font-bold text-base" style={{color:"var(--text-secondary)"}}>{WD_LONG[currentDate.getDay()]}</p>
                <p className="text-sm mt-0.5" style={{color:"var(--text-muted)"}}>
                  {MONTHS_VI[currentDate.getMonth()].replace("Th.","Tháng ")} · {currentDate.getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-muted)"}}>Âm Lịch</span>
                <span className="text-base font-bold" style={{color:"var(--text-secondary)"}}>
                  {lunar.isLeapMonth?"Nhuận ":""}{lunar.day}/{lunar.month}
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-3">
              <motion.span className="font-display font-bold select-none"
                style={{fontSize:"8.5rem",lineHeight:1,color:isSunday?"#dc2626":isSaturday?"var(--gold)":"var(--text-primary)"}}
                initial={{scale:0.90}} animate={{scale:1}} transition={{type:"spring",damping:14}}>
                {String(currentDate.getDate()).padStart(2,"0")}
              </motion.span>
              {isToday && (
                <span className="absolute top-3 right-5 text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
                  Hôm nay
                </span>
              )}
            </div>

            <div className="flex items-center px-4 pb-4 pt-2 border-t" style={{borderColor:"var(--border-subtle)"}}>
              {[{label:"Ngày",val:lunar.canChiDay,accent:true},{label:"Tháng",val:lunar.canChiMonth,accent:false},{label:"Năm",val:lunar.canChiYear,accent:false}].map(({label,val,accent},i,a)=>(
                <div key={label} className={`flex-1 flex flex-col items-center py-2.5 ${i<a.length-1?"border-r":""}`}
                  style={{borderColor:"var(--border-subtle)"}}>
                  <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:"var(--text-muted)"}}>{label}</span>
                  <span className="text-base font-bold" style={{color:accent?"var(--gold)":"var(--text-primary)"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Nav nhỏ gọn ── */}
      <div className="flex items-center gap-2">
        <motion.button whileTap={{scale:0.88}} onClick={()=>go(-1)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-semibold text-sm"
          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-secondary)"}}>
          ‹ Hôm qua
        </motion.button>
        {!isToday && (
          <motion.button whileTap={{scale:0.88}} initial={{scale:0}} animate={{scale:1}}
            onClick={()=>{playTick();onDateChange(today0());}}
            className="px-3 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap"
            style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
            Hôm nay
          </motion.button>
        )}
        <motion.button whileTap={{scale:0.88}} onClick={()=>go(1)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-semibold text-sm"
          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-secondary)"}}>
          Ngày sau ›
        </motion.button>
      </div>

      {/* ── Mở lịch tháng ── */}
      {/* ── Chọn ngày luôn hiện ── */}
      <DatePicker currentDate={currentDate} onSelect={d=>onDateChange(d)}/>

      <DayDetailPanel date={currentDate}/>
    </div>
  );
}

// ─── Date Picker ──────────────────────────────────────────────
function DatePicker({currentDate, onSelect}:{currentDate:Date;onSelect:(d:Date)=>void}) {
  const [mode,   setMode]   = useState<"solar"|"lunar">("solar");
  const [viewY,  setViewY]  = useState(currentDate.getFullYear());
  const [viewM,  setViewM]  = useState(currentDate.getMonth()+1);

  // Lunar state
  const [lDay,   setLDay]   = useState(1);
  const [lMonth, setLMonth] = useState(1);
  const [lYear,  setLYear]  = useState(currentDate.getFullYear());
  const [lResult,setLResult]= useState<{day:number;month:number;year:number}|null>(null);
  const [lErr,   setLErr]   = useState(false);

  const rows = useMemo(()=>buildGrid(viewY,viewM),[viewY,viewM]);
  const today = today0();

  const navMonth = (dir:1|-1) => {
    setViewM(m => {
      let nm=m+dir; let ny=viewY;
      if(nm<1){nm=12;ny--;} if(nm>12){nm=1;ny++;}
      setViewY(ny); return nm;
    });
  };

  const doLunarConvert = () => {
    const r = lunarToSolar(lDay, lMonth, lYear);
    if(r){ setLResult(r); setLErr(false); }
    else { setLResult(null); setLErr(true); }
  };

  return (
    <div className="card overflow-hidden">
      {/* Mode tabs */}
      <div className="flex border-b" style={{borderColor:"var(--border-subtle)"}}>
        {([{id:"solar",label:"☀️ Dương Lịch"},{id:"lunar",label:"🌙 Quy Đổi Âm Lịch"}] as const).map(t=>(
          <button key={t.id} onClick={()=>setMode(t.id)}
            className="flex-1 py-3 text-sm font-bold transition-all"
            style={{
              color:mode===t.id?"var(--gold)":"var(--text-muted)",
              borderBottom:mode===t.id?"2px solid var(--gold)":"2px solid transparent",
              background:mode===t.id?"var(--gold-bg)":"transparent",
            }}>{t.label}</button>
        ))}
      </div>

      {mode==="solar" ? (
        <div className="p-3">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-2 px-1">
            <motion.button whileTap={{scale:0.88}} onClick={()=>navMonth(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{background:"var(--bg-elevated)",color:"var(--text-primary)"}}>‹</motion.button>
            <div className="text-center">
              <p className="font-bold" style={{color:"var(--text-primary)"}}>
                {MONTHS_VI[viewM-1].replace("Th.","Tháng ")} {viewY}
              </p>
            </div>
            <motion.button whileTap={{scale:0.88}} onClick={()=>navMonth(1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{background:"var(--bg-elevated)",color:"var(--text-primary)"}}>›</motion.button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WD_SHORT.map((w,i)=>(
              <div key={w} className="text-center py-0.5 text-xs font-bold"
                style={{color:i===0?"#dc2626":i===6?"var(--gold)":"var(--text-muted)"}}>{w}</div>
            ))}
          </div>

          {/* Grid */}
          {rows.map((row,ri)=>(
            <div key={ri} className="grid grid-cols-7">
              {row.map((cell,ci)=>{
                if(!cell) return <div key={ci}/>;
                const sel=sameDay(cell,currentDate);
                const isTd=sameDay(cell,today);
                const isSun = ci===0;
                const isSat = ci===6;
                const lun=solarToLunar(cell.getDate(),cell.getMonth()+1,cell.getFullYear());
                return (
                  <motion.button key={ci} whileTap={{scale:0.82}} onClick={()=>{playTick();onSelect(cell);}}
                    className="flex flex-col items-center py-1 rounded-lg mx-0.5 my-0.5"
                    style={{
                      background:sel?"var(--gold)":isTd?"var(--gold-bg)":"transparent",
                      border:isTd&&!sel?"1px solid var(--gold-border)":"1px solid transparent",
                    }}>
                    <span className="text-sm font-bold leading-tight"
                      style={{color:sel?"white":isSun?"#dc2626":isSat?"var(--gold)":"var(--text-primary)"}}>
                      {cell.getDate()}
                    </span>
                    <span className="text-[9px] leading-none"
                      style={{color:sel?"rgba(255,255,255,0.65)":"var(--text-faint)"}}>
                      {lun.day}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}

          {!sameDay(currentDate,today) && (
            <motion.button whileTap={{scale:0.97}} onClick={()=>onSelect(today)}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold"
              style={{background:"var(--gold-bg)",color:"var(--gold)",border:"1px solid var(--gold-border)"}}>
              Về hôm nay
            </motion.button>
          )}
        </div>
      ) : (
        /* Lunar converter — đơn giản */
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm" style={{color:"var(--text-muted)"}}>
            Nhập ngày Âm lịch → tìm ra ngày Dương lịch
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[{label:"Ngày",val:lDay,set:setLDay,min:1,max:30},{label:"Tháng ÂL",val:lMonth,set:setLMonth,min:1,max:12},{label:"Năm",val:lYear,set:setLYear,min:1900,max:2100}].map(({label,val,set,min,max})=>(
              <div key={label} className="flex flex-col items-center gap-1">
                <p className="text-xs font-bold" style={{color:"var(--text-muted)"}}>{label}</p>
                <div className="flex items-center gap-1">
                  <button onClick={()=>{playTick();set((v:number)=>Math.max(min,v-1));}}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>−</button>
                  <span className="min-w-10 text-center font-bold text-sm" style={{color:"var(--text-primary)"}}>{val}</span>
                  <button onClick={()=>{playTick();set((v:number)=>Math.min(max,v+1));}}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>+</button>
                </div>
              </div>
            ))}
          </div>

          <motion.button whileTap={{scale:0.97}} onClick={doLunarConvert}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{background:"var(--gold)",color:"white"}}>
            🔄 Quy đổi → Dương Lịch
          </motion.button>

          {lErr && <p className="text-sm text-center" style={{color:"var(--accent-red)"}}>⚠️ Không tìm được ngày tương ứng</p>}

          {lResult && !lErr && (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              className="rounded-xl p-4 text-center"
              style={{background:"var(--gold-bg)",border:"1px solid var(--gold-border)"}}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:"var(--text-muted)"}}>Ngày Dương Lịch</p>
              <p className="text-3xl font-bold font-display mb-0.5" style={{color:"var(--gold)"}}>
                {String(lResult.day).padStart(2,"0")}/{String(lResult.month).padStart(2,"0")}/{lResult.year}
              </p>
              <p className="text-sm mb-3" style={{color:"var(--text-secondary)"}}>
                {WD_LONG[new Date(lResult.year,lResult.month-1,lResult.day).getDay()]}
              </p>
              <motion.button whileTap={{scale:0.97}}
                onClick={()=>onSelect(new Date(lResult.year,lResult.month-1,lResult.day))}
                className="px-5 py-2 rounded-xl font-bold text-sm"
                style={{background:"var(--gold)",color:"white"}}>
                Xem ngày này
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
