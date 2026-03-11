// ============================================================
// ThayTab.tsx — Hỏi Thầy Lão Đại
// Gieo 64 quẻ Kinh Dịch + AI luận giải theo câu hỏi người dùng
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUE_KINH_DICH, getQueMuc, QUE_MUC_STYLE, type Que } from "../data/divinations";

// ─── Groq AI call ─────────────────────────────────────────────
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

async function askThay(que: Que, cauHoi: string, birthYear?: number): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? "").trim();
  if (!apiKey) throw new Error("Chưa có API key Groq.");

  const context = birthYear ? `Người hỏi sinh năm ${birthYear}.` : "";
  const prompt = `Bạn là một thầy phong thủy lão làng — hiểu sâu Kinh Dịch, nói chuyện gần gũi kiểu Nam Bộ, không màu mè nhưng sâu sắc.

Người dùng vừa gieo được quẻ ${que.so} — "${que.tenDayDu}" (${que.chuHan} ${que.chuTau}).
Triệu tượng: "${que.trieuTuong}"
Tính chất: "${que.tinhChat}"
${context}

Câu hỏi của họ: "${cauHoi}"

Luận giải quẻ này theo câu hỏi trên. Văn phong: ấm áp, thực tế, có chiều sâu nhưng không phán xét. Gọi họ là "bạn". Không nhắc lại số quẻ hay tên quẻ trong câu đầu. Dùng 3-5 câu. Text thuần, không markdown.`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.8, max_tokens: 350 }),
    signal: AbortSignal.timeout(18000),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Đang quá tải, thử lại sau 1 phút.");
    throw new Error(`Lỗi server (${res.status})`);
  }
  const j = await res.json() as { choices?: { message?: { content?: string } }[] };
  return j?.choices?.[0]?.message?.content?.trim() ?? "";
}

// ─── Typewriter ───────────────────────────────────────────────
function Typewriter({ text }: { text: string }) {
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
      if (ref.current.idx >= text.length) { clearInterval(ref.current.timer); setDone(true); }
    }, 22);
    return () => clearInterval(ref.current.timer);
  }, [text]);
  return (
    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
      {shown}
      {!done && <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration:0.5, repeat:Infinity }} className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full" style={{ background: "var(--gold)" }} />}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────
interface Props { birthYear?: number; }

type Phase = "idle" | "question" | "spinning" | "result" | "asking" | "answered";

