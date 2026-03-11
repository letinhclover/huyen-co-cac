// ============================================================
// PWAInstallPrompt.tsx — Design System v5
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallPrompt() {
  const [prompt,  setPrompt]  = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed   = localStorage.getItem("hcc_pwa_dismissed");
    if (isInstalled || dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setDone(true);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    try { localStorage.setItem("hcc_pwa_dismissed", "1"); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {visible && !done && (
        <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }}
          exit={{ y:80, opacity:0 }} transition={{ type:"spring", damping:24, stiffness:200 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-40">
          <div className="card p-4 flex items-center gap-3" style={{ boxShadow:"var(--shadow-float)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)" }}>
              📲
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                Cài về màn hình chính
              </p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                Truy cập nhanh, không cần mạng
              </p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={handleDismiss} className="text-xs px-2.5 py-1.5 rounded-lg"
                style={{ background:"var(--bg-elevated)", color:"var(--text-muted)", border:"1px solid var(--border-subtle)" }}>
                Bỏ
              </button>
              <button onClick={handleInstall} className="btn-gold text-xs px-3 py-1.5 rounded-lg">
                Cài
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
