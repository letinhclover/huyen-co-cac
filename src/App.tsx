// ============================================================
// App.tsx — Huyền Cơ Các: Root Application (Phase 2)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBoard }       from "./components/CalendarBoard";
import { PersonalEnergy }      from "./components/PersonalEnergy";
import { FortuneCard }         from "./components/FortuneCard";
import { PWAInstallPrompt }    from "./components/PWAInstallPrompt";
import { OracleTab }           from "./tabs/OracleTab";
import { ProfileTab }          from "./tabs/ProfileTab";
import { buildUserProfile, UserProfile } from "./utils/astrology";

// ─── Constants ───────────────────────────────────────────────

type TabId = "calendar" | "oracle" | "profile";

const TABS = [
  { id: "calendar" as TabId, label: "Lịch",     icon: "📅", activeIcon: "🗓️"  },
  { id: "oracle"   as TabId, label: "Gieo Quẻ", icon: "🔮", activeIcon: "✨"   },
  { id: "profile"  as TabId, label: "Bản Mệnh", icon: "👤", activeIcon: "🌟"  },
];
const TAB_ORDER: TabId[] = ["calendar", "oracle", "profile"];

const pageVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 44 : -44 }),
  animate: { opacity: 1, x: 0, transition: { type: "spring", damping: 28, stiffness: 220 } },
  exit:    (dir: number) => ({ opacity: 0, x: dir > 0 ? -44 : 44, transition: { duration: 0.18 } }),
};

// ─── Date helpers ─────────────────────────────────────────────

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ─── App Root ─────────────────────────────────────────────────

export default function App() {
  const [activeTab,    setActiveTab]    = useState<TabId>("calendar");
  const [prevTab,      setPrevTab]      = useState<TabId>("calendar");
  const [userProfile,  setUserProfile]  = useState<UserProfile | null>(null);
  const [viewDate,     setViewDate]     = useState<Date>(() => startOfDay(new Date()));

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
      const next     = addDays(d, 1);
      const tomorrow = addDays(startOfDay(new Date()), 1);
      return next > tomorrow ? d : next;
    });
  }, []);
  const handleGoToday = useCallback(() => setViewDate(startOfDay(new Date())), []);

  const today      = startOfDay(new Date());
  const isToday    = isSameDay(viewDate, today);
  const canGoNext  = !isSameDay(viewDate, addDays(today, 1));
  const direction  = TAB_ORDER.indexOf(activeTab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;

  return (
    <div className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-[#080C18]">

      {/* Background */}
      <Background />

      {/* Header */}
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

      {/* Content */}
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
            {activeTab === "oracle"  && <OracleTab />}
            {activeTab === "profile" && (
              <ProfileTab userProfile={userProfile} onProfileChange={handleProfileChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PWA install banner */}
      <PWAInstallPrompt />

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// ─── Background ───────────────────────────────────────────────

function Background() {
  return (
    <div className="fixed inset-0 max-w-md mx-auto pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1F] via-[#080C18] to-[#050810]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.6) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/4 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-64 rounded-full bg-violet-900/8 blur-3xl" />
      <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-amber-600/3 blur-2xl" />
      <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-blue-900/5 blur-2xl" />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────

interface AppHeaderProps {
  activeTab: TabId;
  userProfile: UserProfile | null;
  viewDate: Date;
  isToday: boolean;
  canGoNext: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToday: () => void;
}

function AppHeader({
  activeTab, userProfile, viewDate, isToday, canGoNext,
  onPrevDay, onNextDay, onGoToday,
}: AppHeaderProps) {
  const showNav = activeTab === "calendar";
  const label   = `${viewDate.getDate()}/${viewDate.getMonth() + 1}`;

  return (
    <header className="relative z-20 px-4 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2">

        {/* Brand */}
        <div className="flex-shrink-0">
          <h1 className="text-white/90 text-lg font-bold tracking-wide leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Huyền Cơ Các
          </h1>
          <p className="text-amber-400/50 text-[10px] tracking-[0.25em] uppercase mt-0.5">
            Lịch Vạn Niên · Tâm Linh
          </p>
        </div>

        {/* Date navigator */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-0.5 rounded-2xl border border-white/8 bg-white/5 backdrop-blur px-1 py-1"
            >
              <NavBtn onClick={onPrevDay}>‹</NavBtn>

              <motion.button whileTap={{ scale: 0.95 }} onClick={onGoToday}
                className="flex flex-col items-center px-2 min-w-14">
                <span className="text-white/75 text-xs font-semibold tabular-nums tracking-wide">{label}</span>
                <AnimatePresence mode="wait">
                  {isToday ? (
                    <motion.span key="t" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-amber-400/55 text-[9px] leading-none tracking-wider">Hôm nay</motion.span>
                  ) : (
                    <motion.span key="g" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-white/25 text-[9px] leading-none">↩ Hôm nay</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <NavBtn onClick={onNextDay} disabled={!canGoNext}>›</NavBtn>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Element badge */}
        <div className="flex-shrink-0 min-w-14 flex justify-end">
          <AnimatePresence>
            {userProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur px-2.5 py-1.5"
              >
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
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-xl font-light text-xl transition-all
        ${disabled ? "text-white/12 cursor-not-allowed" : "text-white/40 hover:text-white/80 hover:bg-white/8"}`}
    >
      {children}
    </motion.button>
  );
}

// ─── Calendar content ─────────────────────────────────────────

interface CalendarContentProps {
  viewDate: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

function CalendarContent({ viewDate, userProfile, onSetupProfile }: CalendarContentProps) {
  return (
    <div className="flex flex-col pb-4">
      <CalendarBoard currentDate={viewDate} />

      <Divider label="Năng Lượng Cá Nhân" />
      <PersonalEnergy
        userProfile={userProfile}
        currentDate={viewDate}
        onSetupProfile={onSetupProfile}
      />

      <Divider label="AI Luận Giải · Gemini" />
      <FortuneCard
        date={viewDate}
        userProfile={userProfile}
        onSetupProfile={onSetupProfile}
      />

      <QuickHint />
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="px-4 mt-4 mb-1 flex items-center gap-2">
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">{label}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function QuickHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
      className="mx-4 mt-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3 flex items-center gap-3"
    >
      <span className="text-base opacity-40">✦</span>
      <p className="text-white/35 text-xs leading-relaxed flex-1">
        Muốn nhận thông điệp ngẫu nhiên?{" "}
        <span className="text-amber-400/50">Thử tab Gieo Quẻ →</span>
      </p>
    </motion.div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────

function BottomNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30">
      <div className="h-8 bg-gradient-to-t from-[#080C18] to-transparent pointer-events-none" />
      <div className="bg-[#0B0F1A]/80 backdrop-blur-2xl border-t border-white/6 px-4 pb-safe pb-4 pt-3">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center gap-1 px-4 py-1 min-w-16"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 -inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
                <motion.span className="text-2xl" animate={{ scale: active ? 1.15 : 1 }} transition={{ type: "spring", damping: 15 }}>
                  {active ? tab.activeIcon : tab.icon}
                </motion.span>
                <motion.span
                  animate={{ color: active ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] font-medium tracking-wide"
                >
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