export function ThayTab({ birthYear }: Props) {
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [cauHoi,  setCauHoi]  = useState("");
  const [que,     setQue]     = useState<Que | null>(null);
  const [luanGiai,setLuanGiai]= useState("");
  const [error,   setError]   = useState("");
  const [rotation,setRotation]= useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleStart = () => {
    setPhase("question");
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleGieoQue = useCallback(async () => {
    if (!cauHoi.trim()) return;
    setPhase("spinning");
    setError("");
    setRotation(prev => prev + 720 + Math.random() * 360);

    // Pick random quẻ
    await new Promise(r => setTimeout(r, 2200));
    const picked = QUE_KINH_DICH[Math.floor(Math.random() * 64)];
    setQue(picked);
    setPhase("result");

    // Auto ask AI
    setTimeout(async () => {
      setPhase("asking");
      try {
        const text = await askThay(picked, cauHoi, birthYear);
        setLuanGiai(text);
        setPhase("answered");
      } catch(e) {
        setError(e instanceof Error ? e.message : "Lỗi không xác định");
        setPhase("result");
      }
    }, 800);
  }, [cauHoi, birthYear]);

  const handleReset = () => {
    setPhase("idle");
    setQue(null);
    setLuanGiai("");
    setCauHoi("");
    setError("");
  };

  const muc = que ? getQueMuc(que) : null;
  const style = muc ? QUE_MUC_STYLE[muc] : null;

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
            🔮
          </div>
          <div>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Hỏi Thầy Lão Đại</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>64 quẻ Kinh Dịch · AI luận giải</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        <AnimatePresence mode="wait">

          {/* IDLE */}
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="flex flex-col items-center text-center gap-5 pt-6">
              {/* Divination symbol */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
                  style={{ background: "var(--gold-bg)", border: "2px solid var(--gold-border)" }}>
                  ☰
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "var(--gold)", color: "white" }}>✦</div>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Thưa Thầy một điều
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Thành tâm đặt câu hỏi trong lòng,<br/>rồi gieo quẻ để thầy luận giải.
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2 text-left">
                {["Chuyện tình cảm đang phân vân","Quyết định quan trọng sắp tới","Công việc kinh doanh hỏi thăm"].map(s => (
                  <button key={s} onClick={() => { setCauHoi(s); setPhase("question"); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    💬 {s}
                  </button>
                ))}
              </div>
              <motion.button whileTap={{ scale:0.97 }} onClick={handleStart}
                className="btn-gold px-8 py-3 rounded-2xl font-semibold w-full max-w-xs">
                ✦ Hỏi Thầy
              </motion.button>
            </motion.div>
          )}

          {/* QUESTION INPUT */}
          {phase === "question" && (
            <motion.div key="question" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="flex flex-col gap-4">
              <div className="card p-4">
                <p className="section-label mb-2">Câu hỏi của bạn</p>
                <textarea ref={inputRef} value={cauHoi} onChange={e => setCauHoi(e.target.value)}
                  placeholder="Ví dụ: Tôi đang phân vân có nên chuyển công việc mới không..."
                  rows={4}
                  className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-all"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", color: "var(--text-primary)" }}
                  onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleGieoQue(); }}
                />
                <p className="text-xs mt-1.5" style={{ color: "var(--text-faint)" }}>⌘ + Enter để gieo quẻ</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleReset} className="btn-ghost flex-1 py-3">Huỷ</button>
                <motion.button whileTap={{ scale:0.97 }} onClick={handleGieoQue} disabled={!cauHoi.trim()}
                  className="btn-gold flex-2 py-3 flex-1"
                  style={{ opacity: cauHoi.trim() ? 1 : 0.45 }}>
                  🪄 Gieo Quẻ
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SPINNING */}
          {phase === "spinning" && (
            <motion.div key="spinning" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex flex-col items-center gap-6 pt-10">
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-display"
                style={{ background: "var(--gold-bg)", border: "3px solid var(--gold-border)" }}>
                ☯
              </motion.div>
              <div className="text-center">
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>Đang khai thiên lập địa...</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Thành tâm trong giây lát</p>
              </div>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }}
                    animate={{ opacity: [0.3,1,0.3], scale: [0.8,1.2,0.8] }}
                    transition={{ duration:0.8, delay: i*0.25, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT + ASKING + ANSWERED */}
          {(phase === "result" || phase === "asking" || phase === "answered") && que && (
            <motion.div key="result" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex flex-col gap-3">

              {/* Câu hỏi */}
              <div className="card px-4 py-3">
                <p className="section-label mb-1">Câu hỏi</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>"{cauHoi}"</p>
              </div>

              {/* Quẻ */}
              <div className={`card px-4 py-4 border ${style?.bg ?? ""}`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl font-display leading-none w-12 text-center flex-shrink-0" style={{ color: "var(--gold)" }}>
                    {que.chuTau}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{que.tenDayDu}</span>
                      {style && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${style.bg} ${style.color}`}>
                          {style.icon} {style.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--gold)" }}>{que.trieuTuong}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{que.tinhChat}</p>
                  </div>
                </div>
              </div>

              {/* AI luận giải */}
              <div className="card px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧓</span>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Thầy Lão Đại luận:</p>
                </div>

                {phase === "asking" && (
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ rotate:360 }} transition={{ duration:1.2, repeat:Infinity, ease:"linear" }}
                      className="w-4 h-4 rounded-full border-2" style={{ borderColor: "var(--gold-border)", borderTopColor: "var(--gold)" }} />
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Thầy đang suy nghĩ...</p>
                  </div>
                )}
                {phase === "answered" && luanGiai && <Typewriter text={luanGiai} />}
                {error && (
                  <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color: "var(--accent-red)" }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>

              {/* Luận giải gốc */}
              {phase === "answered" && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                  className="card px-4 py-3">
                  <p className="section-label mb-2">Lời quẻ nguyên bản</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{que.luanGiai}</p>
                </motion.div>
              )}

              {/* Reset */}
              {phase === "answered" && (
                <motion.button whileTap={{ scale:0.97 }} onClick={handleReset}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}
                  className="btn-ghost w-full py-3 rounded-2xl text-sm font-medium">
                  ↻ Hỏi câu khác
                </motion.button>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
