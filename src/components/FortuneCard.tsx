// ============================================================
// FortuneCard.tsx — AI Luận Giải — Design System v5
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateDailyFortune, getCachedFortune, setCachedFortune, makeCacheKey,
  FORTUNE_TOPICS, type GeminiError, type FortuneTopic,
} from "../utils/gemini";
import { UserProfile, solarToLunar, getCanChiDay, toJDN } from "../utils/astrology";
import { shareFortuneImage } from "../utils/shareImage";
import { tryDailyNotification } from "../utils/notifications";

interface FortuneCardProps {
  date: Date;
  userProfile: UserProfile | null;
  onSetupProfile: () => void;
}

// ─── Typewriter ───────────────────────────────────────────────

function Typewriter({ text, speed = 25, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  const [done,  setDone]  = useState(false);
  const ref = useRef({ idx: 0, timer: 0 as ReturnType<typeof setInterval> });

  useEffect(() => {
    clearInterval(ref.current.timer);
    ref.current.idx = 0;
    setShown(""); setDone(false);
    if (!text) return;
    ref.current.timer = setInterval(() => {
      ref.current.idx++;
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
    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
      {shown}
      {!done && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full"
          style={{ background: "var(--gold)" }} />
      )}
    </p>
  );
}

// ─── Spinner ──────────────────────────────────────────────────

function Spinner({ small }: { small?: boolean }) {
  const sz = small ? "w-4 h-4" : "w-7 h-7";
  return (
    <div className={`relative flex-shrink-0 ${sz}`}>
      <motion.div className="absolute inset-0 rounded-full border-2"
        animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        style={{ borderColor: "var(--border-medium)", borderTopColor: "var(--gold)" }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────

export function FortuneCard({ date, userProfile, onSetupProfile }: FortuneCardProps) {
  const dateIso     = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  const dateLabel   = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  const jdn         = toJDN(date.getDate(), date.getMonth()+1, date.getFullYear());
  const todayCanChi = getCanChiDay(jdn);
  const lunar       = solarToLunar(date.getDate(), date.getMonth()+1, date.getFullYear());

  type S = "idle" | "loading" | "typing" | "done" | "error";
  const [ov,    setOv]  = useState<{ s: S; text: string; err: GeminiError | null }>({ s: "idle", text: "", err: null });
  const [topic, setTopic] = useState<FortuneTopic | null>(null);
  const [tp,    setTp]  = useState<{ s: S; text: string; err: GeminiError | null }>({ s: "idle", text: "", err: null });
  const calling = useRef(false);

  // Reset on date change
  const prevDateRef = useRef(dateIso);
  if (prevDateRef.current !== dateIso) {
    prevDateRef.current = dateIso;
    calling.current = false;
    if (ov.s !== "idle") {
      setTimeout(() => {
        setOv({ s: "idle", text: "", err: null });
        setTopic(null);
        setTp({ s: "idle", text: "", err: null });
      }, 0);
    }
  }

  const cacheKey       = userProfile ? makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan") : "";
  const cachedOverview = cacheKey ? getCachedFortune(cacheKey) : null;

  useEffect(() => {
    if (!cachedOverview) return;
    if (ov.s === "idle" || ov.s === "error")
      setOv({ s: "done", text: cachedOverview.text, err: null });
  }, [cacheKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const callAI = useCallback(async () => {
    if (!userProfile || calling.current) return;
    const key = makeCacheKey(dateIso, userProfile.birthYear, "Tổng quan");
    const cached = getCachedFortune(key);
    if (cached) { setOv({ s: "done", text: cached.text, err: null }); return; }
    calling.current = true;
    setOv({ s: "loading", text: "", err: null });
    try {
      const r = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear, todayCanChi, dateLabel, "Tổng quan"
      );
      setCachedFortune(key, { ...r, cached: false });
      setOv({ s: "typing", text: r.text, err: null });
      tryDailyNotification({
        todayLabel: `Ngày ${todayCanChi}`,
        quality: "Mở app xem luận giải hôm nay",
        tip: r.text.slice(0, 80),
      });
    } catch (e) {
      calling.current = false;
      setOv({ s: "error", text: "", err: e as GeminiError });
    }
  }, [userProfile, dateIso, todayCanChi, dateLabel]);

  const callTopic = useCallback(async (t: FortuneTopic) => {
    if (!userProfile) return;
    if (tp.s === "loading" || tp.s === "typing") return;
    if (topic === t && tp.s === "done") { setTopic(null); setTp({ s: "idle", text: "", err: null }); return; }
    setTopic(t);
    const key = makeCacheKey(dateIso, userProfile.birthYear, t);
    const cached = getCachedFortune(key);
    if (cached) { setTp({ s: "done", text: cached.text, err: null }); return; }
    setTp({ s: "loading", text: "", err: null });
    try {
      const r = await generateDailyFortune(
        String(userProfile.birthYear),
        `${userProfile.elementName} (${userProfile.destinyName})`,
        userProfile.canChiYear, todayCanChi, dateLabel, t
      );
      setCachedFortune(key, { ...r, cached: false });
      setTp({ s: "typing", text: r.text, err: null });
    } catch (e) {
      setTp({ s: "error", text: "", err: e as GeminiError });
    }
  }, [userProfile, topic, tp.s, dateIso, todayCanChi, dateLabel]);

  // ─── No profile ──────────────────────────────────────────────

  if (!userProfile) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-2">
        <div className="card px-5 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>🤖</div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>AI chưa biết bạn là ai</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Thiết lập bản mệnh để nhận luận giải cá nhân hóa
          </p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={onSetupProfile} className="btn-gold px-5 py-2 rounded-xl text-sm">
            Thiết lập ngay →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const ovDone = ov.s === "done";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="my-2">
      <div className="card overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center gap-2.5 border-b"
          style={{ borderColor: "var(--border-subtle)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>✨</div>
          <div className="flex-1">
            <p className="section-label">AI Luận Giải</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {dateLabel} · {lunar.canChiYear}
            </p>
          </div>
          {ovDone && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--bg-elevated)", color: "var(--text-faint)", border: "1px solid var(--border-subtle)" }}>
              {cachedOverview ? "Cache" : "Mới"}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="section-label mb-3">🌟 Tổng Quan Ngày</p>

          <AnimatePresence mode="wait">
            {ov.s === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-2">
                <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>
                  Can Chi: <span style={{ color: "var(--gold)" }}>{todayCanChi}</span>
                  {" · "}Tuổi: <span style={{ color: "var(--gold)" }}>{userProfile.canChiYear}</span>
                </p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={callAI}
                  className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm">
                  ✨ Bấm để AI luận giải hôm nay
                </motion.button>
              </motion.div>
            )}

            {ov.s === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-5">
                <Spinner />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Đang kết nối vũ trụ...</p>
              </motion.div>
            )}

            {ov.s === "typing" && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typewriter text={ov.text} onDone={() => setOv(p => ({ ...p, s: "done" }))} />
              </motion.div>
            )}

            {ov.s === "done" && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ov.text}</p>

                {/* Topic buttons */}
                <div className="pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="section-label mb-2">Hỏi sâu hơn →</p>
                  <div className="flex gap-1.5">
                    {FORTUNE_TOPICS.filter(f => f.id !== "Tổng quan").map(f => {
                      const active = topic === f.id;
                      const busy   = active && (tp.s === "loading" || tp.s === "typing");
                      return (
                        <motion.button key={f.id} whileTap={{ scale: 0.93 }}
                          onClick={() => callTopic(f.id)}
                          className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all flex-1 justify-center"
                          style={{
                            background: active ? "var(--gold-bg)" : "var(--bg-elevated)",
                            border: `1px solid ${active ? "var(--gold-border)" : "var(--border-subtle)"}`,
                            color: active ? "var(--gold)" : "var(--text-muted)",
                          }}>
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
                      <div className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                        <p className="section-label mb-2">
                          {FORTUNE_TOPICS.find(f => f.id === topic)?.emoji} {topic}
                        </p>
                        <AnimatePresence mode="wait">
                          {tp.s === "loading" && (
                            <motion.div key="tl" className="flex items-center gap-2">
                              <Spinner small />
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Đang thỉnh thiên cơ...</p>
                            </motion.div>
                          )}
                          {(tp.s === "typing" || tp.s === "done") && tp.text && (
                            <motion.div key="tt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              {tp.s === "typing"
                                ? <Typewriter text={tp.text} onDone={() => setTp(p => ({ ...p, s: "done" }))} />
                                : <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{tp.text}</p>}
                            </motion.div>
                          )}
                          {tp.s === "error" && tp.err && (
                            <motion.div key="te" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{tp.err.message}</p>
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => topic && callTopic(topic)}
                                className="btn-ghost text-xs px-3 py-1.5 rounded-lg">Thử lại</motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset + Share */}
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (cacheKey) try { localStorage.removeItem(cacheKey); } catch { /**/ }
                      calling.current = false;
                      setOv({ s: "idle", text: "", err: null });
                      setTopic(null); setTp({ s: "idle", text: "", err: null });
                    }}
                    className="text-xs" style={{ color: "var(--text-faint)" }}>
                    ↻ Luận giải lại
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => shareFortuneImage({
                      dateLabel,
                      canChiDay: todayCanChi,
                      topic: topic ?? "Tổng Quan",
                      content: topic && tp.s === "done" && tp.text ? tp.text : ov.text,
                      canChiYear: userProfile.canChiYear,
                    })}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    📤 Chia sẻ
                  </motion.button>
                </div>
              </motion.div>
            )}

            {ov.s === "error" && ov.err && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">
                    {ov.err.type === "rate_limit" ? "⏳" : ov.err.type === "network" ? "📡" : ov.err.type === "no_api_key" ? "🔑" : "😅"}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ov.err.message}</p>
                </div>
                {ov.err.debug && (
                  <div className="rounded-lg p-2.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-xs font-mono break-all" style={{ color: "var(--text-faint)" }}>{ov.err.debug}</p>
                  </div>
                )}
                {ov.err.type !== "no_api_key" && (
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => { calling.current = false; callAI(); }}
                    className="btn-ghost self-start text-xs px-4 py-2 rounded-xl">
                    Thử lại
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 pb-3 flex justify-end border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>{dateLabel}</p>
        </div>
      </div>
    </motion.div>
  );
}
