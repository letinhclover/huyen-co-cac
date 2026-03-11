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

  // Few-shot examples — cách hiệu quả nhất để ép AI viết đúng tone
  const examples: Record<FortuneTopic, string> = {
    "Tổng quan": `"Hôm nay khá ổn cho bạn đó, ngày ${todayCanChi} hợp với tuổi ${userCanChi} nên mọi thứ sẽ chảy khá mượt. Nếu có task tồn đọng thì giờ là lúc xử lý, đầu óc sẽ minh mẫn hơn bình thường. Tối về đừng doom-scroll đến 12 giờ đêm, ngủ sớm một chút là ngày mai sẽ ngon hơn."`,
    "Sự Nghiệp": `"Hôm nay hợp để push deadline hoặc chốt những việc đang còn lửng lơ, đừng để qua ngày mai. Nếu có meeting quan trọng thì cứ tự tin nói ý kiến, ngày ${todayCanChi} hỗ trợ khá tốt cho việc thuyết phục người khác. Buổi chiều có thể hơi mệt, pha cà phê hoặc trà sữa rồi lại chiến tiếp nhé."`,
    "Tình Duyên": `"Hôm nay năng lượng cảm xúc khá dễ chịu, nếu có ai đó bạn đang nhắn tin qua lại thì đây là lúc chủ động hơn một chút. Nếu đã có đôi thì tối nay rủ đi ăn gì đó thay vì mỗi người một điện thoại, nhỏ thôi nhưng giữ lửa được lắm. Còn nếu đang độc thân và chưa muốn yêu thì tự chiều bản thân một bữa ngon cũng được."`,
    "Tài Lộc": `"Hôm nay tiền bạc ở mức bình thường, không có gì đặc biệt để lo nhưng cũng đừng chi tay quá. Nếu đang định mua đồ online thì xem lại giỏ hàng một lần nữa, cái nào thực sự cần thì mới bấm đặt. Tiết kiệm nhỏ hôm nay, cuối tháng sẽ thấy thoải mái hơn."`,
  };

  return `Bạn là người hay xem bói cho bạn bè, nhắn tin kiểu Gen Z Việt Nam — gần gũi, thực tế, không màu mè.

Mẫu câu trả lời ĐÚNG cần học theo (về tone và style):
${examples[topic]}

Dữ liệu: Can Chi tuổi ${userCanChi} | Mệnh ${userMenh} | Can Chi ngày ${todayCanChi} | Ngày ${dateLabel} | Chủ đề: ${topic}

Nội dung: ${guides[topic]}

Quy tắc cứng:
1. Đúng 3 câu, viết liền không xuống dòng. KHÔNG được 4 câu hay nhiều hơn.
2. Câu đầu KHÔNG chào hỏi ("Xin chào", "Buddy", "Hey"...) — đi thẳng vào luận giải.
3. Gọi là "bạn". KHÔNG nhắc năm sinh, KHÔNG nhắc mệnh như giải thích lý thuyết.
4. Chỉ nói về chủ đề "${topic}". KHÔNG lẫn sang chủ đề khác.
5. KHÔNG bịa thuật ngữ — chỉ dùng Can Chi "${todayCanChi}" nếu cần nhắc đến ngày.
6. Ví dụ thật: meeting, Grab, order đồ ăn, nhắn tin crush, deadline, trà sữa...
7. Text thuần, không markdown, không bullet, không xuống dòng giữa câu.`;
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
