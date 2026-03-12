// ============================================================
// App.tsx — Lịch Vạn Niên AI 2026 Phase 7
// Tabs: Lịch · Hỏi Thầy · Sự Kiện · Tiện Ích · Bản Mệnh
// + Onboarding Toast + Multi-member + Sounds
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBoard }    from "./components/CalendarBoard";
import { PersonalEnergy }   from "./components/PersonalEnergy";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { AiTab }            from "./tabs/AiTab";
import { ProfileTab }       from "./tabs/ProfileTab";
import { ThayTab }          from "./tabs/ThayTab";
import { TuviTab }          from "./tabs/TuviTab";
import { UtilityTab }       from "./tabs/UtilityTab";
import { EventsTab }        from "./tabs/EventsTab";
import { buildUserProfile, UserProfile } from "./utils/astrology";

type TabId = "calendar" | "thay" | "events" | "tienich" | "profile";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id:"calendar", icon:"📅", label:"Lịch"      },
  { id:"thay",     icon:"🔮", label:"Hỏi Thầy"  },
  { id:"events",   icon:"🎉", label:"Sự Kiện"   },
  { id:"tienich",  icon:"🧭", label:"Tiện Ích"  },
  { id:"profile",  icon:"👤", label:"Bản Mệnh"  },
];
const TAB_ORDER = TABS.map(t => t.id);

const pageVariants = {
  initial: (dir: number) => ({ opacity:0, x: dir>0?28:-28 }),
  animate: { opacity:1, x:0, transition:{ type:"spring" as const, damping:28, stiffness:220 } },
  exit:    (dir: number) => ({ opacity:0, x: dir>0?-28:28, transition:{ duration:0.13 } }),
};

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
const TOAST_KEY = "hcc_onboarding_toast_seen";

