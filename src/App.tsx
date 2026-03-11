// ============================================================
// App.tsx — Huyền Cơ Các Phase 3
// 5 tabs: Lịch · AI · Gieo Quẻ · Tiện Ích · Bản Mệnh
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBoard }    from "./components/CalendarBoard";
import { PersonalEnergy }   from "./components/PersonalEnergy";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { AiTab }            from "./tabs/AiTab";
import { OracleTab }        from "./tabs/OracleTab";
import { ProfileTab }       from "./tabs/ProfileTab";
import { UtilsTab } from "./tabs/UtilsTab";
import { TuviTab } from "./tabs/TuviTab";
import { buildUserProfile, UserProfile } from "./utils/astrology";

type TabId = "calendar" | "ai" | "oracle" | "utils" | "profile";

const TABS = [
  { id: "calendar" as TabId, label: "Lịch",     icon: "📅", activeIcon: "🗓️"  },
  { id: "ai"       as TabId, label: "AI",        icon: "✨", activeIcon: "🌟"  },
  { id: "oracle"   as TabId, label: "Quẻ",       icon: "🔮", activeIcon: "🔮"  },
  { id: "utils"    as TabId, label: "Tiện Ích",  icon: "🔧", activeIcon: "⚙️"  },
  { id: "profile"  as TabId, label: "Mệnh",      icon: "👤", activeIcon: "💫"  },
];
const TAB_ORDER: TabId[] = ["calendar", "ai", "oracle", "utils", "profile"];

const pageVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0, transition: { type: "spring" as const, damping: 28, stiffness: 220 } },
  exit:    (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.16 } }),
};

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function App() {
  const [activeTab,   setActiveTab]   = useState<TabId>("calendar");
  const [prevTab,     setPrevTab]     = useState<TabId>("calendar");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewDate,    setViewDate]    = useState<Date>(() => startOfDay(new Date()));

  useEffect(() => {
    const saved = localStorage.getItem("huyen_co_cac_birth_year");
    if (saved) {
      const y = parseInt(saved, 10);
      if (!isNaN(y)) setUserProfile(buildUserProfile(y));
    }
  }, []);

  const handleTabChange = useCallback((id: TabId) => {
    if (id === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(id);
  }, [activeTab]);

  const handleProfileChange = useCallback((p: UserProfile | null) => setUserProfile(p), []);
  const handleSetupProfile  = useCallback(() => handleTabChange("profile"), [handleTabChange]);
  const handlePrevDay       = useCallback(() => setViewDate(d => addDays(d, -1)), []);
  const handleNextDay       = useCallback(() => {
    setViewDate(d => {
      const next = addDays(d, 1);
      const max  = addDays(startOfDay(new Date()), 1);
      return next > max ? d : next;
    });
  }, []);
  const handleGoToday = useCallback(() => setViewDate(startOfDay(new Date())), []);

  const today     = startOfDay(new Date());
  const isToday   = isSameDay(viewDate, today);
  const canGoNext = !isSameDay(viewDate, addDays(today, 1));
  const direction = TAB_ORDER.indexOf(activeTab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;

  return (
    <div className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-[#080C18]">
      <Background />

      <AppHeader
        activeTab={activeTab}
        userProfile={userProfile}
        viewDate={viewDate}
        isToday={isToday}
        canGoNext={canGoNext}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onGoToday={handleGoToday}
      />

      <main className="relative flex-1 overflow-y-auto overflow-x-hidden pb-24 scroll-smooth">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageVariants}
            initial="initial" animate="animate" exit="exit"
            className="min-h-full"
          >
            {activeTab === "calendar" && (
              <CalendarContent
                viewDate={viewDate}
                userProfile={userProfile}
                onSetupProfile={handleSetupProfile}
              />
            )}
            {activeTab === "ai" && (
              <AiTab
                date={viewDate}
                userProfile={userProfile}
                onSetupProfile={handleSetupProfile}
              />
            )}
            {activeTab === "oracle" && <OracleTab />}
            {activeTab === "utils" && (
              <UtilsTab birthYear={userProfile?.birthYear} />
            )}
            {activeTab === "profile" && (
              <div className="flex flex-col">
                <ProfileTab userProfile={userProfile} onProfileChange={handleProfileChange} />
                <div className="mx-4 mb-2 mt-2 flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">Tử Vi Trọn Đời</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <TuviTab birthYear={userProfile?.birthYear} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <PWAInstallPrompt />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// ─── Background ───────────────────────────────────────────────

function Background() {
  return (
    <div className="fixed inset-0 max-w-md mx-auto pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1F] via-[#080C18] to-[#050810]" />
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(251,191,36,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.6) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/4 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-64 rounded-full bg-violet-900/8 blur-3xl" />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────

function AppHeader({ activeTab, userProfile, viewDate, isToday, canGoNext, onPrevDay, onNextDay, onGoToday }: {
  activeTab: TabId; userProfile: UserProfile | null; viewDate: Date;
  isToday: boolean; canGoNext: boolean;
  onPrevDay: () => void; onNextDay: () => void; onGoToday: () => void;
}) {
  const showNav = activeTab === "calendar" || activeTab === "ai";
  const label   = `${viewDate.getDate()}/${viewDate.getMonth() + 1}`;

  return (
    <header className="relative z-20 px-4 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
          <h1 className="text-white/90 text-lg font-bold tracking-wide leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Huyền Cơ Các
          </h1>
          <p className="text-amber-400/50 text-[10px] tracking-[0.25em] uppercase mt-0.5">
            Lịch Vạn Niên · Tâm Linh
          </p>
        </div>

        <AnimatePresence>
          {showNav && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-0.5 rounded-2xl border border-white/8 bg-white/5 backdrop-blur px-1 py-1">
              <NavBtn onClick={onPrevDay}>‹</NavBtn>
              <motion.button whileTap={{ scale: 0.95 }} onClick={onGoToday}
                className="flex flex-col items-center px-2 min-w-14">
                <span className="text-white/75 text-xs font-semibold tabular-nums tracking-wide">{label}</span>
                <AnimatePresence mode="wait">
                  {isToday
                    ? <motion.span key="t" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-amber-400/55 text-[9px] leading-none tracking-wider">Hôm nay</motion.span>
                    : <motion.span key="g" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-white/25 text-[9px] leading-none">↩ Hôm nay</motion.span>
                  }
                </AnimatePresence>
              </motion.button>
              <NavBtn onClick={onNextDay} disabled={!canGoNext}>›</NavBtn>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-shrink-0 min-w-14 flex justify-end">
          <AnimatePresence>
            {userProfile && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur px-2.5 py-1.5">
                <span className="text-sm">{userProfile.elementEmoji}</span>
                <span className="text-white/45 text-[11px]">{userProfile.elementName}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function NavBtn({ onClick, disabled, children }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.button whileTap={{ scale: 0.82 }} onClick={onClick} disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-xl font-light text-xl transition-all
        ${disabled ? "text-white/12 cursor-not-allowed" : "text-white/40 hover:text-white/80 hover:bg-white/8"}`}>
      {children}
    </motion.button>
  );
}

// ─── Calendar Content ─────────────────────────────────────────

function CalendarContent({ viewDate, userProfile, onSetupProfile }: {
  viewDate: Date; userProfile: UserProfile | null; onSetupProfile: () => void;
}) {
  return (
    <div className="flex flex-col pb-4">
      <CalendarBoard currentDate={viewDate} />
      <Divider label="Năng Lượng Cá Nhân" />
      <PersonalEnergy userProfile={userProfile} currentDate={viewDate} onSetupProfile={onSetupProfile} />
      <Divider label="Khám Phá Thêm" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mx-4 grid grid-cols-2 gap-2">
        <QuickCard emoji="✨" title="AI Luận Giải" desc="Hỏi AI về ngày hôm nay" onClick={onSetupProfile} tabHint="ai" />
        <QuickCard emoji="🔧" title="Tiện Ích" desc="Đổi ngày, xem tuổi, ngày tốt" onClick={onSetupProfile} tabHint="utils" />
      </motion.div>
    </div>
  );
}

function QuickCard({ emoji, title, desc }: {
  emoji: string; title: string; desc: string; onClick: () => void; tabHint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-3 flex flex-col gap-1.5">
      <span className="text-xl">{emoji}</span>
      <p className="text-white/70 text-xs font-medium">{title}</p>
      <p className="text-white/30 text-[10px] leading-relaxed">{desc}</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="px-4 mt-4 mb-2 flex items-center gap-2">
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">{label}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────

function BottomNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30">
      <div className="h-6 bg-gradient-to-t from-[#080C18] to-transparent pointer-events-none" />
      <div className="bg-[#0B0F1A]/85 backdrop-blur-2xl border-t border-white/6 px-2 pb-safe pb-3 pt-2">
        <div className="flex items-center justify-around">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => onTabChange(tab.id)} whileTap={{ scale: 0.86 }}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 flex-1">
                {active && (
                  <motion.div layoutId="nav-pill"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }} />
                )}
                <motion.span className="text-xl leading-none"
                  animate={{ scale: active ? 1.18 : 1 }} transition={{ type: "spring", damping: 15 }}>
                  {active ? tab.activeIcon : tab.icon}
                </motion.span>
                <motion.span className="text-[9px] font-medium tracking-wide leading-none"
                  animate={{ color: active ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.2 }}>
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
