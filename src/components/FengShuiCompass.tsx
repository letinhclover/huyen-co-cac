// ============================================================
// FengShuiCompass.tsx
import { shareFengShuiImage } from "../utils/shareImage";
// — La Bàn Phong Thủy Bát Trạch v2
// Cảm biến: webkitCompassHeading (iOS) + 360-alpha (Android)
// Animation: framer-motion spring — không giật
// UI: SVG La Bàn sang trọng với vòng Bát Quái
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────
interface CatSet  { sinhKhi:string; thienY:string; dieNien:string; phucVi:string; }
interface HungSet { tuyetMenh:string; nguQuy:string; lucSat:string; hoaHai:string; }
interface KuaInfo { kua:number; cung:string; trach:"dong"|"tay"; tractName:string; cat:CatSet; hung:HungSet; }

// ─── Bát Trạch Lookup ────────────────────────────────────────
const BAT_TRACH: Record<number,{cung:string;trach:"dong"|"tay";tractName:string;cat:CatSet;hung:HungSet}> = {
  1:{ cung:"Khảm",  trach:"dong", tractName:"Nhóm Hướng Đông",
      cat: { sinhKhi:"Đông Nam", thienY:"Đông",     dieNien:"Nam",      phucVi:"Bắc"    },
      hung:{ hoaHai:"Tây",       lucSat:"Đông Bắc", nguQuy:"Tây Nam",   tuyetMenh:"Tây Bắc" }},
  2:{ cung:"Khôn",  trach:"tay",  tractName:"Nhóm Hướng Tây",
      cat: { sinhKhi:"Đông Bắc", thienY:"Tây",      dieNien:"Tây Bắc",  phucVi:"Tây Nam"},
      hung:{ hoaHai:"Bắc",       lucSat:"Nam",      nguQuy:"Đông Nam",  tuyetMenh:"Đông" }},
  3:{ cung:"Chấn",  trach:"dong", tractName:"Nhóm Hướng Đông",
      cat: { sinhKhi:"Nam",      thienY:"Bắc",      dieNien:"Đông Nam", phucVi:"Đông"   },
      hung:{ hoaHai:"Đông Bắc",  lucSat:"Tây",      nguQuy:"Tây Bắc",  tuyetMenh:"Tây Nam" }},
  4:{ cung:"Tốn",   trach:"dong", tractName:"Nhóm Hướng Đông",
      cat: { sinhKhi:"Bắc",      thienY:"Nam",      dieNien:"Đông",     phucVi:"Đông Nam"},
      hung:{ hoaHai:"Tây Nam",   lucSat:"Tây Bắc",  nguQuy:"Tây",      tuyetMenh:"Đông Bắc" }},
  6:{ cung:"Càn",   trach:"tay",  tractName:"Nhóm Hướng Tây",
      cat: { sinhKhi:"Tây",      thienY:"Đông Bắc", dieNien:"Tây Nam",  phucVi:"Tây Bắc"},
      hung:{ hoaHai:"Đông Nam",  lucSat:"Đông",     nguQuy:"Nam",      tuyetMenh:"Bắc"  }},
  7:{ cung:"Đoài",  trach:"tay",  tractName:"Nhóm Hướng Tây",
      cat: { sinhKhi:"Tây Bắc",  thienY:"Tây Nam",  dieNien:"Đông Bắc", phucVi:"Tây"    },
      hung:{ hoaHai:"Đông",      lucSat:"Đông Nam", nguQuy:"Bắc",      tuyetMenh:"Nam" }},
  8:{ cung:"Cấn",   trach:"tay",  tractName:"Nhóm Hướng Tây",
      cat: { sinhKhi:"Tây Nam",  thienY:"Tây Bắc",  dieNien:"Tây",      phucVi:"Đông Bắc"},
      hung:{ hoaHai:"Nam",       lucSat:"Bắc",      nguQuy:"Đông",     tuyetMenh:"Đông Nam" }},
  9:{ cung:"Ly",    trach:"dong", tractName:"Nhóm Hướng Đông",
      cat: { sinhKhi:"Đông",     thienY:"Đông Nam", dieNien:"Bắc",      phucVi:"Nam"    },
      hung:{ hoaHai:"Đông Bắc",  lucSat:"Tây Nam",  nguQuy:"Tây",      tuyetMenh:"Tây Bắc" }},
};

