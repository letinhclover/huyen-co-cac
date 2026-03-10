// ============================================================
// FortuneCard.tsx — AI Fortune Card
// Manual trigger · Cache-first · Typewriter · Topic Buttons
// ============================================================

import { useState, useRef, useCallback } from "react";
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

// ─── Typewriter hook ──────────────────────────────────────────

function useTypewriter(text: string, speed = 28, onDone?: () => void) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef    = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const start = useCallback((t: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayed("");
    setDone(false);
    idxRef.current = 0;
    if (!t) return;
    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(t.slice(0, idxRef.current));
      if (idxRef.current >= t.length) {
        clearInterval(timerRef.current!);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);
  }, [speed]);

  return { displayed, done, start };
}

// ─── Share ────────────────────────────────────────────────────

async function captureAndShare(el: HTMLElement, filename: string) {
  const { toPng } = await import("html-to-image");
  const url  = await toPng(el, { cacheBust: true, pixelRatio: 2 });
  const a    = document.createElement("a");
  a.download = filename;
  a.href     = url;
  a.click();
}

// ─── Types ────────────────────────────────────────────────────

type CardState = "idle" | "loading" | "typing" | "done" | "error";

// ─── Component ───────────────────────────────────────────────

export function FortuneCard({ date, userProfile, onSetupProfile }: FortuneCardProps) {
  const shareRef   = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);

  const [cardState,  setCardState]  = useState<CardState>("idle");
  const [mainText,   setMainText]   = useState("");
  const [cardError,  setCardError]  = useState<GeminiError | null>(null);

  // Topic deep-dive
  const [activeTopic,  setActiveTopic]  = useState<FortuneTopic | null>(null);
  const [topicState,   setTopicState]   = useState<CardState>("idle");
  const [topicText,    setTopicText]    = useState("");
  const [topicError,   setTopicError]   = useState<GeminiError | null>(null);

  const [isSharing, setIsSharing] = useState(false);

  const dateIso     = date.toISOString().split("T")[0];
  const dateLabel   = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const jdn         = toJDN(date.getDate(), date.getMonth() + 1, date.getFullYear());
  const todayCanChi = getCanChiDay(jdn);
  const lunar       = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());

  const cacheKey = userProfile
    ? makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan")
    : null;

  // Kiểm tra cache mỗi lần render (date thay đổi → cacheKey thay đổi)
  const cachedOverview = cacheKey ? getCachedFortune(cacheKey) : null;

  // Nếu có cache mà state vẫn idle → cập nhật state
  // Dùng ref để chỉ chạy 1 lần khi cacheKey đổi
  const lastCacheKeyRef = useRef<string | null>(null);
  if (cacheKey && cacheKey !== lastCacheKeyRef.current) {
    lastCacheKeyRef.current = cacheKey;
    const c = getCachedFortune(cacheKey);
    if (c && cardState !== "done") {
      // Không dùng setState trong render body — dùng lazy init trick
      // Thực ra cần reset khi ngày đổi:
      if (mainText !== c.text) {
        setTimeout(() => {
          setMainText(c.text);
          setCardState("done");
          setActiveTopic(null);
          setTopicState("idle");
          setTopicText("");
        }, 0);
      }
    } else if (!c) {
      setTimeout(() => {
        setCardState("idle");
        setMainText("");
        setCardError(null);
        setActiveTopic(null);
        setTopicState("idle");
        setTopicText("");
        isFetching.current = false;
      }, 0);
    }
  }

  // Typewriters
  const overviewTW = useTypewriter(mainText, 28, () => setCardState("done"));
  const topicTW    = useTypewriter(topicText, 28, () => setTopicState("done"));

  // ── Gọi AI Tổng quan ──────────────────────────────────────
  const handleAskAI = useCallback(async () => {
    if (!userProfile || isFetching.current) return;

    // Check cache trước
    const key    = makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan");
    const cached = getCachedFortune(key);
    if (cached) {
      setMainText(cached.text);
      setCardState("done");
      return;
    }

    isFetching.current = true;
    setCardState("loading");
    setCardError(null);

    try {
      const result = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear,
        todayCanChi,
        dateLabel,
        "Tổng quan"
      );
      setCachedFortune(key, { ...result, cached: false });
      setMainText(result.text);
      setCardState("typing");
      overviewTW.start(result.text);
    } catch (err) {
      setCardError(err as GeminiError);
      setCardState("error");
      isFetching.current = false;
    }
  }, [userProfile, dateIso, todayCanChi, dateLabel, overviewTW]);

  // ── Topic buttons ─────────────────────────────────────────
  const handleTopicClick = useCallback(async (topic: FortuneTopic) => {
    if (!userProfile) return;
    if (topicState === "loading" || topicState === "typing") return;

    if (activeTopic === topic && topicState === "done") {
      setActiveTopic(null);
      setTopicState("idle");
      setTopicText("");
      return;
    }

    setActiveTopic(topic);

    const key    = makeCacheKey(dateIso, userProfile.birthYear, topic);
    const cached = getCachedFortune(key);
    if (cached) {
      setTopicText(cached.text);
      setTopicState("done");
      return;
    }

    setTopicState("loading");
    setTopicError(null);

    try {
      const result = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear,
        todayCanChi,
        dateLabel,
        topic
      );
      setCachedFortune(key, { ...result, cached: false });
      setTopicText(result.text);
      setTopicState("typing");
      topicTW.start(result.text);
    } catch (err) {
      setTopicError(err as GeminiError);
      setTopicState("error");
    }
  }, [userProfile, activeTopic, topicState, dateIso, todayCanChi, dateLabel, topicTW]);

  // ── Share ─────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!shareRef.current || isSharing) return;
    setIsSharing(true);
    try { await captureAndShare(shareRef.current, `huyen-co-cac-${dateIso}.png`); }
    catch { /* ignore */ }
    finally { setIsSharing(false); }
  }, [dateIso, isSharing]);

  // ── No profile ────────────────────────────────────────────
  if (!userProfile) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-4 my-2">
        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">🤖</div>
          <p className="text-white/75 text-sm font-medium">AI chưa biết bạn là ai</p>
          <p className="text-white/35 text-xs leading-relaxed">Thiết lập bản mệnh để nhận luận giải cá nhân hóa</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onSetupProfile}
            className="rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-medium px-5 py-2">
            Thiết lập ngay →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const isDone = cardState === "done";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-4 my-2">

      <div ref={shareRef} className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#0D0A1F] via-[#0B0F1A] to-[#0A0D1E] overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">✨</div>
            <div>
              <p className="text-[10px] text-violet-400/60 tracking-widest uppercase">AI Gemini · Luận Giải</p>
              <p className="text-white/50 text-xs">{dateLabel} · {lunar.canChiYear}</p>
            </div>
          </div>
          <AnimatePresence>
            {isDone && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[9px] text-white/20 border border-white/8 rounded-full px-2 py-0.5">
                {cachedOverview ? "Cache" : "Đã lưu"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Body */}
        <div className="px-5 py-5 min-h-20">
          <p className="text-[10px] text-violet-400/40 tracking-widest uppercase mb-3">🌟 Tổng Quan Ngày</p>

          <AnimatePresence mode="wait">

            {/* IDLE — nút bấm */}
            {cardState === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-3 py-2">
                <p className="text-white/30 text-xs text-center">
                  Can Chi hôm nay: <span className="text-amber-400/60">{todayCanChi}</span>
                  {" · "}Tuổi: <span className="text-amber-400/60">{userProfile.canChiYear}</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAskAI}
                  className="flex items-center gap-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-200 text-sm font-medium px-6 py-2.5 transition-all"
                >
                  <span>✨</span> Bấm để AI luận giải hôm nay
                </motion.button>
              </motion.div>
            )}

            {/* LOADING */}
            {cardState === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4">
                <Spinner />
                <p className="text-violet-300/50 text-xs tracking-widest">Đang kết nối vũ trụ...</p>
              </motion.div>
            )}

            {/* TYPING */}
            {cardState === "typing" && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-white/75 text-sm leading-relaxed">
                  {overviewTW.displayed}
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.55, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-violet-400/70 ml-0.5 align-middle rounded-full" />
                </p>
              </motion.div>
            )}

            {/* DONE */}
            {cardState === "done" && mainText && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-white/75 text-sm leading-relaxed">{mainText}</p>

                {/* Topic buttons */}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-white/20 tracking-widest uppercase mb-2">Hỏi sâu hơn →</p>
                  <div className="flex gap-2">
                    {FORTUNE_TOPICS.filter(t => t.id !== "Tổng quan").map(t => {
                      const isActive  = activeTopic === t.id;
                      const isBusy    = isActive && (topicState === "loading" || topicState === "typing");
                      return (
                        <motion.button key={t.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                          onClick={() => handleTopicClick(t.id)}
                          className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all flex-1 justify-center ${
                            isActive
                              ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                              : "border-white/8 bg-white/4 text-white/40 hover:border-violet-400/20 hover:text-violet-300/70"
                          }`}>
                          {isBusy
                            ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
                            : <span>{t.emoji}</span>
                          }
                          {t.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic result */}
                <AnimatePresence>
                  {activeTopic && topicState !== "idle" && (
                    <motion.div key={activeTopic}
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="rounded-xl border border-violet-500/10 bg-violet-900/10 px-4 py-3">
                        <p className="text-[10px] text-violet-400/50 tracking-widest uppercase mb-2">
                          {FORTUNE_TOPICS.find(t => t.id === activeTopic)?.emoji} {activeTopic}
                        </p>
                        <AnimatePresence mode="wait">
                          {topicState === "loading" && (
                            <motion.div key="tl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2">
                              <Spinner small /><p className="text-violet-300/50 text-xs">Đang thỉnh thiên cơ...</p>
                            </motion.div>
                          )}
                          {(topicState === "typing" || topicState === "done") && topicText && (
                            <motion.div key="tt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <p className="text-white/70 text-sm leading-relaxed">
                                {topicState === "typing" ? topicTW.displayed : topicText}
                                {topicState === "typing" && !topicTW.done && (
                                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.55, repeat: Infinity }}
                                    className="inline-block w-0.5 h-4 bg-violet-400/70 ml-0.5 align-middle rounded-full" />
                                )}
                              </p>
                            </motion.div>
                          )}
                          {topicState === "error" && topicError && (
                            <motion.div key="te" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <ErrorBlock error={topicError} onRetry={() => activeTopic && handleTopicClick(activeTopic)} small />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Retry row */}
                <div className="flex justify-end pt-1 border-t border-white/5">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (cacheKey) { try { localStorage.removeItem(cacheKey); } catch { /**/ } }
                      isFetching.current = false;
                      setCardState("idle");
                      setMainText("");
                      setActiveTopic(null);
                      setTopicState("idle");
                      setTopicText("");
                    }}
                    className="text-white/20 text-[10px] hover:text-violet-400/50 transition-colors flex items-center gap-1">
                    ↻ Luận giải lại
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ERROR */}
            {cardState === "error" && cardError && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ErrorBlock error={cardError} onRetry={() => { isFetching.current = false; handleAskAI(); }} />
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
        {isDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-2 flex justify-end px-1">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={handleShare} disabled={isSharing}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 text-white/35 text-xs px-4 py-2 hover:border-amber-400/20 hover:text-amber-300/60 transition-all disabled:opacity-40">
              {isSharing
                ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span> Đang tạo...</>
                : <><span>📤</span> Tải ảnh chia sẻ Story</>
              }
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────

function Spinner({ small }: { small?: boolean }) {
  return (
    <div className={`relative flex-shrink-0 ${small ? "w-5 h-5" : "w-8 h-8"}`}>
      <motion.div className="absolute inset-0 rounded-full border-2 border-violet-500/15"
        animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        style={{ borderTopColor: "rgba(167,139,250,0.65)" }} />
    </div>
  );
}

// ─── Error Block ──────────────────────────────────────────────

function ErrorBlock({ error, onRetry, small }: { error: GeminiError; onRetry: () => void; small?: boolean }) {
  const ICONS: Record<string, string> = { no_api_key: "🔑", network: "📡", rate_limit: "⏳", unknown: "😅" };
  return (
    <div className={`flex flex-col gap-2 ${small ? "" : "py-1"}`}>
      <div className="flex items-start gap-2">
        <span className={small ? "text-base" : "text-xl"}>{ICONS[error.type] ?? "😅"}</span>
        <p className={`text-white/45 leading-relaxed ${small ? "text-xs" : "text-sm"}`}>{error.message}</p>
      </div>
      {error.type !== "no_api_key" && (
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
          className="self-start rounded-lg border border-white/10 bg-white/5 text-white/40 text-xs px-3 py-1.5 hover:border-violet-400/30 hover:text-violet-300 transition-all">
          Thử lại
        </motion.button>
      )}
    </div>
  );
}
