// ============================================================
// FortuneCard.tsx — AI Fortune Card
// Auto-load · Typewriter · Topic Buttons · Viral Share
// Fix: fetchGuard chống React StrictMode gọi API 2 lần → 429
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
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

// ─── Props ────────────────────────────────────────────────────

interface FortuneCardProps {
  date: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

// ─── Typewriter hook ──────────────────────────────────────────

function useTypewriter(text: string, speed = 30, onDone?: () => void) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef   = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayed("");
    setDone(false);
    idxRef.current = 0;

    if (!text) return;

    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(timerRef.current!);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [text, speed]);

  return { displayed, done };
}

// ─── Share helper ─────────────────────────────────────────────

async function captureAndShare(el: HTMLElement, filename: string): Promise<void> {
  const { toPng } = await import("html-to-image");
  const dataUrl   = await toPng(el, { cacheBust: true, pixelRatio: 2 });
  const link      = document.createElement("a");
  link.download   = filename;
  link.href       = dataUrl;
  link.click();
}

// ─── Types ────────────────────────────────────────────────────

type LoadState = "idle" | "loading" | "typing" | "done" | "error";

interface TopicState {
  loadState: LoadState;
  text: string;
  error: GeminiError | null;
}

const EMPTY: TopicState = { loadState: "idle", text: "", error: null };

// ─── Main Component ───────────────────────────────────────────

