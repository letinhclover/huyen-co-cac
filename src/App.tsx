// ============================================================
// App.tsx — Lịch Vạn Niên AI 2026 Phase 6
// Tabs: Lịch · Hỏi Thầy · Xem Ngày · Tiện Ích · Bản Mệnh
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBoard }    from "./components/CalendarBoard";
import { PersonalEnergy }   from "./components/PersonalEnergy";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { AiTab }            from "./tabs/AiTab";
import { ProfileTab }       from "./tabs/ProfileTab";
import { UtilsTab }         from "./tabs/UtilsTab";
import { ThayTab }          from "./tabs/ThayTab";
import { TuviTab }          from "./tabs/TuviTab";
import { UtilityTab }       from "./tabs/UtilityTab";
import { buildUserProfile, UserProfile } from "./utils/astrology";

type TabId = "calendar" | "thay" | "utils" | "tienich" | "profile";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id:"calendar", icon:"📅", label:"Lịch"     },
  { id:"thay",     icon:"🔮", label:"Hỏi Thầy" },
  { id:"utils",    icon:"🗓", label:"Xem Ngày"  },
  { id:"tienich",  icon:"🧭", label:"Tiện Ích"  },
  { id:"profile",  icon:"👤", label:"Bản Mệnh"  },
];
const TAB_ORDER = TABS.map(t => t.id);

