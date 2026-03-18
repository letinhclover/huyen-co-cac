// ============================================================
// TuviTab.tsx — Tử Vi Trọn Đời — AI Luận Giải Trực Tiếp
// Dùng AI giải thích bằng ngôn ngữ đời thường, dễ hiểu
// ============================================================

import { useState, useEffect } from "react";
import { shareTuviImage } from "../utils/shareImage";
import { motion, AnimatePresence } from "framer-motion";
import { getHoroscope, getCanChiYear } from "../data/horoscopes";

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";
const CACHE_PREFIX = "hcc_tuvi_v2_";

interface Props { birthYear?: number; }

function cacheKey(year: number, gender: string) { return `${CACHE_PREFIX}${year}_${gender}`; }

async function askAiTuvi(canChiYear: string, gender: "nam"|"nu", horoContent: string): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? "").trim();
  if (!apiKey) throw new Error("Chưa có API key");

  const genderLabel = gender==="nam" ? "nam" : "nữ";
  const prompt = `Bạn là thầy tướng số thân thiện, nói ngôn ngữ đời thường như người Việt Nam bình thường. TUYỆT ĐỐI KHÔNG dùng từ Hán Việt khó hiểu (không viết: "tiên thiên", "phúc đức", "cát hung", "âm dương ngũ hành"...). Hãy đổi sang lời nói dân dã thay thế.

Đây là thông tin tử vi cổ của người sinh năm ${canChiYear}, ${genderLabel} mạng:
---
${horoContent.slice(0, 1400)}
---

Hãy giải thích số mệnh của họ bằng lời dễ hiểu nhất. Trình bày theo 4 mục sau, mỗi mục bắt đầu bằng "SECTION:" để tôi có thể phân tách:

SECTION:🌟 Tổng quan
[2-3 câu ngắn về tính cách chủ đạo và số phận tổng thể, viết như đang nói chuyện với bạn bè]

SECTION:💼 Sự nghiệp & Tài lộc  
[2-3 câu về công việc, tiền bạc, cơ hội — cụ thể và thực tế]

SECTION:❤️ Tình duyên & Gia đình
[2-3 câu về hôn nhân, con cái, hạnh phúc gia đình — ấm áp, không phán xét]

SECTION:💡 Lời khuyên sống
[2-3 câu lời khuyên thực tế, tích cực, hành động cụ thể để cải vận]

Viết ngắn gọn, ấm áp, truyền cảm hứng. Sử dụng ngôn ngữ đời thường, không dùng từ Hán Việt khó hiểu. Gọi người đọc là "bạn".`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},
    body: JSON.stringify({model:GROQ_MODEL, messages:[{role:"user",content:prompt}], temperature:0.72, max_tokens:600}),
    signal: AbortSignal.timeout(22000),
  });
  if (!res.ok) throw new Error(`Lỗi server (${res.status})`);
  const j = await res.json() as {choices?:{message?:{content?:string}}[]};
  return j?.choices?.[0]?.message?.content?.trim() ?? "";
}

function parseSections(text: string): {emoji:string;label:string;content:string}[] {
  const parts = text.split(/SECTION:/g).filter(p => p.trim());
  return parts.map(part => {
    const lines = part.trim().split("\n");
    const header = lines[0].trim();
    const content = lines.slice(1).join("\n").trim().replace(/^\[|\]$/g,"");
    const emojiMatch = header.match(/^([\p{Emoji}]+)/u);
    const emoji = emojiMatch?.[1] ?? "✦";
    const label = header.replace(/^[\p{Emoji}\s]+/u,"").trim();
    return { emoji, label, content };
  }).filter(s => s.content);
}

