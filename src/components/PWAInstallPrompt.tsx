// ============================================================
// PWAInstallPrompt.tsx — Banner Cài Đặt PWA Nổi Bật
// iOS: hướng dẫn thủ công (Safari không có beforeinstallprompt)
// Android: dùng beforeinstallprompt API
// Hiện ngay khi vào lần đầu, không delay lâu
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
  return /Safari/.test(navigator.userAgent) && !/CriOS|Chrome|FxiOS/.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

const DISMISS_KEY = "hcc_pwa_dismissed_v3";
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 ngày

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"android"|"ios"|null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) return; // Đã cài rồi
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < COOLDOWN_MS) return;

    if (isIOS() && isSafari()) {
      setPlatform("ios");
      setTimeout(() => setShow(true), 1800);
    } else {
      // Android/Chrome: chờ beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setPlatform("android");
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  // Listen for successful install
  useEffect(() => {
    const handler = () => { setInstalled(true); setShow(false); };
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") { setInstalled(true); setShow(false); }
    else dismiss();
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setShow(false);
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch {}
  }, []);

  return (
    <AnimatePresence>
      {show && !installed && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { type:"spring", damping:22, stiffness:200 } }}
          exit={{ y: 120, opacity: 0, transition: { duration: 0.22 } }}
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-sm z-50"
        >
          <div className="rounded-3xl overflow-hidden"
            style={{ boxShadow:"0 20px 60px rgba(0,0,0,0.5), 0 0 0 1.5px var(--gold-border)" }}>
            {/* Gold top stripe */}
            <div className="h-1" style={{ background:"linear-gradient(90deg,var(--gold),var(--gold-light))" }}/>
            <div className="px-4 py-4" style={{ background:"var(--bg-elevated)" }}>

              {/* Android */}
              {platform === "android" && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    {/* App icon */}
                    <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0"
                      style={{ border:"1.5px solid var(--gold-border)" }}>
                      <img src="/pwa-192x192.png" alt="icon" className="w-full h-full"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>
                        Cài Lịch Vạn Niên AI
                      </p>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                        Dùng nhanh hơn · offline · không quảng cáo
                      </p>
                    </div>
                    <button onClick={dismiss}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background:"var(--bg-surface)", color:"var(--text-faint)" }}>✕</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={dismiss}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-semibold"
                      style={{ background:"var(--bg-surface)", color:"var(--text-muted)" }}>
                      Để sau
                    </button>
                    <motion.button whileTap={{ scale:0.96 }} onClick={handleInstall}
                      className="flex-[2] py-2.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                      style={{ background:"linear-gradient(135deg,#B8720A,#D4920D)" }}>
                      <span className="text-base">📲</span> Cài đặt ngay
                    </motion.button>
                  </div>
                </>
              )}

              {/* iOS */}
              {platform === "ios" && (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0"
                        style={{ border:"1.5px solid var(--gold-border)" }}>
                        <img src="/apple-touch-icon.png" alt="icon" className="w-full h-full"/>
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>
                          Thêm vào màn hình chính
                        </p>
                        <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                          Dùng như app thật, không cần mạng
                        </p>
                      </div>
                    </div>
                    <button onClick={dismiss}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      style={{ background:"var(--bg-surface)", color:"var(--text-faint)" }}>✕</button>
                  </div>
                  <div className="rounded-2xl px-3 py-3 text-sm space-y-2"
                    style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">1️⃣</span>
                      <p style={{ color:"var(--text-secondary)" }}>
                        Nhấn nút <strong style={{ color:"var(--text-primary)" }}>Chia sẻ</strong> <span className="text-base">⬆️</span> ở thanh Safari
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">2️⃣</span>
                      <p style={{ color:"var(--text-secondary)" }}>
                        Chọn <strong style={{ color:"var(--text-primary)" }}>Thêm vào màn hình chính</strong> <span className="text-base">➕</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">3️⃣</span>
                      <p style={{ color:"var(--text-secondary)" }}>
                        Nhấn <strong style={{ color:"var(--gold)" }}>Thêm</strong> để hoàn tất
                      </p>
                    </div>
                  </div>
                  <button onClick={dismiss}
                    className="w-full mt-2 py-2.5 rounded-2xl text-sm font-semibold"
                    style={{ background:"var(--bg-surface)", color:"var(--text-muted)" }}>
                    Đóng
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
