// ============================================================
// FengShuiCompass.tsx — La Bàn Phong Thủy Bát Trạch
// Tính cung phi, hướng tốt/xấu theo Đông Tứ Trạch / Tây Tứ Trạch
// DeviceOrientation API cho iOS/Android
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────
interface CatSet {
  sinhKhi: string;
  thienY:  string;
  dieNien: string;
  phucVi:  string;
}

interface HungSet {
  tuyetMenh: string;
  nguQuy:    string;
  lucSat:    string;
  hoaHai:    string;
}

interface KuaInfo {
  kua: number;
  cung: string;
  trach: "dong" | "tay";
  tractName: string;
  cat: CatSet;
  hung: HungSet;
}

// ─── Bát Trạch Lookup Table ───────────────────────────────────
// Source: Tứ Trạch phong thủy truyền thống
const BAT_TRACH: Record<number, { cung:string; trach:"dong"|"tay"; tractName:string; cat:CatSet; hung:HungSet }> = {
  1: {
    cung:"Khảm",  trach:"dong", tractName:"Đông Tứ Trạch",
    cat:  { sinhKhi:"Đông Nam", thienY:"Đông",     dieNien:"Nam",      phucVi:"Bắc"    },
    hung: { hoaHai:"Tây",       lucSat:"Đông Bắc", nguQuy:"Tây Nam",   tuyetMenh:"Tây Bắc" },
  },
  2: {
    cung:"Khôn",  trach:"tay",  tractName:"Tây Tứ Trạch",
    cat:  { sinhKhi:"Đông Bắc", thienY:"Tây",      dieNien:"Tây Bắc",  phucVi:"Tây Nam" },
    hung: { hoaHai:"Bắc",       lucSat:"Nam",      nguQuy:"Đông Nam",  tuyetMenh:"Đông" },
  },
  3: {
    cung:"Chấn",  trach:"dong", tractName:"Đông Tứ Trạch",
    cat:  { sinhKhi:"Nam",      thienY:"Bắc",      dieNien:"Đông Nam", phucVi:"Đông"   },
    hung: { hoaHai:"Đông Bắc",  lucSat:"Tây",      nguQuy:"Tây Bắc",  tuyetMenh:"Tây Nam" },
  },
  4: {
    cung:"Tốn",   trach:"dong", tractName:"Đông Tứ Trạch",
    cat:  { sinhKhi:"Bắc",      thienY:"Nam",      dieNien:"Đông",     phucVi:"Đông Nam" },
    hung: { hoaHai:"Tây Nam",   lucSat:"Tây Bắc",  nguQuy:"Tây",      tuyetMenh:"Đông Bắc" },
  },
  6: {
    cung:"Càn",   trach:"tay",  tractName:"Tây Tứ Trạch",
    cat:  { sinhKhi:"Tây",      thienY:"Đông Bắc", dieNien:"Tây Nam",  phucVi:"Tây Bắc" },
    hung: { hoaHai:"Đông Nam",  lucSat:"Đông",     nguQuy:"Nam",      tuyetMenh:"Bắc"  },
  },
  7: {
    cung:"Đoài",  trach:"tay",  tractName:"Tây Tứ Trạch",
    cat:  { sinhKhi:"Tây Bắc",  thienY:"Tây Nam",  dieNien:"Đông Bắc", phucVi:"Tây"    },
    hung: { hoaHai:"Đông",      lucSat:"Đông Nam", nguQuy:"Bắc",      tuyetMenh:"Nam" },
  },
  8: {
    cung:"Cấn",   trach:"tay",  tractName:"Tây Tứ Trạch",
    cat:  { sinhKhi:"Tây Nam",  thienY:"Tây Bắc",  dieNien:"Tây",      phucVi:"Đông Bắc" },
    hung: { hoaHai:"Nam",       lucSat:"Bắc",      nguQuy:"Đông",     tuyetMenh:"Đông Nam" },
  },
  9: {
    cung:"Ly",    trach:"dong", tractName:"Đông Tứ Trạch",
    cat:  { sinhKhi:"Đông",     thienY:"Đông Nam", dieNien:"Bắc",      phucVi:"Nam"    },
    hung: { hoaHai:"Đông Bắc",  lucSat:"Tây Nam",  nguQuy:"Tây",      tuyetMenh:"Tây Bắc" },
  },
};