function calcKua(year:number, gender:"nam"|"nu"): number {
  let s = year.toString().split("").reduce((a,d)=>a+parseInt(d),0);
  while(s>=10) s=s.toString().split("").reduce((a,d)=>a+parseInt(d),0);
  let k = gender==="nam" ? (year<2000?10-s:9-s) : (year<2000?s+5:s+6);
  while(k<=0) k+=9;
  while(k>9) k-=9;
  if(k===5) k = gender==="nam"?2:8;
  return k;
}

// Direction helpers
const DIR8 = ["Bắc","Đông Bắc","Đông","Đông Nam","Nam","Tây Nam","Tây","Tây Bắc"];
const DIR_DEG: Record<string,number> = {"Bắc":0,"Đông Bắc":45,"Đông":90,"Đông Nam":135,"Nam":180,"Tây Nam":225,"Tây":270,"Tây Bắc":315};
const DIR_ABBR: Record<string,string> = {"Bắc":"B","Đông Bắc":"ĐB","Đông":"Đ","Đông Nam":"ĐN","Nam":"N","Tây Nam":"TN","Tây":"T","Tây Bắc":"TB"};
const DIR_EN: Record<string,string>   = {"Bắc":"N","Đông Bắc":"NE","Đông":"E","Đông Nam":"SE","Nam":"S","Tây Nam":"SW","Tây":"W","Tây Bắc":"NW"};

// Bát Quái symbols for the outer ring
const BAT_QUAI_SYMBOLS = ["☵","☶","☳","☴","☲","☷","☱","☰"]; // B→ĐB→Đ→ĐN→N→TN→T→TB

function headingToDir(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  const idx = Math.round(norm / 45) % 8;
  return DIR8[idx];
}


