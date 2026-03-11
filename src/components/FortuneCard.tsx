// ============================================================
// FortuneCard.tsx — Minimal, no useEffect, no auto-call
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateDailyFortune,
  getCachedFortune,
  setCachedFortune,
  makeCacheKey,
  FORTUNE_TOPICS,
  type GeminiError,
  type FortuneTopic,
} from "../utils/gemini";
import { UserProfile, solarToLunar, getCanChiDay, toJDN } from "../utils/astrology";

interface FortuneCardProps {
  date: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

// ─── Typewriter ───────────────────────────────────────────────

function Typewriter({ text, speed = 28, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  const [done,  setDone]  = useState(false);
  const ref = useRef({ idx: 0, timer: 0 as ReturnType<typeof setInterval> });

  useEffect(() => {
    clearInterval(ref.current.timer);
    ref.current.idx = 0;
    setShown("");
    setDone(false);
    if (!text) return;
    ref.current.timer = setInterval(() => {
      ref.current.idx += 1;
      setShown(text.slice(0, ref.current.idx));
      if (ref.current.idx >= text.length) {
        clearInterval(ref.current.timer);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(ref.current.timer);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <p className="text-sm leading-relaxed">
      {shown}
      {!done && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-violet-400/70 ml-0.5 align-middle rounded-full" />
      )}
    </p>
  );
}

// ─── Spinner ──────────────────────────────────────────────────

function Spinner({ small }: { small?: boolean }) {
  return (
    <div className={`relative flex-shrink-0 ${small ? "w-5 h-5" : "w-8 h-8"}`}>
      <motion.div className="absolute inset-0 rounded-full border-2 border-violet-400/15"
        animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        style={{ borderTopColor: "rgba(167,139,250,0.7)" }} />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────

export function FortuneCard({ date, userProfile, onSetupProfile }: FortuneCardProps) {
  // ── Derived values (không đổi trong 1 render cycle) ─────────
  const dateIso     = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  const dateLabel   = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  const jdn         = toJDN(date.getDate(), date.getMonth()+1, date.getFullYear());
  const todayCanChi = getCanChiDay(jdn);
  const lunar       = solarToLunar(date.getDate(), date.getMonth()+1, date.getFullYear());

  // ── State ────────────────────────────────────────────────────
  type S = "idle" | "loading" | "typing" | "done" | "error";
  const [ov,      setOv]      = useState<{ s: S; text: string; err: GeminiError | null }>({ s: "idle", text: "", err: null });
  const [topic,   setTopic]   = useState<FortuneTopic | null>(null);
  const [tp,      setTp]      = useState<{ s: S; text: string; err: GeminiError | null }>({ s: "idle", text: "", err: null });
  const [sharing, setSharing] = useState(false);
  const shareRef  = useRef<HTMLDivElement>(null);

  // Single ref guard — chắc chắn không gọi 2 lần
  const calling = useRef(false);

  // ── Reset khi đổi ngày ──────────────────────────────────────
  const prevDateRef = useRef(dateIso);
  if (prevDateRef.current !== dateIso) {
    prevDateRef.current = dateIso;
    calling.current     = false;
    // Reset state synchronously (safe vì là trong render guard)
    if (ov.s !== "idle") {
      setTimeout(() => {
        setOv({ s: "idle", text: "", err: null });
        setTopic(null);
        setTp({ s: "idle", text: "", err: null });
      }, 0);
    }
  }

  // Check cache khi có profile
  const cacheKey      = userProfile ? makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan") : "";
  const cachedOverview = cacheKey ? getCachedFortune(cacheKey) : null;

  // Nếu cache có nhưng state chưa cập nhật
  useEffect(() => {
    if (!cachedOverview) return;
    if (ov.s === "idle" || ov.s === "error") {
      setOv({ s: "done", text: cachedOverview.text, err: null });
    }
  }, [cacheKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gọi AI ──────────────────────────────────────────────────
  const callAI = useCallback(async () => {
    if (!userProfile || calling.current) return;

    const key    = makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan");
    const cached = getCachedFortune(key);
    if (cached) { setOv({ s: "done", text: cached.text, err: null }); return; }

    calling.current = true;
    setOv({ s: "loading", text: "", err: null });

    try {
      const r = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear,
        todayCanChi,
        dateLabel,
        "Tổng quan"
      );
      setCachedFortune(key, { ...r, cached: false });
      setOv({ s: "typing", text: r.text, err: null });
    } catch (e) {
      calling.current = false; // Cho phép retry
      setOv({ s: "error", text: "", err: e as GeminiError });
    }
  }, [userProfile, dateIso, todayCanChi, dateLabel]);

  // ── Topic ────────────────────────────────────────────────────
  const callTopic = useCallback(async (t: FortuneTopic) => {
    if (!userProfile) return;
    if (tp.s === "loading" || tp.s === "typing") return;

    // Toggle off
    if (topic === t && tp.s === "done") {
      setTopic(null); setTp({ s: "idle", text: "", err: null }); return;
    }
    setTopic(t);

    const key    = makeCacheKey(dateIso, userProfile.birthYear, t);
    const cached = getCachedFortune(key);
    if (cached) { setTp({ s: "done", text: cached.text, err: null }); return; }

    setTp({ s: "loading", text: "", err: null });
    try {
      const r = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear,
        todayCanChi,
        dateLabel,
        t
      );
      setCachedFortune(key, { ...r, cached: false });
      setTp({ s: "typing", text: r.text, err: null });
    } catch (e) {
      setTp({ s: "error", text: "", err: e as GeminiError });
    }
  }, [userProfile, topic, tp.s, dateIso, todayCanChi, dateLabel]);

  // ── Share ────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!shareRef.current || sharing) return;
    setSharing(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(shareRef.current, { pixelRatio: 2 });
      Object.assign(document.createElement("a"), { download: `hcc-${dateIso}.png`, href: url }).click();
    } catch { /* ignore */ }
    finally { setSharing(false); }
  }, [dateIso, sharing]);

  // ─────────────────────────────────────────────────────────────

  if (!userProfile) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 my-2">
        <div className="rounded-2xl border style={{ borderColor:"var(--border-subtle)" }} bg-transparent px-5 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">🤖</div>
          <p className="text-white/70 text-sm font-medium">AI chưa biết bạn là ai</p>
          <p className="text-white/30 text-xs leading-relaxed">Thiết lập bản mệnh để nhận luận giải cá nhân hóa</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onSetupProfile}
            className="rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs px-5 py-2">
            Thiết lập ngay →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const ovDone = ov.s === "done";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-4 my-2">
      <div ref={shareRef} className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#0D0A1F] via-[#0B0F1A] to-[#0A0D1E] overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center gap-2.5 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">✨</div>
          <div className="flex-1">
            <p className="text-[10px] text-violet-400/55 tracking-widest uppercase">AI Gemini · Luận Giải</p>
            <p className="text-white/45 text-xs">{dateLabel} · {lunar.canChiYear}</p>
          </div>
          {ovDone && <span className="text-[9px] text-white/18 border style={{ borderColor:"var(--border-subtle)" }} rounded-full px-2 py-0.5">{cachedOverview ? "Cache" : "Đã lưu"}</span>}
        </div>

        {/* Tổng quan */}
        <div className="px-5 py-5">
          <p className="text-[10px] text-violet-400/40 tracking-widest uppercase mb-3">🌟 Tổng Quan Ngày</p>

          <AnimatePresence mode="wait">
            {ov.s === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-2">
                <p className="text-white/25 text-xs text-center">
                  Can Chi: <span className="text-amber-400/55">{todayCanChi}</span>
                  {" · "}Tuổi: <span className="text-amber-400/55">{userProfile.canChiYear}</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={callAI}
                  className="flex items-center gap-2 rounded-xl bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-medium px-6 py-2.5 hover:bg-violet-500/28 transition-all"
                >
                  ✨ Bấm để AI luận giải hôm nay
                </motion.button>
              </motion.div>
            )}

            {ov.s === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4">
                <Spinner />
                <p className="text-violet-300/45 text-xs tracking-widest">Đang kết nối vũ trụ...</p>
              </motion.div>
            )}

            {ov.s === "typing" && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typewriter text={ov.text} onDone={() => setOv(p => ({ ...p, s: "done" }))} />
              </motion.div>
            )}

            {ov.s === "done" && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed">{ov.text}</p>

                {/* Topic buttons */}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] text-white/18 tracking-widest uppercase mb-2">Hỏi sâu hơn →</p>
                  <div className="flex gap-2">
                    {FORTUNE_TOPICS.filter(f => f.id !== "Tổng quan").map(f => {
                      const active = topic === f.id;
                      const busy   = active && (tp.s === "loading" || tp.s === "typing");
                      return (
                        <motion.button key={f.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.91 }}
                          onClick={() => callTopic(f.id)}
                          className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all flex-1 justify-center ${
                            active ? "border-violet-400/40 bg-violet-500/18 text-violet-200"
                                   : "style={{ borderColor:"var(--border-subtle)" }} bg-transparent text-white/38 hover:text-violet-300/65 hover:border-violet-400/20"
                          }`}>
                          {busy
                            ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
                            : <span>{f.emoji}</span>}
                          {f.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic result */}
                <AnimatePresence>
                  {topic && tp.s !== "idle" && (
                    <motion.div key={topic} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="rounded-xl border border-violet-500/10 bg-violet-900/8 px-4 py-3">
                        <p className="text-[10px] text-violet-400/45 tracking-widest uppercase mb-2">
                          {FORTUNE_TOPICS.find(f => f.id === topic)?.emoji} {topic}
                        </p>
                        <AnimatePresence mode="wait">
                          {tp.s === "loading" && (
                            <motion.div key="tl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2">
                              <Spinner small /><p className="text-violet-300/45 text-xs">Đang thỉnh thiên cơ...</p>
                            </motion.div>
                          )}
                          {(tp.s === "typing" || tp.s === "done") && tp.text && (
                            <motion.div key="tt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              {tp.s === "typing"
                                ? <Typewriter text={tp.text} onDone={() => setTp(p => ({ ...p, s: "done" }))} />
                                : <p className="text-white/70 text-sm leading-relaxed">{tp.text}</p>}
                            </motion.div>
                          )}
                          {tp.s === "error" && tp.err && (
                            <motion.div key="te" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <p className="text-white/40 text-xs mb-1">{tp.err.message}</p>
                              {tp.err.debug && (
                                <p className="text-white/20 text-[10px] font-mono break-all">{tp.err.debug}</p>
                              )}
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => topic && callTopic(topic)}
                                className="mt-2 text-violet-400/50 text-xs border border-violet-400/15 rounded-lg px-3 py-1">Thử lại</motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Retry */}
                <div className="flex justify-end pt-1 border-t border-white/5">
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (cacheKey) try { localStorage.removeItem(cacheKey); } catch { /**/ }
                      calling.current = false;
                      setOv({ s: "idle", text: "", err: null });
                      setTopic(null); setTp({ s: "idle", text: "", err: null });
                    }}
                    className="text-white/18 text-[10px] hover:text-violet-400/45 transition-colors flex items-center gap-1">
                    ↻ Luận giải lại
                  </motion.button>
                </div>
              </motion.div>
            )}

            {ov.s === "error" && ov.err && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{ov.err.type === "rate_limit" ? "⏳" : ov.err.type === "network" ? "📡" : ov.err.type === "no_api_key" ? "🔑" : "😅"}</span>
                  <p className="text-white/50 text-sm leading-relaxed">{ov.err.message}</p>
                </div>
                {/* Debug info — hiện để dễ troubleshoot */}
                {ov.err.debug && (
                  <div className="rounded-lg bg-black/30 border style={{ borderColor:"var(--border-subtle)" }} px-3 py-2">
                    <p className="text-white/25 text-[10px] font-mono break-all leading-relaxed">{ov.err.debug}</p>
                  </div>
                )}
                {ov.err.type !== "no_api_key" && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { calling.current = false; callAI(); }}
                    className="self-start rounded-lg border border-white/10 bg-white/5 text-white/40 text-xs px-4 py-2 hover:border-violet-400/30 hover:text-violet-300 transition-all">
                    Thử lại
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Watermark */}
        <div className="px-5 pb-3 flex justify-between">
          <p className="text-white/10 text-[10px]">🔮 huyen-co-cac.pages.dev</p>
          <p className="text-white/10 text-[10px]">{dateLabel}</p>
        </div>
      </div>

      {/* Share button */}
      <AnimatePresence>
        {ovDone && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mt-2 flex justify-end px-1">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={handleShare} disabled={sharing}
              className="flex items-center gap-2 rounded-xl border style={{ borderColor:"var(--border-subtle)" }} bg-transparent text-white/30 text-xs px-4 py-2 hover:border-amber-400/18 hover:text-amber-300/55 transition-all disabled:opacity-40">
              {sharing
                ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span> Đang tạo...</>
                : <><span>📤</span> Tải ảnh chia sẻ Story</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