// ─── Tính Cung Phi ────────────────────────────────────────────
function calcKua(year: number, gender: "nam" | "nu"): number {
  // Rút gọn tổng các chữ số năm sinh
  let sum = year.toString().split("").reduce((acc, d) => acc + parseInt(d), 0);
  while (sum >= 10) sum = sum.toString().split("").reduce((a, d) => a + parseInt(d), 0);

  let kua: number;
  if (gender === "nam") {
    kua = year < 2000 ? 10 - sum : 9 - sum;
    while (kua <= 0) kua += 9;
    if (kua === 5) kua = 2;
  } else {
    kua = year < 2000 ? sum + 5 : sum + 6;
    while (kua > 9) kua -= 9;
    if (kua === 5) kua = 8;
  }
  return kua;
}

function getKuaInfo(year: number, gender: "nam" | "nu"): KuaInfo {
  const kua = calcKua(year, gender);
  const data = BAT_TRACH[kua];
  return { kua, ...data };
}

// ─── Direction Indicator ─────────────────────────────────────
const DIR_DEGREES: Record<string, number> = {
  "Bắc":8,"Đông Bắc":45,"Đông":90,"Đông Nam":135,
  "Nam":180,"Tây Nam":225,"Tây":270,"Tây Bắc":315,
};
const DIR_ABBR: Record<string, string> = {
  "Bắc":"B","Đông Bắc":"ĐB","Đông":"Đ","Đông Nam":"ĐN",
  "Nam":"N","Tây Nam":"TN","Tây":"T","Tây Bắc":"TB",
};
const DIR_EN: Record<string, string> = {
  "Bắc":"N","Đông Bắc":"NE","Đông":"E","Đông Nam":"SE",
  "Nam":"S","Tây Nam":"SW","Tây":"W","Tây Bắc":"NW",
};