const pageVariants = {
  initial: (dir: number) => ({ opacity:0, x: dir>0?32:-32 }),
  animate: { opacity:1, x:0, transition:{ type:"spring" as const, damping:28, stiffness:220 } },
  exit:    (dir: number) => ({ opacity:0, x: dir>0?-32:32, transition:{ duration:0.14 } }),
};

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d: Date, n: number) { const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export default function App() {
  const [tab,     setTab]     = useState<TabId>("calendar");
  const [prevTab, setPrevTab] = useState<TabId>("calendar");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [viewDate,setViewDate]= useState<Date>(() => startOfDay(new Date()));
  const [isDark,  setIsDark]  = useState(() => {
    try { return localStorage.getItem("hcc_theme") !== "light"; } catch { return true; }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) { html.classList.add("dark"); html.classList.remove("light"); }
    else        { html.classList.remove("dark"); html.classList.add("light"); }
    try { localStorage.setItem("hcc_theme", isDark ? "dark" : "light"); } catch {}
    const meta = document.querySelector("meta[name='theme-color']:not([media])");
    if (meta) meta.setAttribute("content", isDark ? "#080C18" : "#FEF9EE");
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem("huyen_co_cac_birth_year");
    if (saved) { const y=parseInt(saved,10); if (!isNaN(y)) setProfile(buildUserProfile(y)); }
  }, []);

  const changeTab = useCallback((id: TabId) => {
    if (id === tab) return;
    setPrevTab(tab); setTab(id);
  }, [tab]);

  const dir = TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;
  const today = startOfDay(new Date());
  const isToday = isSameDay(viewDate, today);

  const handlePrev = useCallback(() => setViewDate(d => addDays(d,-1)), []);
  const handleNext = useCallback(() => {
    setViewDate(d => { const n=addDays(d,1); return n>addDays(today,1)?d:n; });
  }, []);
  const goToday = useCallback(() => setViewDate(today), []);

  return (
    <div className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      <Background isDark={isDark} />
      <AppHeader
        isDark={isDark} onToggleTheme={() => setIsDark(d => !d)}
        tab={tab} viewDate={viewDate} isToday={isToday}
        onPrev={handlePrev} onNext={handleNext} onToday={goToday}
      />
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={tab} custom={dir} variants={pageVariants}
            initial="initial" animate="animate" exit="exit" className="min-h-full">
            {tab === "calendar" && (
              <CalendarContent viewDate={viewDate} profile={profile}
                onSetupProfile={() => changeTab("profile")} />
            )}
            {tab === "thay"    && <ThayTab birthYear={profile?.birthYear} />}
            {tab === "utils"   && <UtilsTab birthYear={profile?.birthYear} />}
            {tab === "tienich" && <UtilityTab birthYear={profile?.birthYear} />}
            {tab === "profile" && (
              <div>
                <ProfileTab userProfile={profile} onProfileChange={setProfile} />
                <div className="mx-4 mb-2 mt-4"><Divider label="Tử Vi Trọn Đời" /></div>
                <TuviTab birthYear={profile?.birthYear} />
                <div className="mx-4 mb-2 mt-4"><Divider label="AI Luận Giải" /></div>
                <AiTab date={viewDate} userProfile={profile} onSetupProfile={() => {}} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <PWAInstallPrompt />
      <BottomNav tab={tab} onTabChange={changeTab} />
    </div>
  );
}

function Background({ isDark }: { isDark: boolean }) {
  return (
    <div className="fixed inset-0 max-w-md mx-auto pointer-events-none overflow-hidden" aria-hidden>
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1F] via-[#080C18] to-[#050810]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage:"linear-gradient(rgba(245,158,11,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.5) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background:"radial-gradient(circle,#F59E0B 0%,transparent 70%)" }} />
        </>
      ) : (
        <>
          <div className="absolute inset-0" style={{ background:"var(--bg-base)" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage:"linear-gradient(rgba(200,133,10,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(200,133,10,0.8) 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background:"radial-gradient(circle,#C8850A 0%,transparent 70%)" }} />
        </>
      )}
    </div>
  );
}

function AppHeader({ isDark, onToggleTheme, tab, viewDate, isToday, onPrev, onNext, onToday }: {
  isDark: boolean; onToggleTheme: () => void;
  tab: TabId; viewDate: Date; isToday: boolean;
  onPrev: ()=>void; onNext: ()=>void; onToday: ()=>void;
}) {
  const showNav = tab === "calendar";
  return (
    <header className="relative z-20 px-4 pt-4 pb-3 border-b"
      style={{ background:"var(--header-bg)", backdropFilter:"blur(16px)", borderColor:"var(--border-subtle)" }}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display font-bold text-base leading-tight" style={{ color:"var(--text-primary)" }}>
            Lịch Vạn Niên AI 2026
          </h1>
          <p className="text-[10px] tracking-[0.15em] uppercase mt-0.5" style={{ color:"var(--text-muted)" }}>
            Lịch Âm · Phong Thủy · AI
          </p>
        </div>
        <AnimatePresence>
          {showNav && (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="flex items-center gap-0.5 rounded-2xl px-1 py-1"
              style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
              <NavBtn onClick={onPrev}>‹</NavBtn>
              <button onClick={onToday} className="flex flex-col items-center px-2.5 min-w-14">
                <span className="font-semibold text-xs tabular-nums" style={{ color:"var(--text-primary)" }}>
                  {viewDate.getDate()}/{viewDate.getMonth()+1}
                </span>
                <span className="text-[9px]" style={{ color: isToday?"var(--gold)":"var(--text-faint)" }}>
                  {isToday ? "Hôm nay" : "↩ Hôm nay"}
                </span>
              </button>
              <NavBtn onClick={onNext}>›</NavBtn>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileTap={{ scale:0.9 }} onClick={onToggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}
          aria-label={isDark ? "Chế độ sáng" : "Chế độ tối"}>
          {isDark ? "☀️" : "🌙"}
        </motion.button>
      </div>
    </header>
  );
}

function NavBtn({ onClick, disabled, children }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode }) {
  return (
    <motion.button whileTap={{ scale:0.85 }} onClick={onClick} disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-xl text-xl font-light transition-all"
      style={{ color: disabled?"var(--border-medium)":"var(--text-secondary)" }}>
      {children}
    </motion.button>
  );
}

function CalendarContent({ viewDate, profile, onSetupProfile }: {
  viewDate: Date; profile: UserProfile | null; onSetupProfile: ()=>void;
}) {
  return (
    <div className="flex flex-col pb-4">
      <CalendarBoard currentDate={viewDate} />
      <Divider label="Năng Lượng Cá Nhân" />
      <PersonalEnergy userProfile={profile} currentDate={viewDate} onSetupProfile={onSetupProfile} />
      <Divider label="Khám Phá" />
      <div className="mx-4 grid grid-cols-2 gap-2.5">
        <QuickCard emoji="🔮" title="Hỏi Thầy Lão Đại"  desc="64 quẻ Kinh Dịch + AI" />
        <QuickCard emoji="📅" title="Xem Ngày Tốt"      desc="18 mục đích, dữ liệu thật" />
        <QuickCard emoji="🧭" title="La Bàn Phong Thủy" desc="Hướng nhà, bàn thờ, bếp" />
        <QuickCard emoji="🙏" title="Văn Khấn"          desc="25 bài, Smart Fill tên/địa chỉ" />
      </div>
    </div>
  );
}

function QuickCard({ emoji, title, desc }: { emoji:string; title:string; desc:string }) {
  return (
    <div className="card p-3 flex flex-col gap-1.5">
      <span className="text-2xl">{emoji}</span>
      <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{title}</p>
      <p className="text-xs" style={{ color:"var(--text-faint)" }}>{desc}</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="px-4 mt-4 mb-3 flex items-center gap-2.5">
      <div className="flex-1 h-px" style={{ background:"var(--border-subtle)" }} />
      <span className="section-label">{label}</span>
      <div className="flex-1 h-px" style={{ background:"var(--border-subtle)" }} />
    </div>
  );
}

function BottomNav({ tab, onTabChange }: { tab: TabId; onTabChange: (t:TabId)=>void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30"
      aria-label="Điều hướng chính">
      <div className="h-4 pointer-events-none"
        style={{ background:"linear-gradient(to top, var(--bg-base), transparent)" }} />
      <div className="border-t tab-bar-safe px-2 pt-2"
        style={{ background:"var(--tab-bar-bg)", backdropFilter:"blur(20px)", borderColor:"var(--border-subtle)" }}>
        <div className="flex items-center justify-around">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <motion.button key={t.id} onClick={() => onTabChange(t.id)}
                whileTap={{ scale:0.86 }}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1 flex-1"
                aria-label={t.label} aria-current={active ? "page" : undefined}>
                {active && (
                  <motion.div layoutId="tab-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background:"var(--gold)" }}
                    transition={{ type:"spring", damping:24, stiffness:280 }} />
                )}
                <motion.span className="text-xl leading-none"
                  animate={{ scale: active?1.15:1 }} transition={{ type:"spring", damping:15 }}>
                  {t.icon}
                </motion.span>
                <motion.span className="text-[9px] font-semibold leading-none"
                  animate={{ color: active?"var(--gold)":"var(--text-muted)" }}
                  transition={{ duration:0.2 }}>
                  {t.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