// ─── Main Component ───────────────────────────────────────────
export function FengShuiCompass() {
  const [year,       setYear]      = useState(() => {
    try { const y = parseInt(localStorage.getItem("huyen_co_cac_birth_year")??"",10); return isNaN(y)?1980:y; } catch{return 1980;}
  });
  const [gender,     setGender]    = useState<"nam"|"nu">("nam");
  const [result,     setResult]    = useState<KuaInfo|null>(null);
  const [hasCompass, setHasCompass]= useState(false);
  const [permDenied, setPermDenied]= useState(false);
  const [activeTab,  setActiveTab] = useState<"huong"|"ket-qua">("ket-qua");

  // Motion value for compass heading (degrees) — drives needle rotation
  const rawHeading  = useMotionValue(0);
  const smoothHeading = useSpring(rawHeading, { stiffness:60, damping:18, mass:0.5 });

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const ios = (e as DeviceOrientationEvent & {webkitCompassHeading?:number}).webkitCompassHeading;
    let heading: number | null = null;
    if (ios != null && ios >= 0) {
      heading = ios; // iOS: true magnetic heading, 0=North clockwise
    } else if (e.absolute && e.alpha != null) {
      // Android deviceorientationabsolute: alpha is CCW from North, invert to CW
      heading = (360 - e.alpha) % 360;
    }
    if (heading == null) return;
    rawHeading.set(heading);
  }, [rawHeading]);

  const requestCompassPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as {requestPermission?:()=>Promise<string>};
    if (typeof DOE.requestPermission === "function") {
      try {
        const perm = await DOE.requestPermission();
        if (perm === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setHasCompass(true);
        } else { setPermDenied(true); }
      } catch { setPermDenied(true); }
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setHasCompass(true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    const isIOS = typeof (DeviceOrientationEvent as unknown as {requestPermission?:unknown}).requestPermission === "function";
    if (!isIOS) {
      // Android: prefer absolute event (true North reference)
      window.addEventListener("deviceorientationabsolute" as "deviceorientation", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true); // fallback
      setHasCompass(true);
    }
    return () => {
      window.removeEventListener("deviceorientationabsolute" as "deviceorientation", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [handleOrientation]);

  const handleCalc = () => {
    if (year >= 1900 && year <= 2010) setResult({ kua:calcKua(year,gender), ...BAT_TRACH[calcKua(year,gender)] });
  };

  return (
    <div className="flex flex-col gap-3 pb-4">

      {/* Input */}
      <div className="card p-4">
        <p className="font-bold text-base mb-3" style={{ color:"var(--text-primary)" }}>🧭 Xác Định Cung Mệnh Phong Thủy</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="section-label mb-1.5">Giới tính</p>
            <div className="flex gap-1 p-0.5 rounded-xl" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
              {(["nam","nu"] as const).map(g=>(
                <button key={g} onClick={()=>setGender(g)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background:gender===g?"var(--gold)":"transparent", color:gender===g?"white":"var(--text-muted)" }}>
                  {g==="nam"?"👨 Nam":"👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="section-label mb-1.5">Năm sinh</p>
            <input type="number" value={year} onChange={e=>setYear(parseInt(e.target.value)||0)}
              className="w-full rounded-xl px-3 py-2.5 text-base font-bold outline-none text-center"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
          </div>
        </div>
        <motion.button whileTap={{scale:0.97}} onClick={handleCalc} className="btn-gold w-full py-3 rounded-2xl font-semibold">
          Xem Cung Mệnh →
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex flex-col gap-3">
            {/* Kua result */}
            <div className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="section-label mb-1">Cung Mệnh của bạn</p>
                  <p className="text-3xl font-bold font-display" style={{color:"var(--gold)"}}>
                    {result.kua} — {result.cung}
                  </p>
                </div>
                <button onClick={()=>setResult(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{background:"var(--bg-surface)",color:"var(--text-faint)"}}>✕</button>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-sm px-3 py-1 rounded-full font-semibold"
                  style={{
                    background:result.trach==="dong"?"rgba(74,222,128,0.12)":"rgba(251,146,60,0.12)",
                    color:result.trach==="dong"?"var(--accent-emerald)":"#f97316",
                    border:`1px solid ${result.trach==="dong"?"rgba(74,222,128,0.25)":"rgba(251,146,60,0.25)"}`,
                  }}>
                  {result.tractName}
                </span>
                <p className="text-xs" style={{color:"var(--text-faint)"}}>
                  {result.trach==="dong"?"Phù hợp Đông Tứ Mệnh":"Phù hợp Tây Tứ Mệnh"}
                </p>
              </div>
            </div>

            {/* Sub tabs */}
            <div className="flex gap-1 p-1 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
              {([{id:"ket-qua",label:"📋 Hướng Tốt Xấu"},{id:"huong",label:"🧭 La Bàn Thực Tế"}] as const).map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{background:activeTab===t.id?"var(--gold)":"transparent",color:activeTab===t.id?"white":"var(--text-muted)"}}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab==="ket-qua" && <DirectionCards result={result} />}
            {activeTab==="huong"   && (
              <LiveCompass
                smoothHeading={smoothHeading}
                hasCompass={hasCompass}
                permDenied={permDenied}
                onRequest={requestCompassPermission}
                result={result}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Live Compass Component (SVG + framer-motion) ─────────────
function LiveCompass({ smoothHeading, hasCompass, permDenied, onRequest, result }: {
  smoothHeading: ReturnType<typeof useSpring>;
  hasCompass: boolean; permDenied: boolean;
  onRequest: ()=>void; result: KuaInfo;
}) {
  const size = 300;
  const cx = size/2, cy = size/2;
  const R = size/2 - 8;
  const catDirs  = Object.values(result.cat);
  const hungDirs = Object.values(result.hung);
  // Disc must rotate OPPOSITE to heading so direction labels stay fixed in space
  // heading=90° (facing East) → disc rotates -90° so East label comes to top
  const negHeading = useTransform(smoothHeading, h => -h);

  return (
    <div className="card p-4 flex flex-col items-center gap-4">

      {/* Permission button for iOS */}
      {!hasCompass && !permDenied && (
        <motion.button whileTap={{scale:0.97}} onClick={onRequest}
          className="w-full py-3 rounded-2xl text-sm font-semibold"
          style={{background:"var(--gold)",color:"white"}}>
          📍 Bật Cảm Biến La Bàn
        </motion.button>
      )}
      {permDenied && (
        <div className="w-full py-3 px-4 rounded-2xl text-sm text-center"
          style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"var(--accent-red)"}}>
          Không có quyền cảm biến.<br/>Vào Settings → Safari → Motion &amp; Orientation → Bật
        </div>
      )}

      {/* SVG La Bàn */}
      <div className="relative" style={{width:size,height:size}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{position:"absolute",top:0,left:0}}>
          {/* Gradient background */}
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1428" />
              <stop offset="100%" stopColor="#0a0810" />
            </radialGradient>
            <radialGradient id="bgGradLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ede3c8" />
              <stop offset="100%" stopColor="#d5c8a8" />
            </radialGradient>
          </defs>
          {/* Outer dark circle */}
          <circle cx={cx} cy={cy} r={R} fill="url(#bgGrad)" stroke="rgba(245,166,35,0.3)" strokeWidth="2"/>
          {/* Decorative rings */}
          <circle cx={cx} cy={cy} r={R*0.92} fill="none" stroke="rgba(245,166,35,0.12)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r={R*0.70} fill="none" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r={R*0.48} fill="none" stroke="rgba(245,166,35,0.1)"  strokeWidth="1"/>
        </svg>

        {/* Rotating disc — chứa hướng và bát quái */}
          <motion.svg
            width={size} height={size} viewBox={`0 0 ${size} ${size}`}
            style={{ position:"absolute", top:0, left:0, rotate: negHeading }}
          >
            {/* Draw 8 directions */}
            {DIR8.map((dir, i) => {
              const angleDeg = DIR_DEG[dir];
              const angleRad = (angleDeg - 90) * Math.PI / 180;
              const isCat  = catDirs.includes(dir);
              const isHung = hungDirs.includes(dir);
              const color  = isCat?"#4ade80":isHung?"#f87171":"rgba(245,166,35,0.6)";
              const isMain = i%2===0; // N, E, S, W are main

              // Outer tick
              const r1=R*0.71, r2=R*0.89;
              const x1=cx+r1*Math.cos(angleRad), y1=cy+r1*Math.sin(angleRad);
              const x2=cx+r2*Math.cos(angleRad), y2=cy+r2*Math.sin(angleRad);

              // Label position
              const lr=R*0.59;
              const lx=cx+lr*Math.cos(angleRad), ly=cy+lr*Math.sin(angleRad);

              // Bát Quái symbol
              const qr=R*0.82;
              const qx=cx+qr*Math.cos(angleRad), qy=cy+qr*Math.sin(angleRad);

              return (
                <g key={dir}>
                  {/* Tick line */}
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth={isMain?2.5:1.5} strokeLinecap="round"/>
                  {/* Direction label */}
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    fill={color}
                    fontSize={isMain?14:11}
                    fontWeight="700"
                    fontFamily="'Be Vietnam Pro',sans-serif">
                    {DIR_ABBR[dir]}
                  </text>
                  {/* Bát Quái symbol */}
                  <text x={qx} y={qy} textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(245,166,35,0.45)" fontSize={11}
                    fontFamily="serif">
                    {BAT_QUAI_SYMBOLS[i]}
                  </text>
                  {/* Color dot for cat/hung */}
                  {(isCat||isHung) && (
                    <circle cx={cx+(R*0.66)*Math.cos(angleRad)} cy={cy+(R*0.66)*Math.sin(angleRad)}
                      r={4} fill={color} opacity={0.8}/>
                  )}
                </g>
              );
            })}

            {/* Degree marks (every 10°) */}
            {Array.from({length:36},(_,i)=>{
              const a=(i*10-90)*Math.PI/180;
              const r1=R*0.91, r2=R*0.93;
              return (
                <line key={i}
                  x1={cx+r1*Math.cos(a)} y1={cy+r1*Math.sin(a)}
                  x2={cx+r2*Math.cos(a)} y2={cy+r2*Math.sin(a)}
                  stroke="rgba(245,166,35,0.25)" strokeWidth="1"/>
              );
            })}
          </motion.svg>

        {/* Fixed needle — always points North (up) */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{position:"absolute",top:0,left:0,pointerEvents:"none"}}>
          {/* North needle (red, pointing up = North) */}
          <path d={`M ${cx} ${cy-8} L ${cx-6} ${cy+12} L ${cx} ${cy+4} L ${cx+6} ${cy+12} Z`}
            fill="#ef4444" opacity={0.95}/>
          {/* South needle (light gray, pointing down) */}
          <path d={`M ${cx} ${cy+8} L ${cx-5} ${cy-10} L ${cx} ${cy-3} L ${cx+5} ${cy-10} Z`}
            fill="rgba(255,255,255,0.3)"/>
          {/* Center jewel */}
          <circle cx={cx} cy={cy} r={7} fill="#1a1428" stroke="rgba(245,166,35,0.8)" strokeWidth="2"/>
          <circle cx={cx} cy={cy} r={3} fill="rgba(245,166,35,0.9)"/>

          {/* North label at top (fixed) */}
          <text x={cx} y={cy-(R*0.96)} textAnchor="middle" dominantBaseline="middle"
            fill="#ef4444" fontSize="13" fontWeight="900" fontFamily="'Be Vietnam Pro',sans-serif">
            N
          </text>
        </svg>
      </div>

      {/* Current heading readout */}
      <DirectionReadout smoothHeading={smoothHeading} result={result}/>

      {!hasCompass && (
        <p className="text-xs text-center" style={{color:"var(--text-faint)"}}>
          La bàn đang ở chế độ tĩnh. Bật cảm biến để theo dõi thực tế.
        </p>
      )}
    </div>
  );
}

// Reactive readout uses motion value
function DirectionReadout({ smoothHeading, result }: {
  smoothHeading: ReturnType<typeof useSpring>;
  result: KuaInfo;
}) {
  const [deg, setDeg]     = useState(0);
  const [dir, setDir]     = useState("Bắc");
  const [isCat, setIsCat] = useState(false);
  const [isHung,setIsHung]= useState(false);

  useEffect(() => {
    const unsub = smoothHeading.on("change", v => {
      const h = ((v % 360) + 360) % 360;
      setDeg(Math.round(h));
      const d = headingToDir(h);
      setDir(d);
      const catDirs = Object.values(result.cat);
      const hungDirs = Object.values(result.hung);
      setIsCat(catDirs.includes(d));
      setIsHung(hungDirs.includes(d) && !catDirs.includes(d));
    });
    return unsub;
  }, [smoothHeading, result]);

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl w-full"
      style={{
        background:isCat?"rgba(74,222,128,0.1)":isHung?"rgba(248,113,113,0.08)":"var(--bg-elevated)",
        border:`1px solid ${isCat?"rgba(74,222,128,0.25)":isHung?"rgba(248,113,113,0.2)":"var(--border-subtle)"}`,
      }}>
      <div className="text-2xl">{isCat?"✅":isHung?"⚠️":"🧭"}</div>
      <div className="flex-1">
        <p className="font-bold text-base" style={{color:isCat?"var(--accent-emerald)":isHung?"var(--accent-red)":"var(--text-primary)"}}>
          {deg}° — {dir}
        </p>
        <p className="text-xs" style={{color:"var(--text-muted)"}}>
          {isCat?"✨ Hướng cát — tốt lành cho bạn!":isHung?"⚠️ Hướng hung — nên tránh!":"Xoay điện thoại để kiểm tra"}
        </p>
      </div>
      <p className="text-xs font-bold" style={{color:"var(--text-faint)"}}>{DIR_EN[dir]}</p>
    </div>
  );
}

// ─── Direction Cards ──────────────────────────────────────────
function DirectionCards({ result }: { result: KuaInfo }) {
  const catEntries = [
    {key:"sinhKhi", label:"Sinh Khí",   badge:"✨ Tốt nhất",  desc:"Hướng đại cát — tài lộc, sự nghiệp hanh thông, nên đặt cửa chính"},
    {key:"thienY",  label:"Thiên Y",    badge:"💚 Rất tốt",   desc:"Hướng sức khỏe — hôn nhân, gia đình hạnh phúc, nên đặt đầu giường"},
    {key:"dieNien", label:"Diên Niên",  badge:"👍 Tốt",       desc:"Hướng trường thọ — quan hệ thuận hòa, ổn định lâu dài"},
    {key:"phucVi",  label:"Phục Vị",    badge:"😌 Bình an",   desc:"Hướng nghỉ ngơi — bình an, duy trì, không tốt không xấu"},
  ];
  const hungEntries = [
    {key:"tuyetMenh",label:"Tuyệt Mệnh", badge:"🚫 Rất xấu",  desc:"Tuyệt Mệnh (Rất xấu - Kỵ làm nhà, mở cửa) — dễ phá tài, bệnh tật"},
    {key:"nguQuy",   label:"Ngũ Quỷ",    badge:"⛔ Xấu nặng", desc:"Ngũ Quỷ (Xấu nặng - Kỵ bếp, phòng ngủ) — tai họa, kiện tụng, hỏa hoạn"},
    {key:"lucSat",   label:"Lục Sát",    badge:"⚠️ Xấu",      desc:"Lục Sát (Xấu - Hại tình duyên) — trục trặc quan hệ, dễ bị lừa đảo"},
    {key:"hoaHai",   label:"Họa Hại",    badge:"😬 Xấu nhẹ",  desc:"Họa Hại (Xấu nhẹ - Gây rắc rối) — tranh chấp nhỏ, phiền phức"},
  ];

  const handleShare = () => {
    shareFengShuiImage({
      kua: result.kua,
      cung: result.cung,
      tractName: result.tractName,
      catDirs: [
        { label:"Sinh Khí",   dir:result.cat.sinhKhi,   badge:"✨ Tốt nhất" },
        { label:"Thiên Y",    dir:result.cat.thienY,    badge:"💚 Rất tốt"  },
        { label:"Diên Niên",  dir:result.cat.dieNien,   badge:"👍 Tốt"      },
        { label:"Phục Vị",    dir:result.cat.phucVi,    badge:"😌 Bình an"  },
      ],
      hungDirs: [
        { label:"Tuyệt Mệnh", dir:result.hung.tuyetMenh, badge:"Rất xấu"  },
        { label:"Ngũ Quỷ",    dir:result.hung.nguQuy,    badge:"Xấu nặng" },
        { label:"Lục Sát",    dir:result.hung.lucSat,    badge:"Xấu"      },
        { label:"Họa Hại",    dir:result.hung.hoaHai,    badge:"Xấu nhẹ"  },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="card overflow-hidden">
        <div className="px-4 py-2.5 border-b" style={{background:"rgba(74,222,128,0.07)",borderColor:"rgba(74,222,128,0.15)"}}>
          <p className="font-semibold text-sm" style={{color:"var(--accent-emerald)"}}>✅ 4 Hướng Cát</p>
        </div>
        {catEntries.map(({key,label,badge,desc},i)=>{
          const dir=result.cat[key as keyof CatSet];
          return (
            <div key={key} className={`px-4 py-3.5 flex items-start gap-3 ${i<3?"border-b":""}`} style={{borderColor:"var(--border-subtle)"}}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold flex-shrink-0 mt-0.5"
                style={{background:"rgba(74,222,128,0.1)",color:"var(--accent-emerald)",border:"1px solid rgba(74,222,128,0.2)"}}>
                {DIR_ABBR[dir]??dir.slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-semibold" style={{color:"var(--text-primary)"}}>{label}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{background:"rgba(74,222,128,0.12)",color:"var(--accent-emerald)"}}>{badge}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{color:"var(--text-muted)"}}>{desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold" style={{color:"var(--accent-emerald)"}}>{dir}</p>
                <p className="text-xs" style={{color:"var(--text-faint)"}}>{DIR_EN[dir]}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-2.5 border-b" style={{background:"rgba(248,113,113,0.07)",borderColor:"rgba(248,113,113,0.15)"}}>
          <p className="font-semibold text-sm" style={{color:"var(--accent-red)"}}>⚠️ 4 Hướng Hung</p>
        </div>
        {hungEntries.map(({key,label,badge,desc},i)=>{
          const dir=result.hung[key as keyof HungSet];
          return (
            <div key={key} className={`px-4 py-3.5 flex items-start gap-3 ${i<3?"border-b":""}`} style={{borderColor:"var(--border-subtle)"}}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold flex-shrink-0 mt-0.5"
                style={{background:"rgba(248,113,113,0.08)",color:"var(--accent-red)",border:"1px solid rgba(248,113,113,0.15)"}}>
                {DIR_ABBR[dir]??dir.slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-semibold" style={{color:"var(--text-primary)"}}>{label}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{background:"rgba(248,113,113,0.1)",color:"var(--accent-red)"}}>{badge}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{color:"var(--text-muted)"}}>{desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold" style={{color:"var(--accent-red)"}}>{dir}</p>
                <p className="text-xs" style={{color:"var(--text-faint)"}}>{DIR_EN[dir]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ứng dụng thực tế */}
      <div className="card p-4">
        <p className="section-label mb-3">🏡 Ứng Dụng Thực Tế</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            {icon:"🏠",label:"Cửa Chính",   dir:result.cat.sinhKhi, note:"Hướng cửa quay về"},
            {icon:"🛏️",label:"Đầu Giường",  dir:result.cat.thienY,  note:"Đầu giường chỉ về"},
            {icon:"🍳",label:"Miệng Bếp",   dir:result.cat.sinhKhi, note:"Miệng bếp hướng cát"},
            {icon:"⛩️",label:"Bàn Thờ",     dir:result.cat.dieNien, note:"Mặt bàn thờ quay về"},
          ].map(({icon,label,dir,note})=>(
            <div key={label} className="rounded-xl p-3"
              style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
              <p className="text-xl mb-1.5">{icon}</p>
              <p className="text-xs font-semibold mb-0.5" style={{color:"var(--text-primary)"}}>{label}</p>
              <p className="text-base font-bold" style={{color:"var(--gold)"}}>{dir}</p>
              <p className="text-[10px] mt-0.5" style={{color:"var(--text-faint)"}}>{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share button */}
      <button onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
        style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)", color:"var(--text-secondary)" }}>
        📤 Chia sẻ Cung Mệnh
      </button>
    </div>
  );
}