// ─── Main Component ───────────────────────────────────────────
export function FengShuiCompass() {
  const [year,   setYear]   = useState(1990);
  const [gender, setGender] = useState<"nam"|"nu">("nam");
  const [result, setResult] = useState<KuaInfo | null>(null);
  const [compass, setCompass] = useState(0);    // device heading degrees
  const [hasCompass, setHasCompass] = useState(false);
  const [permDenied, setPermDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<"huong"|"ket-qua">("ket-qua");

  // ─── Device Orientation ────────────────────────────────────
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // alpha = compass heading on some devices
    const alpha = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading
      ?? (e.alpha != null ? (360 - e.alpha) : null);
    if (alpha != null) setCompass(Math.round(alpha));
  }, []);

  const requestCompassPermission = useCallback(async () => {
    // iOS 13+
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === "function") {
      try {
        const perm = await DOE.requestPermission();
        if (perm === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setHasCompass(true);
        } else {
          setPermDenied(true);
        }
      } catch {
        setPermDenied(true);
      }
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setHasCompass(true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    // Auto-start on Android
    if (window.DeviceOrientationEvent && typeof (DeviceOrientationEvent as unknown as {requestPermission?:unknown}).requestPermission !== "function") {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setHasCompass(true);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, [handleOrientation]);

  const handleCalc = () => {
    if (year >= 1900 && year <= 2020) setResult(getKuaInfo(year, gender));
  };

  // Heading to Vietnamese direction
  const headingToDir = (deg: number): string => {
    const dirs = ["Bắc","Đông Bắc","Đông","Đông Nam","Nam","Tây Nam","Tây","Tây Bắc","Bắc"];
    const idx = Math.round(((deg + 22.5) % 360) / 45);
    return dirs[idx];
  };
  const currentDir = headingToDir(compass);
  const isCat = result ? Object.values(result.cat).includes(currentDir) : false;
  const isHung = result && !isCat ? Object.values(result.hung).includes(currentDir) : false;

  return (
    <div className="flex flex-col gap-3 pb-4">

      {/* Input card */}
      <div className="card p-4">
        <p className="font-semibold text-sm mb-3" style={{ color:"var(--text-primary)" }}>
          🧭 Tính Cung Phi Bát Trạch
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Gender */}
          <div>
            <p className="section-label mb-1.5">Giới tính</p>
            <div className="flex gap-1 p-0.5 rounded-xl" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
              {(["nam","nu"] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background:gender===g?"var(--gold)":"transparent", color:gender===g?"white":"var(--text-muted)" }}>
                  {g==="nam"?"👨 Nam":"👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          {/* Year */}
          <div>
            <p className="section-label mb-1.5">Năm sinh</p>
            <input type="number" value={year} onChange={e=>setYear(parseInt(e.target.value)||0)}
              placeholder="1990"
              className="w-full rounded-xl px-3 py-2 text-sm font-bold outline-none"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", color:"var(--text-primary)" }} />
          </div>
        </div>
        <motion.button whileTap={{ scale:0.97 }} onClick={handleCalc}
          className="btn-gold w-full py-2.5 rounded-2xl text-sm">
          Tính Cung Phi →
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex flex-col gap-3">

            {/* Kua info */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="section-label mb-0.5">Cung Phi</p>
                  <p className="text-2xl font-bold font-display" style={{ color:"var(--gold)" }}>
                    {result.kua} — {result.cung}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: result.trach==="dong" ? "rgba(52,211,153,0.12)" : "rgba(251,146,60,0.12)",
                      color: result.trach==="dong" ? "var(--accent-emerald)" : "#f97316",
                      border: `1px solid ${result.trach==="dong"?"rgba(52,211,153,0.25)":"rgba(251,146,60,0.25)"}`,
                    }}>
                    {result.tractName}
                  </span>
                </div>
              </div>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                {result.trach==="dong"
                  ? "Hợp với các hướng: Đông, Tây Nam, Nam, Bắc, Đông Nam"
                  : "Hợp với các hướng: Tây, Đông Bắc, Tây Nam, Tây Bắc"}
              </p>
            </div>

            {/* Sub tab */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
              {([{id:"ket-qua",label:"📋 Hướng Tốt Xấu"},{id:"huong",label:"🧭 La Bàn Thực Tế"}] as const).map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold"
                  style={{ background:activeTab===t.id?"var(--gold)":"transparent", color:activeTab===t.id?"white":"var(--text-muted)" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "ket-qua" && <DirectionCards result={result} />}
            {activeTab === "huong" && (
              <CompassUI
                heading={compass} currentDir={currentDir} isCat={isCat} isHung={isHung}
                hasCompass={hasCompass} permDenied={permDenied}
                onRequest={requestCompassPermission} result={result}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Direction Cards ──────────────────────────────────────────
function DirectionCards({ result }: { result: KuaInfo }) {
  const catEntries: { key:string; label:string; desc:string }[] = [
    { key:"sinhKhi",  label:"Sinh Khí",   desc:"Tốt nhất: tài lộc, sự nghiệp" },
    { key:"thienY",   label:"Thiên Y",    desc:"Sức khỏe, hôn nhân, gia đình" },
    { key:"dieNien",  label:"Diên Niên",  desc:"Thọ mệnh, quan hệ tốt, ổn định" },
    { key:"phucVi",   label:"Phục Vị",    desc:"Bình an, duy trì, tốt cho nghỉ ngơi" },
  ];
  const hungEntries: { key:string; label:string; desc:string }[] = [
    { key:"tuyetMenh", label:"Tuyệt Mệnh", desc:"Xấu nhất: phá tài, bệnh tật" },
    { key:"nguQuy",    label:"Ngũ Quỷ",    desc:"Tai họa, kiện tụng, hỏa hoạn" },
    { key:"lucSat",    label:"Lục Sát",    desc:"Tình duyên trục trặc, lừa đảo" },
    { key:"hoaHai",    label:"Họa Hại",    desc:"Tranh chấp, rắc rối, thất bại nhỏ" },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {/* Hướng tốt */}
      <div className="card overflow-hidden">
        <div className="px-4 py-2.5 border-b" style={{ background:"rgba(52,211,153,0.06)", borderColor:"rgba(52,211,153,0.15)" }}>
          <p className="text-sm font-semibold" style={{ color:"var(--accent-emerald)" }}>✅ 4 Hướng Cát</p>
        </div>
        {catEntries.map(({ key, label, desc }, i) => {
          const dir = result.cat[key as keyof typeof result.cat];
          return (
            <div key={key} className={`px-4 py-3 flex items-center gap-3 ${i<3?"border-b":""}`}
              style={{ borderColor:"var(--border-subtle)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background:"rgba(52,211,153,0.1)", color:"var(--accent-emerald)", border:"1px solid rgba(52,211,153,0.2)" }}>
                {DIR_ABBR[dir]??dir.slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{label}</p>
                <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{ color:"var(--accent-emerald)" }}>{dir}</p>
                <p className="text-[10px]" style={{ color:"var(--text-faint)" }}>{DIR_EN[dir]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hướng xấu */}
      <div className="card overflow-hidden">
        <div className="px-4 py-2.5 border-b" style={{ background:"rgba(239,68,68,0.06)", borderColor:"rgba(239,68,68,0.15)" }}>
          <p className="text-sm font-semibold" style={{ color:"var(--accent-red)" }}>⚠️ 4 Hướng Hung</p>
        </div>
        {hungEntries.map(({ key, label, desc }, i) => {
          const dir = result.hung[key as keyof typeof result.hung];
          return (
            <div key={key} className={`px-4 py-3 flex items-center gap-3 ${i<3?"border-b":""}`}
              style={{ borderColor:"var(--border-subtle)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background:"rgba(239,68,68,0.08)", color:"var(--accent-red)", border:"1px solid rgba(239,68,68,0.15)" }}>
                {DIR_ABBR[dir]??dir.slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{label}</p>
                <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{ color:"var(--accent-red)" }}>{dir}</p>
                <p className="text-[10px]" style={{ color:"var(--text-faint)" }}>{DIR_EN[dir]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications */}
      <ApplicationCards result={result} />
    </div>
  );
}

function ApplicationCards({ result }: { result: KuaInfo }) {
  const apps = [
    { icon:"🏠", label:"Hướng Cửa Chính", dir: result.cat.sinhKhi, note:"Cửa nhà quay về" },
    { icon:"🛏️", label:"Đầu Giường Ngủ",  dir: result.cat.thienY,  note:"Đầu giường chỉ về" },
    { icon:"🍳", label:"Hướng Bếp Nấu",   dir: result.hung.tuyetMenh, note:"Bếp tọa hướng hung — miệng bếp quay về hướng cát: "+result.cat.sinhKhi },
    { icon:"⛩️", label:"Hướng Bàn Thờ",   dir: result.cat.dieNien, note:"Bàn thờ quay mặt về" },
  ];
  return (
    <div className="card p-4">
      <p className="section-label mb-3">🏡 Ứng Dụng Thực Tế</p>
      <div className="grid grid-cols-2 gap-2">
        {apps.map(({ icon, label, dir, note }) => (
          <div key={label} className="rounded-xl p-3" style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
            <p className="text-xl mb-1">{icon}</p>
            <p className="text-xs font-semibold mb-0.5" style={{ color:"var(--text-primary)" }}>{label}</p>
            <p className="text-base font-bold" style={{ color:"var(--gold)" }}>{dir}</p>
            <p className="text-[10px] mt-0.5" style={{ color:"var(--text-faint)" }}>{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Compass UI ───────────────────────────────────────────────
function CompassUI({ heading, currentDir, isCat, isHung, hasCompass, permDenied, onRequest, result }: {
  heading:number; currentDir:string; isCat:boolean; isHung:boolean;
  hasCompass:boolean; permDenied:boolean; onRequest:()=>void; result:KuaInfo;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw compass on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width; const H = canvas.height;
    const cx = W/2; const cy = H/2; const R = W/2 - 12;

    // Resolve CSS variables at draw time
    const cs = getComputedStyle(document.documentElement);
    const clrRing    = cs.getPropertyValue("--border-medium").trim() || "rgba(255,255,255,0.1)";
    const clrRing2   = cs.getPropertyValue("--border-subtle").trim() || "rgba(255,255,255,0.06)";
    const clrFaint   = cs.getPropertyValue("--text-faint").trim()    || "#5A5248";
    const clrSec     = cs.getPropertyValue("--text-secondary").trim()|| "#C4BAB0";
    const clrGold    = cs.getPropertyValue("--gold").trim()          || "#F59E0B";
    const clrGray    = cs.getPropertyValue("--text-muted").trim()    || "#8A8070";

    ctx.clearRect(0,0,W,H);

    // Outer ring
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle = clrRing; ctx.lineWidth=2; ctx.stroke();

    // Inner ring
    ctx.beginPath(); ctx.arc(cx,cy,R*0.75,0,Math.PI*2);
    ctx.strokeStyle = clrRing2; ctx.lineWidth=1; ctx.stroke();

    // Draw directions
    const dirs = ["B","ĐB","Đ","ĐN","N","TN","T","TB"];
    const fullDirs = ["Bắc","Đông Bắc","Đông","Đông Nam","Nam","Tây Nam","Tây","Tây Bắc"];
    const catDirs = Object.values(result.cat);
    const hungDirs = Object.values(result.hung);

    dirs.forEach((abbr, i) => {
      const angle = (i * 45 - heading - 90) * Math.PI / 180;
      const fd = fullDirs[i];
      const isC = catDirs.includes(fd);
      const isH = hungDirs.includes(fd);

      // Tick marks
      const r1 = isC||isH ? R*0.72 : R*0.78;
      const r2 = R*0.96;
      ctx.beginPath();
      ctx.moveTo(cx+r1*Math.cos(angle), cy+r1*Math.sin(angle));
      ctx.lineTo(cx+r2*Math.cos(angle), cy+r2*Math.sin(angle));
      ctx.strokeStyle = isC ? "#22c55e" : isH ? "#ef4444" : clrFaint;
      ctx.lineWidth = isC||isH ? 2.5 : 1;
      ctx.stroke();

      // Labels
      const lr = R*0.6;
      ctx.font = `bold ${i%2===0?"13":"10"}px 'Be Vietnam Pro',sans-serif`;
      ctx.fillStyle = isC ? "#22c55e" : isH ? "#ef4444" : clrSec;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(abbr, cx+lr*Math.cos(angle), cy+lr*Math.sin(angle));
    });

    // Center dot
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2);
    ctx.fillStyle = clrGold; ctx.fill();

    // North needle (red)
    const northAngle = (-heading - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R*0.4*Math.cos(northAngle), cy + R*0.4*Math.sin(northAngle));
    ctx.strokeStyle="#ef4444"; ctx.lineWidth=3; ctx.lineCap="round"; ctx.stroke();

    // South needle (gray)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R*0.35*Math.cos(northAngle+Math.PI), cy + R*0.35*Math.sin(northAngle+Math.PI));
    ctx.strokeStyle=clrGray; ctx.lineWidth=2; ctx.stroke();

  }, [heading, result]);

  return (
    <div className="card p-4 flex flex-col items-center gap-3">
      {!hasCompass && !permDenied && (
        <motion.button whileTap={{ scale:0.97 }} onClick={onRequest}
          className="btn-gold w-full py-2.5 rounded-2xl text-sm">
          📍 Bật La Bàn Thực Tế
        </motion.button>
      )}
      {permDenied && (
        <p className="text-xs text-center py-2" style={{ color:"var(--text-muted)" }}>
          Không có quyền truy cập cảm biến.<br/>Hãy cho phép trong Settings.
        </p>
      )}

      {/* Compass canvas */}
      <div className="relative">
        <canvas ref={canvasRef} width={240} height={240}
          style={{ borderRadius:"50%", background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }} />
      </div>

      {/* Current direction indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full"
        style={{
          background: isCat ? "rgba(52,211,153,0.1)" : isHung ? "rgba(239,68,68,0.08)" : "var(--bg-elevated)",
          border: `1px solid ${isCat?"rgba(52,211,153,0.25)":isHung?"rgba(239,68,68,0.2)":"var(--border-subtle)"}`,
        }}>
        <div className="text-2xl">{isCat?"✅":isHung?"⚠️":"🧭"}</div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: isCat?"var(--accent-emerald)":isHung?"var(--accent-red)":"var(--text-primary)" }}>
            {Math.round(heading)}° — {currentDir}
          </p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            {isCat ? "Hướng cát — tốt lành!" : isHung ? "Hướng hung — nên tránh!" : "Xoay điện thoại để kiểm tra"}
          </p>
        </div>
      </div>

      {!hasCompass && (
        <p className="text-xs text-center" style={{ color:"var(--text-faint)" }}>
          La bàn đang dùng hướng tĩnh. Bật cảm biến để theo dõi thực tế.
        </p>
      )}
    </div>
  );
}
