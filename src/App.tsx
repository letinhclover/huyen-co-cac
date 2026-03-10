// ============================================================
// App.tsx — Huyền Cơ Các: Root Application
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBoard } from "./components/CalendarBoard";
import { PersonalEnergy } from "./components/PersonalEnergy";
import { OracleTab } from "./tabs/OracleTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { buildUserProfile, UserProfile } from "./utils/astrology";

type TabId = "calendar" | "oracle" | "profile";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  activeIcon: string;
}

const TABS: Tab[] = [
  { id: "calendar", label: "Lịch",     icon: "📅", activeIcon: "🗓️" },
  { id: "oracle",   label: "Gieo Quẻ", icon: "🔮", activeIcon: "✨" },
  { id: "profile",  label: "Bản Mệnh", icon: "👤", activeIcon: "🌟" },
];

const pageVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 28, stiffness: 220 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    transition: { duration: 0.2 },
  }),
};

const TAB_ORDER: TabId[] = ["calendar", "oracle", "profile"];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("calendar");
  const [prevTab, setPrevTab] = useState<TabId>("calendar");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentDate] = useState(() => new Date());

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("huyen_co_cac_birth_year");
    if (saved) {
      const year = parseInt(saved, 10);
      if (!isNaN(year)) {
        setUserProfile(buildUserProfile(year));
      }
    }
  }, []);

  const handleTabChange = (tabId: TabId) => {
    if (tabId === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(tabId);
  };

  const handleSetupProfile = () => {
    handleTabChange("profile");
  };

  const handleProfileChange = (profile: UserProfile | null) => {
    setUserProfile(profile);
  };

  const direction =
    TAB_ORDER.indexOf(activeTab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;

  return (
    <div className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-[#080C18]">

      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 max-w-md mx-auto pointer-events-none overflow-hidden">
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1F] via-[#080C18] to-[#050810]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251,191,36,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251,191,36,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Top glow orb */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/4 blur-3xl" />
        {/* Bottom deep glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-64 rounded-full bg-violet-900/8 blur-3xl" />
        {/* Side accents */}
        <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-amber-600/3 blur-2xl" />
        <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-blue-900/5 blur-2xl" />
      </div>

      {/* ── App header ── */}
      <AppHeader activeTab={activeTab} userProfile={userProfile} />

      {/* ── Main content area ── */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden pb-24 scroll-smooth">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-full"
          >
            {activeTab === "calendar" && (
              <CalendarContent
                currentDate={currentDate}
                userProfile={userProfile}
                onSetupProfile={handleSetupProfile}
              />
            )}
            {activeTab === "oracle" && <OracleTab />}
            {activeTab === "profile" && (
              <ProfileTab
                userProfile={userProfile}
                onProfileChange={handleProfileChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// ─── App Header ───────────────────────────────────────────────

interface AppHeaderProps {
  activeTab: TabId;
  userProfile: UserProfile | null;
}

function AppHeader({ activeTab, userProfile }: AppHeaderProps) {
  const titles: Record<TabId, string> = {
    calendar: "Huyền Cơ Các",
    oracle:   "Huyền Cơ Các",
    profile:  "Huyền Cơ Các",
  };

  return (
    <header className="relative z-20 px-5 pt-safe pt-4 pb-3 flex items-center justify-between">
      <div>
        <h1
          className="text-white/90 text-lg font-bold tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {titles[activeTab]}
        </h1>
        <p className="text-amber-400/50 text-[10px] tracking-[0.3em] uppercase -mt-0.5">
          Lịch Vạn Niên · Tâm Linh
        </p>
      </div>
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1.5"
        >
          <span className="text-sm">{userProfile.elementEmoji}</span>
          <span className="text-white/50 text-xs">Mệnh {userProfile.elementName}</span>
        </motion.div>
      )}
    </header>
  );
}

// ─── Calendar Tab Content ─────────────────────────────────────

interface CalendarContentProps {
  currentDate: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

function CalendarContent({ currentDate, userProfile, onSetupProfile }: CalendarContentProps) {
  return (
    <div className="flex flex-col pb-4">
      {/* Main calendar board */}
      <CalendarBoard currentDate={currentDate} />

      {/* Section label */}
      <div className="px-4 mt-4 mb-2 flex items-center gap-2">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">Năng Lượng Cá Nhân</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Personal energy widget */}
      <PersonalEnergy
        userProfile={userProfile}
        currentDate={currentDate}
        onSetupProfile={onSetupProfile}
      />

      {/* Quick oracle hint */}
      <QuickHint />
    </div>
  );
}

// ─── Quick Hint Banner ────────────────────────────────────────

function QuickHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mx-4 mt-2 rounded-2xl border border-white/5 bg-white/3 px-4 py-3 flex items-center gap-3"
    >
      <span className="text-xl">✦</span>
      <div className="flex-1">
        <p className="text-white/50 text-xs leading-relaxed">
          Muốn nhận thêm thông điệp hôm nay?{" "}
          <span className="text-amber-400/70">Thử Gieo Quẻ →</span>
        </p>
      </div>
    </motion.div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30">
      {/* Gradient fade up */}
      <div className="h-8 bg-gradient-to-t from-[#080C18] to-transparent pointer-events-none" />

      {/* Nav bar */}
      <div className="bg-[#0B0F1A]/80 backdrop-blur-2xl border-t border-white/6 px-4 pb-safe pb-4 pt-3">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center gap-1 px-4 py-1 min-w-16"
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 -inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}

                {/* Icon */}
                <motion.span
                  className="text-2xl"
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {isActive ? tab.activeIcon : tab.icon}
                </motion.span>

                {/* Label */}
                <motion.span
                  animate={{ color: isActive ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.3)" }}
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
