// ============================================================
// PWAInstallPrompt.tsx — Banner cài đặt PWA tinh tế
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// BeforeInstallPromptEvent không có trong TypeScript lib — khai báo thủ công
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISSED_KEY = "hcc_pwa_dismissed";
const DISMISSED_TTL = 7 * 24 * 60 * 60 * 1000; // 7 ngày mới hỏi lại

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible]               = useState(false);
  const [installing, setInstalling]         = useState(false);
  const [installed, setInstalled]           = useState(false);

  useEffect(() => {
    // Đã cài rồi? (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Kiểm tra dismissed TTL
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < DISMISSED_TTL) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay 3s sau khi mount mới hiện — không làm phiền ngay
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Lắng nghe event cài thành công
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setTimeout(() => setVisible(false), 2500);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setTimeout(() => setVisible(false), 2500);
      } else {
        setInstalling(false);
      }
    } catch {
      setInstalling(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 200 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-3 z-40 pointer-events-none"
        >
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0D0F1C]/90 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Top gradient accent */}
            <div className="h-0.5 bg-gradient-to-r from-violet-500/40 via-amber-400/40 to-violet-500/40" />

            <div className="px-4 py-3.5 flex items-center gap-3">
              {/* Icon */}
              <AnimatePresence mode="wait">
                {installed ? (
                  <motion.div
                    key="installed"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-10 h-10 flex-shrink-0 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-xl"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    className="w-10 h-10 flex-shrink-0 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl"
                  >
                    🔮
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {installed ? (
                    <motion.p
                      key="done-text"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-emerald-400 text-sm font-medium"
                    >
                      Đã cài đặt thành công! 🎉
                    </motion.p>
                  ) : (
                    <motion.div key="prompt-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-white/80 text-sm font-medium leading-snug">
                        Tải App Huyền Cơ Các
                      </p>
                      <p className="text-white/35 text-xs leading-relaxed mt-0.5 truncate">
                        Nhận thông điệp vũ trụ mỗi sáng 🌌
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              {!installed && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleDismiss}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-white/50 transition-colors text-lg"
                  >
                    ×
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstall}
                    disabled={installing}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-500/20 border border-violet-400/25 text-violet-200 text-xs font-semibold px-3 py-2 hover:bg-violet-500/30 transition-all disabled:opacity-60"
                  >
                    {installing ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-sm"
                        >
                          ⟳
                        </motion.span>
                        Đang cài...
                      </>
                    ) : (
                      <>
                        <span className="text-sm">⬇</span>
                        Cài đặt
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