export function TuviTab({ birthYear }: Props) {
  const [year,   setYear]   = useState(birthYear ?? new Date().getFullYear()-30);
  const [gender, setGender] = useState<"nam"|"nu">("nam");
  const [aiText, setAiText] = useState("");
  const [loading,setLoading]= useState(false);
  const [error,  setError]  = useState("");

  // Sync khi thành viên thay đổi
  useEffect(() => {
    if (birthYear && birthYear !== year) {
      setYear(birthYear);
      setAiText(""); setError("");
    }
  }, [birthYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const cc   = getCanChiYear(year);
  const horo = getHoroscope(year, gender);
  const sections = aiText ? parseSections(aiText) : [];

  // Try load from cache
  const tryLoadCache = () => {
    try {
      const cached = localStorage.getItem(cacheKey(year, gender));
      if (cached) { setAiText(cached); return true; }
    } catch {}
    return false;
  };

  const handleAsk = async () => {
    if (tryLoadCache()) return;
    if (!horo) { setError("Chưa có dữ liệu tử vi cho năm này"); return; }
    setLoading(true); setError(""); setAiText("");
    try {
      const text = await askAiTuvi(cc, gender, horo.content);
      setAiText(text);
      try { localStorage.setItem(cacheKey(year, gender), text); } catch {}
    } catch(e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally { setLoading(false); }
  };

  const handleChange = (newYear: number, newGender: "nam"|"nu") => {
    setAiText(""); setError("");
    if (newYear !== year) setYear(newYear);
    if (newGender !== gender) setGender(newGender);
  };

  return (
    <div className="px-4 pb-4 flex flex-col gap-3">
      {/* Controls */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="section-label mb-2">Giới tính</p>
            <div className="flex gap-1 p-0.5 rounded-xl" style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)"}}>
              {(["nam","nu"] as const).map(g=>(
                <button key={g} onClick={()=>handleChange(year,g)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{background:gender===g?"var(--gold)":"transparent",color:gender===g?"white":"var(--text-muted)"}}>
                  {g==="nam"?"👨 Nam":"👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="section-label mb-2">Năm sinh</p>
            <div className="flex items-center gap-1">
              <button onClick={()=>handleChange(year-1,gender)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>−</button>
              <div className="flex-1 text-center">
                <p className="font-bold" style={{color:"var(--text-primary)"}}>{year}</p>
                <p className="text-xs" style={{color:"var(--gold)"}}>{cc}</p>
              </div>
              <button onClick={()=>handleChange(year+1,gender)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA nếu chưa hỏi */}
      {!aiText && !loading && (
        <motion.button whileTap={{scale:0.97}} onClick={handleAsk}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          style={{background:"linear-gradient(135deg,var(--gold),var(--gold-light))",color:"white",fontSize:"1rem"}}>
          🔮 Xem Tử Vi Năm {cc} · {gender==="nam"?"Nam":"Nữ"} Mạng
        </motion.button>
      )}

      {/* Loading */}
      {loading && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card p-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0,1,2].map(i=>(
              <motion.div key={i} className="w-3 h-3 rounded-full"
                style={{background:"var(--gold)"}}
                animate={{opacity:[0.3,1,0.3],scale:[0.8,1.3,0.8]}}
                transition={{duration:0.9,delay:i*0.3,repeat:Infinity}} />
            ))}
          </div>
          <p className="text-base font-semibold" style={{color:"var(--text-secondary)"}}>Thầy đang luận tử vi...</p>
          <p className="text-sm" style={{color:"var(--text-muted)"}}>Mất khoảng 10-15 giây</p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-5 text-center">
          <p className="text-3xl mb-2">😔</p>
          <p className="text-sm mb-3" style={{color:"var(--accent-red)"}}>{error}</p>
          <button onClick={handleAsk} className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{background:"var(--bg-elevated)",color:"var(--text-secondary)"}}>Thử lại</button>
        </div>
      )}

      {/* Sections */}
      <AnimatePresence>
        {sections.length>0 && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex flex-col gap-3">
            {/* Header card */}
            <div className="card p-4 text-center" style={{background:"var(--gold-bg)",borderColor:"var(--gold-border)"}}>
              <p className="text-2xl mb-1">🌟</p>
              <p className="font-bold font-display text-lg" style={{color:"var(--gold)"}}>Tử Vi {cc}</p>
              <p className="text-sm" style={{color:"var(--text-secondary)"}}>{gender==="nam"?"Nam mạng":"Nữ mạng"} · Luận giải bằng AI</p>
            </div>

            {sections.map(({emoji,label,content})=>(
              <div key={label} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{emoji}</span>
                  <p className="font-bold text-base" style={{color:"var(--text-primary)"}}>{label}</p>
                </div>
                <p className="text-sm" style={{color:"var(--text-secondary)",lineHeight:"2",letterSpacing:"0.01em"}}>
                  {content}
                </p>
              </div>
            ))}

            <div className="flex gap-2">
              <button onClick={()=>{
                try { localStorage.removeItem(cacheKey(year,gender)); } catch {}
                setAiText(""); setTimeout(handleAsk, 100);
              }} className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-muted)"}}>
                🔄 Luận Giải Lại
              </button>
              <button onClick={()=>shareTuviImage({
                canChiYear: cc,
                gender,
                sections,
              })} className="flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5"
                style={{background:"var(--bg-elevated)",border:"1px solid var(--border-subtle)",color:"var(--text-secondary)"}}>
                📤 Chia sẻ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