export default function App() {
  const [tab,     setTab]     = useState<TabId>("calendar");
  const [prevTab, setPrevTab] = useState<TabId>("calendar");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [viewDate,setViewDate]= useState<Date>(() => startOfDay(new Date()));
  const [isDark,  setIsDark]  = useState(() => {
    try { return localStorage.getItem("hcc_theme") !== "light"; } catch { return true; }
  });
  const [showToast, setShowToast] = useState(false);

  // Theme
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) { html.classList.add("dark"); html.classList.remove("light"); }
    else        { html.classList.remove("dark"); html.classList.add("light"); }
    try { localStorage.setItem("hcc_theme", isDark ? "dark" : "light"); } catch {}
    const meta = document.querySelector("meta[name='theme-color']:not([media])");
    if (meta) meta.setAttribute("content", isDark ? "#080C18" : "#FEF9EE");
  }, [isDark]);

  // Load profile
  useEffect(() => {
    const saved = localStorage.getItem("huyen_co_cac_birth_year");
    if (saved) {
      const y = parseInt(saved, 10);
      if (!isNaN(y)) setProfile(buildUserProfile(y));
    }
  }, []);

  // Onboarding toast — show once if no birth year saved
  useEffect(() => {
    const hasBirthYear = !!localStorage.getItem("huyen_co_cac_birth_year");
    const toastSeen    = !!localStorage.getItem(TOAST_KEY);
    if (!hasBirthYear && !toastSeen) {
      const t = setTimeout(() => setShowToast(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissToast = (goProfile = false) => {
    setShowToast(false);
    try { localStorage.setItem(TOAST_KEY, "1"); } catch {}
    if (goProfile) changeTab("profile");
  };

  const changeTab = useCallback((id: TabId) => {
    if (id === tab) return;
    setPrevTab(tab); setTab(id);
  }, [tab]);

  const dir = TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;

  const handleDateChange = useCallback((d: Date) => {
    setViewDate(startOfDay(d));
  }, []);

  return (
    <div className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden"
      style={{ background:"var(--bg-base)" }}>

      <Background isDark={isDark} />
      <AppHeader isDark={isDark} onToggleTheme={() => setIsDark(d => !d)} />

      <main className="relative flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={tab} custom={dir} variants={pageVariants}
            initial="initial" animate="animate" exit="exit" className="min-h-full">

            {tab === "calendar" && (
              <div className="flex flex-col pb-4">
                <CalendarBoard currentDate={viewDate} onDateChange={handleDateChange} />
                <div className="px-4 mt-4">
                  <SectionLabel label="Năng Lượng Cá Nhân" />
                </div>
                <PersonalEnergy
                  userProfile={profile}
                  currentDate={viewDate}
                  onSetupProfile={() => changeTab("profile")}
                />
              </div>
            )}

            {tab === "thay"    && <ThayTab birthYear={profile?.birthYear} />}
            {tab === "events"  && <EventsTab />}
            {tab === "tienich" && <UtilityTab birthYear={profile?.birthYear} />}
            {tab === "profile" && (
              <div>
                <ProfileTab userProfile={profile} onProfileChange={setProfile} />
                <div className="mx-4 mb-2 mt-4"><SectionLabel label="Tử Vi Trọn Đời" /></div>
                <TuviTab birthYear={profile?.birthYear} />
                <div className="mx-4 mb-2 mt-4"><SectionLabel label="AI Luận Giải" /></div>
                <AiTab date={viewDate} userProfile={profile} onSetupProfile={() => changeTab("profile")} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Onboarding Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity:0, y:-80, scale:0.92 }}
            animate={{ opacity:1, y:0,   scale:1,   transition:{ type:"spring", damping:22, stiffness:260 } }}
            exit={{    opacity:0, y:-60, scale:0.95, transition:{ duration:0.22 } }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-[calc(100%-2rem)]"
          >
            <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
              style={{
                background:"var(--bg-elevated)",
                border:"1px solid var(--gold-border)",
                boxShadow:"var(--shadow-float)",
              }}>
              <span className="text-2xl flex-shrink-0 mt-0.5">👋</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1" style={{color:"var(--text-primary)"}}>
                  Chào bạn mới!
                </p>
                <p className="text-xs leading-relaxed" style={{color:"var(--text-secondary)"}}>
                  Cập nhật <strong>Năm Sinh</strong> ở tab Bản Mệnh để nhận thông điệp vũ trụ chính xác nhé!
                </p>
                <div className="flex gap-2 mt-2.5">
                  <motion.button whileTap={{scale:0.95}} onClick={() => dismissToast(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold"
                    style={{background:"#B8720A",color:"#FFFFFF"}}>
                    👤 Cập nhật ngay
                  </motion.button>
                  <motion.button whileTap={{scale:0.95}} onClick={() => dismissToast(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold"
                    style={{background:"var(--bg-surface)",color:"var(--text-muted)"}}>
                    Bỏ qua
                  </motion.button>
                </div>
              </div>
              <button onClick={() => dismissToast(false)}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{background:"var(--bg-elevated)",color:"var(--text-faint)"}}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PWAInstallPrompt />
      <BottomNav tab={tab} onTabChange={changeTab} />
    </div>
  );
}

// ─── Background ───────────────────────────────────────────────
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

// ─── Header ───────────────────────────────────────────────────
function AppHeader({ isDark, onToggleTheme }: { isDark:boolean; onToggleTheme:()=>void }) {
  return (
    <header className="relative z-20 px-4 pt-4 pb-3 border-b"
      style={{ background:"var(--header-bg)", backdropFilter:"blur(16px)", borderColor:"var(--border-subtle)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold leading-tight"
            style={{ color:"var(--text-primary)", fontSize:"1.15rem" }}>
            Lịch Vạn Niên AI 2026
          </h1>
          <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color:"var(--text-muted)" }}>
            Lịch Âm · Phong Thủy · AI
          </p>
        </div>
        <motion.button whileTap={{ scale:0.9 }} onClick={onToggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}
          aria-label={isDark ? "Chế độ sáng" : "Chế độ tối"}>
          {isDark ? "☀️" : "🌙"}
        </motion.button>
      </div>
    </header>
  );
}

function SectionLabel({ label }: { label:string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="flex-1 h-px" style={{ background:"var(--border-subtle)" }} />
      <span className="text-xs font-bold uppercase tracking-widest"
        style={{ color:"var(--text-muted)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background:"var(--border-subtle)" }} />
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ tab, onTabChange }: { tab:TabId; onTabChange:(t:TabId)=>void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30"
      aria-label="Điều hướng chính">
      <div className="h-4 pointer-events-none"
        style={{ background:"linear-gradient(to top, var(--bg-base), transparent)" }} />
      <div className="border-t px-1 pt-1.5 pb-safe"
        style={{ background:"var(--tab-bar-bg)", backdropFilter:"blur(20px)", borderColor:"var(--border-subtle)" }}>
        <div className="flex items-center justify-around">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <motion.button key={t.id} onClick={() => onTabChange(t.id)}
                whileTap={{ scale:0.84 }}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1 flex-1"
                aria-label={t.label} aria-current={active ? "page" : undefined}>
                {active && (
                  <motion.div layoutId="tab-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background:"var(--gold)" }}
                    transition={{ type:"spring", damping:24, stiffness:280 }} />
                )}
                <motion.span className="leading-none" style={{ fontSize:"1.3rem" }}
                  animate={{ scale: active?1.15:1 }} transition={{ type:"spring", damping:15 }}>
                  {t.icon}
                </motion.span>
                <motion.span className="text-[9px] font-bold leading-none"
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