export function FortuneCard({ date, userProfile, onSetupProfile }: FortuneCardProps) {
  const shareRef = useRef<HTMLDivElement>(null);

  // ⚡ KEY FIX: ref lưu fetchId đang chạy — chống gọi API 2 lần
  // React StrictMode mount → unmount → mount lại trong <1ms,
  // ref tồn tại xuyên suốt nên chặn được lần gọi thứ 2.
  const activeFetchRef = useRef<string>("");

  const [overviewState, setOverviewState] = useState<TopicState>(EMPTY);
  const [activeTopic,   setActiveTopic]   = useState<FortuneTopic | null>(null);
  const [topicState,    setTopicState]    = useState<TopicState>(EMPTY);
  const [isSharing,     setIsSharing]     = useState(false);

  const dateIso     = date.toISOString().split("T")[0];
  const dateLabel   = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const jdn         = toJDN(date.getDate(), date.getMonth() + 1, date.getFullYear());
  const todayCanChi = getCanChiDay(jdn);
  const lunar       = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());

  // ── Auto-load Tổng quan khi date/profile thay đổi ────────────
  useEffect(() => {
    setActiveTopic(null);
    setTopicState(EMPTY);

    if (!userProfile) {
      setOverviewState(EMPTY);
      activeFetchRef.current = "";
      return;
    }

    const cacheKey = makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan");
    const cached   = getCachedFortune(cacheKey);

    if (cached) {
      setOverviewState({ loadState: "done", text: cached.text, error: null });
      return;
    }

    // Tạo fetchId duy nhất cho request này
    const fetchId = `overview_${dateIso}_${userProfile.birthYear}`;

    // Nếu request này đã đang chạy → bỏ qua (React StrictMode protection)
    if (activeFetchRef.current === fetchId) return;
    activeFetchRef.current = fetchId;

    setOverviewState({ loadState: "loading", text: "", error: null });

    generateDailyFortune(
      String(userProfile.birthYear),
      `${userProfile.elementName} (${userProfile.destinyName})`,
      userProfile.canChiYear,
      todayCanChi,
      dateLabel,
      "Tổng quan"
    )
      .then((result) => {
        // Chỉ xử lý nếu fetchId vẫn là request hiện tại
        if (activeFetchRef.current !== fetchId) return;
        // Lưu cache NGAY để request tiếp theo (nếu có) dùng cache
        setCachedFortune(cacheKey, { ...result, cached: false });
        setOverviewState({ loadState: "typing", text: result.text, error: null });
      })
      .catch((err: GeminiError) => {
        if (activeFetchRef.current !== fetchId) return;
        activeFetchRef.current = ""; // Reset để có thể retry
        setOverviewState({ loadState: "error", text: "", error: err });
      });

  }, [dateIso, userProfile?.birthYear]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Retry overview ──────────────────────────────────────────
  const handleRetryOverview = useCallback(() => {
    if (!userProfile) return;
    // Xoá cache key để force re-fetch
    activeFetchRef.current = "";
    const cacheKey = makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan");
    try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }

    setOverviewState({ loadState: "loading", text: "", error: null });

    const fetchId = `overview_retry_${dateIso}_${Date.now()}`;
    activeFetchRef.current = fetchId;

    generateDailyFortune(
      String(userProfile.birthYear),
      `${userProfile.elementName} (${userProfile.destinyName})`,
      userProfile.canChiYear,
      todayCanChi,
      dateLabel,
      "Tổng quan"
    )
      .then((result) => {
        if (activeFetchRef.current !== fetchId) return;
        setCachedFortune(cacheKey, { ...result, cached: false });
        setOverviewState({ loadState: "typing", text: result.text, error: null });
      })
      .catch((err: GeminiError) => {
        if (activeFetchRef.current !== fetchId) return;
        activeFetchRef.current = "";
        setOverviewState({ loadState: "error", text: "", error: err });
      });
  }, [userProfile, dateIso, todayCanChi, dateLabel]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Topic buttons ───────────────────────────────────────────
  const handleTopicClick = useCallback(async (topic: FortuneTopic) => {
    if (!userProfile) return;
    if (topicState.loadState === "loading" || topicState.loadState === "typing") return;

    if (activeTopic === topic && topicState.loadState === "done") {
      setActiveTopic(null);
      setTopicState(EMPTY);
      return;
    }

    setActiveTopic(topic);

    const cacheKey = makeCacheKey(dateIso, userProfile.birthYear, topic);
    const cached   = getCachedFortune(cacheKey);
    if (cached) {
      setTopicState({ loadState: "done", text: cached.text, error: null });
      return;
    }

    setTopicState({ loadState: "loading", text: "", error: null });
    try {
      const result = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear,
        todayCanChi,
        dateLabel,
        topic
      );
      setCachedFortune(cacheKey, { ...result, cached: false });
      setTopicState({ loadState: "typing", text: result.text, error: null });
    } catch (err) {
      setTopicState({ loadState: "error", text: "", error: err as GeminiError });
    }
  }, [userProfile, activeTopic, topicState.loadState, dateIso, todayCanChi, dateLabel]);

  const handleTopicTypingDone = useCallback(() => {
    setTopicState((prev) => ({ ...prev, loadState: "done" }));
  }, []);

  const handleOverviewTypingDone = useCallback(() => {
    setOverviewState((prev) => ({ ...prev, loadState: "done" }));
  }, []);

  // ── Share ───────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!shareRef.current || isSharing) return;
    setIsSharing(true);
    try {
      await captureAndShare(shareRef.current, `huyen-co-cac-${dateIso}.png`);
    } catch { /* ignore */ }
    finally { setIsSharing(false); }
  }, [dateIso, isSharing]);

  const overviewDone    = overviewState.loadState === "done";
  const showTopicButtons = overviewDone;

  // ── No profile ──────────────────────────────────────────────
  if (!userProfile) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-4 my-2">
        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">🤖</div>
          <div>
            <p className="text-white/75 text-sm font-medium mb-1">AI chưa biết bạn là ai</p>
            <p className="text-white/35 text-xs leading-relaxed">Thiết lập bản mệnh để nhận luận giải cá nhân hóa mỗi ngày</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onSetupProfile}
            className="rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-medium px-5 py-2">
            Thiết lập ngay →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-4 my-2">

      {/* ── Vùng chụp ảnh share ── */}
      <div ref={shareRef}
        className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#0D0A1F] via-[#0B0F1A] to-[#0A0D1E] overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-base">✨</div>
            <div>
              <p className="text-[10px] text-violet-400/60 tracking-widest uppercase">AI Gemini · Luận Giải</p>
              <p className="text-white/55 text-xs">{dateLabel} · {lunar.canChiYear}</p>
            </div>
          </div>
          <AnimatePresence>
            {overviewDone && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[9px] text-white/20 border border-white/8 rounded-full px-2 py-0.5">
                Đã lưu hôm nay
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Tổng quan */}
        <div className="px-5 py-4">
          <p className="text-[10px] text-violet-400/40 tracking-widest uppercase mb-2">🌟 Tổng Quan Ngày</p>

          <AnimatePresence mode="wait">
            {overviewState.loadState === "loading" && (
              <motion.div key="ov-load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 py-3">
                <SpinnerIcon />
                <p className="text-violet-300/50 text-xs tracking-widest">Đang kết nối vũ trụ...</p>
              </motion.div>
            )}
            {(overviewState.loadState === "typing" || overviewState.loadState === "done") && overviewState.text && (
              <motion.div key="ov-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TypewriterBlock text={overviewState.text} isTyping={overviewState.loadState === "typing"}
                  speed={30} onDone={handleOverviewTypingDone} />
              </motion.div>
            )}
            {overviewState.loadState === "error" && overviewState.error && (
              <motion.div key="ov-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ErrorBlock error={overviewState.error} onRetry={handleRetryOverview} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Topic buttons */}
        <AnimatePresence>
          {showTopicButtons && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="px-5 pb-4">
              <p className="text-[10px] text-white/20 tracking-widest uppercase mb-2.5">Hỏi sâu hơn →</p>
              <div className="flex gap-2">
                {FORTUNE_TOPICS.filter((t) => t.id !== "Tổng quan").map((t) => {
                  const isActive  = activeTopic === t.id;
                  const isLoading = isActive && (topicState.loadState === "loading" || topicState.loadState === "typing");
                  return (
                    <motion.button key={t.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                      onClick={() => handleTopicClick(t.id)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all flex-1 justify-center ${
                        isActive
                          ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                          : "border-white/8 bg-white/4 text-white/45 hover:border-violet-400/20 hover:text-violet-300/70"
                      }`}>
                      {isLoading
                        ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-base">⟳</motion.span>
                        : <span className="text-base">{t.emoji}</span>
                      }
                      {t.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topic result */}
        <AnimatePresence>
          {activeTopic && topicState.loadState !== "idle" && (
            <motion.div key={activeTopic}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mx-5 mb-5 rounded-xl border border-violet-500/10 bg-violet-900/10 px-4 py-3">
                <p className="text-[10px] text-violet-400/50 tracking-widest uppercase mb-2">
                  {FORTUNE_TOPICS.find((t) => t.id === activeTopic)?.emoji} {activeTopic}
                </p>
                <AnimatePresence mode="wait">
                  {topicState.loadState === "loading" && (
                    <motion.div key="tp-load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 py-1">
                      <SpinnerIcon small />
                      <p className="text-violet-300/50 text-xs">Đang thỉnh thiên cơ...</p>
                    </motion.div>
                  )}
                  {(topicState.loadState === "typing" || topicState.loadState === "done") && topicState.text && (
                    <motion.div key="tp-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <TypewriterBlock text={topicState.text} isTyping={topicState.loadState === "typing"}
                        speed={28} onDone={handleTopicTypingDone} />
                    </motion.div>
                  )}
                  {topicState.loadState === "error" && topicState.error && (
                    <motion.div key="tp-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ErrorBlock error={topicState.error}
                        onRetry={() => activeTopic && handleTopicClick(activeTopic)} small />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Watermark */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <p className="text-white/12 text-[10px] tracking-wide">🔮 Thỉnh quẻ tại: huyen-co-cac.pages.dev</p>
          <p className="text-white/12 text-[10px]">{dateLabel}</p>
        </div>
      </div>

      {/* Share button */}
      <AnimatePresence>
        {overviewDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-2 flex justify-end px-1">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={handleShare} disabled={isSharing}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 text-white/40 text-xs px-4 py-2 hover:border-amber-400/20 hover:text-amber-300/60 transition-all disabled:opacity-40">
              {isSharing
                ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span> Đang tạo ảnh...</>
                : <><span>📤</span> Tải ảnh để chia sẻ Story</>
              }
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Typewriter Block ──────────────────────────────────────────

function TypewriterBlock({ text, isTyping, speed = 30, onDone }: {
  text: string; isTyping: boolean; speed?: number; onDone?: () => void;
}) {
  const { displayed, done } = useTypewriter(isTyping ? text : "", speed, onDone);
  const shown = isTyping ? displayed : text;
  return (
    <p className="text-white/75 text-sm leading-relaxed">
      {shown}
      {isTyping && !done && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.55, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-violet-400/70 ml-0.5 align-middle rounded-full" />
      )}
    </p>
  );
}

// ─── Spinner ──────────────────────────────────────────────────

function SpinnerIcon({ small }: { small?: boolean }) {
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
