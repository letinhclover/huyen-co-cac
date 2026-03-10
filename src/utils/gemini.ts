// ============================================================
// gemini.ts — Huyền Cơ Các: AI Core (Groq API)
// Dùng Groq thay Gemini vì Gemini free tier không hỗ trợ VN
// Model: llama-3.1-8b-instant — nhanh, miễn phí, không cần billing
// ============================================================

export type FortuneTopic = "Tổng quan" | "Sự Nghiệp" | "Tình Duyên" | "Tài Lộc";

export const FORTUNE_TOPICS: { id: FortuneTopic; emoji: string; label: string }[] = [
  { id: "Tổng quan",  emoji: "🌟", label: "Tổng Quan"  },
  { id: "Sự Nghiệp",  emoji: "💼", label: "Sự Nghiệp"  },
  { id: "Tình Duyên", emoji: "❤️", label: "Tình Duyên" },
  { id: "Tài Lộc",    emoji: "💰", label: "Tài Lộc"    },
];

export interface FortuneResult {
  text: string;
  topic: FortuneTopic;
  generatedAt: string;
  cached: boolean;
}

export interface GeminiError {
  type: "no_api_key" | "network" | "rate_limit" | "unknown";
  message: string;
  debug?: string;
}

// ─── Groq config ──────────────────────────────────────────────
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Miễn phí, 6000 RPD, rất nhanh

// ─── Prompt ───────────────────────────────────────────────────

function buildPrompt(
  userYear: string,
  userMenh: string,
  userCanChi: string,
  todayCanChi: string,
  dateLabel: string,
  topic: FortuneTopic
): string {
  const guides: Record<FortuneTopic, string> = {
    "Tổng quan":   "Tổng quan năng lượng hôm nay: cảm xúc, tương tác xã hội, lời khuyên thực tế tốt nhất.",
    "Sự Nghiệp":   "Công việc hôm nay: deadline, đồng nghiệp, cơ hội hay rủi ro. Rất cụ thể và thực tế.",
    "Tình Duyên":  "Tình cảm hôm nay: nếu độc thân — cơ hội gặp gỡ hay tự yêu bản thân. Nếu có đôi — giữ lửa hoặc giải mâu thuẫn. Ấm áp, không phán xét.",
    "Tài Lộc":     "Tiền bạc hôm nay: nên chi tiêu không, cơ hội tài chính, hay nhắc tiết kiệm. Thực tế và hữu ích.",
  };

  return `Bạn là chuyên gia tâm lý và tử vi phong cách Gen Z, nói chuyện như người bạn thân đang nhắn tin bằng tiếng Việt.

Thông tin: Sinh năm ${userYear} (${userCanChi}) | Mệnh ${userMenh} | Ngày ${dateLabel} | Can Chi ngày: ${todayCanChi} | Chủ đề: ${topic}

Nhiệm vụ: ${guides[topic]}

Quy tắc bắt buộc:
- Đúng 3-4 câu, không hơn không kém.
- Tiếng Việt tự nhiên, gần gũi như nhắn tin.
- KHÔNG dùng từ Hán Việt khó (cấm: tuần không, hung tinh, cát tinh...).
- KHÔNG hù dọa, KHÔNG nói chung chung.
- Đề cập ví dụ thực tế (meeting, deadline, nhắn tin bạn bè, cà phê...).
- Chỉ trả về text thuần, không markdown, không gạch đầu dòng, không tiêu đề.`;
}

// ─── Main ─────────────────────────────────────────────────────

export async function generateDailyFortune(
  userYear: string,
  userMenh: string,
  userCanChi: string,
  todayCanChi: string,
  dateLabel: string,
  topic: FortuneTopic = "Tổng quan"
): Promise<FortuneResult> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY ?? "").trim();

  if (!apiKey) {
    throw {
      type: "no_api_key",
      message: "Chưa có API key. Kiểm tra Cloudflare Environment Variables (VITE_GROQ_API_KEY).",
      debug: "VITE_GROQ_API_KEY is empty",
    } as GeminiError;
  }

  const body = {
    model: GROQ_MODEL,
    messages: [
      {
        role: "user",
        content: buildPrompt(userYear, userMenh, userCanChi, todayCanChi, dateLabel, topic),
      },
    ],
    temperature: 0.85,
    max_tokens:  300,
    stream:      false,
  };

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15_000);

  let res: Response;
  try {
    res = await fetch(GROQ_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body:   JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timer);
    const isAbort = err instanceof Error && err.name === "AbortError";
    throw {
      type:    "network",
      message: isAbort ? "Kết nối quá chậm, thử lại nhé." : "Không kết nối được. Kiểm tra mạng.",
      debug:   String(err),
    } as GeminiError;
  }
  clearTimeout(timer);

  let rawBody = "";
  try { rawBody = await res.text(); } catch { rawBody = "(unreadable)"; }

  if (!res.ok) {
    let apiMsg = "";
    try {
      const j = JSON.parse(rawBody) as { error?: { message?: string } };
      apiMsg = j?.error?.message ?? "";
    } catch { apiMsg = rawBody.slice(0, 200); }

    const debug = `HTTP ${res.status} | ${apiMsg}`;

    if (res.status === 429) {
      throw { type: "rate_limit", message: "Đang bị giới hạn tạm thời, thử lại sau 1 phút nhé.", debug } as GeminiError;
    }
    if (res.status === 401) {
      throw { type: "no_api_key", message: "API key Groq không hợp lệ, kiểm tra lại nhé.", debug } as GeminiError;
    }
    throw { type: "unknown", message: `Lỗi từ server (${res.status}): ${apiMsg}`, debug } as GeminiError;
  }

  // Parse response (OpenAI-compatible format)
  let text = "";
  try {
    const j = JSON.parse(rawBody) as {
      choices?: { message?: { content?: string } }[];
    };
    text = j?.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    throw { type: "unknown", message: "Phản hồi AI không đọc được, thử lại nhé.", debug: rawBody.slice(0, 300) } as GeminiError;
  }

  if (!text) {
    throw { type: "unknown", message: "AI trả về rỗng, thử lại nhé.", debug: rawBody.slice(0, 300) } as GeminiError;
  }

  return { text, topic, generatedAt: new Date().toISOString(), cached: false };
}

// ─── Cache ────────────────────────────────────────────────────

const PREFIX = "hcc_v4_";
const TTL    = 24 * 60 * 60 * 1000;

export function makeCacheKey(dateIso: string, birthYear: number | string, topic: FortuneTopic) {
  return `${PREFIX}${dateIso}_${birthYear}_${topic.replace(/\s/g, "_")}`;
}

export function getCachedFortune(key: string): FortuneResult | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as FortuneResult & { expiresAt?: number };
    if (p.expiresAt && Date.now() > p.expiresAt) { localStorage.removeItem(key); return null; }
    return { ...p, cached: true };
  } catch { return null; }
}

export function setCachedFortune(key: string, result: FortuneResult) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...result, cached: true, expiresAt: Date.now() + TTL }));
    // Dọn cache cũ (prefix cũ)
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("hcc_v3_") || k.startsWith("hcc_v2_") || k.startsWith("hcc_fortune_"))) {
        localStorage.removeItem(k);
      }
    }
  } catch { /* storage full */ }
}
