// ============================================================
// PWAInstallPrompt.tsx — iOS + Android Install Banner
// iOS: hướng dẫn thủ công (Safari không có beforeinstallprompt)
// Android: dùng beforeinstallprompt API
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as {MSStream?:unknown}).MSStream;
}
function isSafari() {
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
         (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid,    setShowAndroid]    = useState(false);
  const [showIOS,        setShowIOS]        = useState(false);
  const [installed,      setInstalled]      = useState(false);

  useEffect(() => {
    // Already installed or dismissed
    if (isStandalone()) return;
    const dismissed = localStorage.getItem("hcc_pwa_dismissed_v2");
    if (dismissed && Date.now() - parseInt(dismissed) < 7*24*60*60*1000) return; // 7 ngày

    if (isIOS() && isSafari()) {
      // Hiện banner iOS sau 3 giây
      setTimeout(() => setShowIOS(true), 3000);
    } else {
      // Android / Chrome
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowAndroid(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setShowAndroid(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowAndroid(false);
    setShowIOS(false);
    try { localStorage.setItem("hcc_pwa_dismissed_v2", Date.now().toString()); } catch {}
  }, []);

  const isVisible = (showAndroid || showIOS) && !installed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 200 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
          <div className="card p-4" style={{ boxShadow:"var(--shadow-float)" }}>
            {showAndroid && (
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)" }}>
                  📲
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text-primary)" }}>
                    Cài về màn hình chính
                  </p>
                  <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>
                    Dùng nhanh hơn, không cần mạng, không quảng cáo
                  </p>
                  <div className="flex gap-2">
                    <button onClick={handleDismiss}
                      className="btn-ghost text-xs px-3 py-2 rounded-xl flex-1">
                      Bỏ qua
                    </button>
                    <motion.button whileTap={{ scale:0.97 }} onClick={handleInstall}
                      className="btn-gold text-xs px-4 py-2 rounded-xl flex-1 font-bold">
                      Cài Đặt Ngay ›
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {showIOS && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📲</span>
                    <p className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>
                      Cài Lịch Vạn Niên AI
                    </p>
                  </div>
                  <button onClick={handleDismiss} className="text-lg" style={{ color:"var(--text-faint)" }}>✕</button>
                </div>
                <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>
                  Dùng không cần mạng, không quảng cáo, trải nghiệm mượt hơn
                </p>
                {/* iOS instructions */}
                <div className="rounded-xl p-3 flex flex-col gap-2"
                  style={{ background:"var(--bg-elevated)", border:"1px solid var(--border-subtle)" }}>
                  <p className="text-[11px] font-semibold" style={{ color:"var(--text-secondary)" }}>
                    Cách cài trên iPhone / iPad:
                  </p>
                  {[
                    { step:"1", text:'Bấm vào nút Chia sẻ', icon:"⬆️", note:"(dưới cùng của Safari)" },
                    { step:"2", text:'Chọn "Thêm vào Màn Hình Chính"', icon:"➕", note:"(cuộn xuống tìm trong danh sách)" },
                    { step:"3", text:"Bấm Thêm ở góc phải trên", icon:"✅", note:"(góc phải trên cùng)" },
                  ].map(({ step, text, icon, note }) => (
                    <div key={step} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                        style={{ background:"var(--gold-bg)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>
                        {step}
                      </div>
                      <div>
                        <span className="text-xs font-medium" style={{ color:"var(--text-primary)" }}>
                          {icon} {text}
                        </span>
                        <span className="text-[10px] block" style={{ color:"var(--text-muted)" }}>{note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
