// ============================================================
// gemini.ts — Huyền Cơ Các: Gemini AI Core
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Topic definitions ────────────────────────────────────────

export type FortuneTopic = "Tổng quan" | "Sự Nghiệp" | "Tình Duyên" | "Tài Lộc";

export const FORTUNE_TOPICS: { id: FortuneTopic; emoji: string; label: string }[] = [
  { id: "Tổng quan",  emoji: "🌟", label: "Tổng Quan"  },
  { id: "Sự Nghiệp",  emoji: "💼", label: "Sự Nghiệp"  },
  { id: "Tình Duyên", emoji: "❤️", label: "Tình Duyên" },
  { id: "Tài Lộc",    emoji: "💰", label: "Tài Lộc"    },
];

// ─── Result & Error types ─────────────────────────────────────

export interface FortuneResult {
  text: string;
  topic: FortuneTopic;
  generatedAt: string;
  cached: boolean;
}

export interface GeminiError {
  type: "no_api_key" | "network" | "rate_limit" | "unknown";
  message: string;
}

// ─── Lazy init ────────────────────────────────────────────────

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) throw buildError("no_api_key", "Chưa cấu hình VITE_GEMINI_API_KEY trong file .env");
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

// ─── Prompt builder ───────────────────────────────────────────

function buildPrompt(
  userYear: string,
  userMenh: string,
  userCanChi: string,
  todayCanChi: string,
  dateLabel: string,
  topic: FortuneTopic
): string {
  const topicGuide: Record<FortuneTopic, string> = {
    "Tổng quan":
      "Đưa ra nhận xét tổng quan về năng lượng của họ hôm nay: cảm xúc, tương tác xã hội, và lời khuyên sống tốt nhất cho ngày này.",
    "Sự Nghiệp":
      "Tập trung vào công việc hôm nay: deadline, đồng nghiệp, sếp, quyết định nghề nghiệp, cơ hội hay rủi ro trong công sở. Rất cụ thể và thực tế.",
    "Tình Duyên":
      "Tập trung vào chuyện tình cảm hôm nay: nếu độc thân — cơ hội gặp gỡ hay tự yêu bản thân. Nếu có đôi — cách giữ lửa hoặc giải quyết mâu thuẫn nhỏ. Ấm áp và không phán xét.",
    "Tài Lộc":
      "Tập trung vào tiền bạc hôm nay: có nên chi tiêu lớn không, cơ hội tài chính, hay nhắc nhở tiết kiệm. Thực tế và hữu ích.",
  };

  return `Bạn là chuyên gia tâm lý và tử vi phong cách Gen Z, nói chuyện như người bạn thân đang nhắn tin.

Thông tin người dùng:
- Sinh năm: ${userYear} (Can Chi: ${userCanChi})  
- Bản mệnh: ${userMenh}
- Ngày xem: ${dateLabel} (Can Chi ngày: ${todayCanChi})
- Chủ đề đang hỏi: ${topic}

Nhiệm vụ: ${topicGuide[topic]}

Quy tắc bắt buộc:
- Chỉ viết 3-4 câu, không hơn.
- Giọng văn gần gũi như nhắn tin cho bạn bè, tự nhiên, không cứng nhắc.
- TUYỆT ĐỐI KHÔNG dùng từ Hán Việt khó (cấm: tuần không, triệt lộ, hung tinh, cát tinh...).
- KHÔNG hù dọa, KHÔNG nói chung chung kiểu "cẩn thận mọi việc".
- Đề cập ví dụ thực tế (meeting, deadline, nhắn tin ai đó, uống cà phê...).
- Nếu tốt: nói rõ tận dụng thế nào. Nếu xấu: nói rõ tự chăm sóc bản thân cụ thể ra sao.
- Chỉ trả về text thuần, không dùng markdown, không dấu gạch đầu dòng.`;
}

// ─── Core generation ──────────────────────────────────────────

export async function generateDailyFortune(
  userYear: string,
  userMenh: string,
  userCanChi: string,
  todayCanChi: string,
  dateLabel: string,
  topic: FortuneTopic = "Tổng quan"
): Promise<FortuneResult> {
  const prompt = buildPrompt(userYear, userMenh, userCanChi, todayCanChi, dateLabel, topic);

  const timeoutMs = 14_000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), timeoutMs)
  );

  try {
    const model = getGenAI().getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.88,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 280,
      },
    });

    const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
    const text = result.response.text().trim();
    if (!text) throw new Error("empty_response");

    return { text, topic, generatedAt: new Date().toISOString(), cached: false };

  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    const msg = e?.message ?? "";

    if (msg === "timeout")
      throw buildError("network", "Vũ trụ đang bận xử lý nhiều yêu cầu, thử lại sau vài giây nhé 😅");
    if (msg.includes("API_KEY") || msg.includes("api_key") || msg.includes("API key") || msg.includes("VITE_GEMINI"))
      throw buildError("no_api_key", "Chưa cấu hình API key. Thêm VITE_GEMINI_API_KEY vào .env nhé.");
    if (e?.status === 429 || msg.includes("429") || msg.includes("quota"))
      throw buildError("rate_limit", "Huyền Cơ đang được hỏi quá nhiều, thử lại sau vài phút nhé 🙏");
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch"))
      throw buildError("network", "Mất kết nối mạng rồi, kiểm tra WiFi/data và thử lại nhé.");

    throw buildError("unknown", "Có sự cố nhỏ xảy ra, hãy thử lại sau ít phút nhé.");
  }
}

function buildError(type: GeminiError["type"], message: string): GeminiError {
  return { type, message };
}

// ─── Cache helpers ────────────────────────────────────────────

const CACHE_PREFIX  = "hcc_fortune_";
const CACHE_TTL_MS  = 24 * 60 * 60 * 1000; // 24h

export function makeCacheKey(dateIso: string, birthYear: number | string, topic: FortuneTopic): string {
  const safeTopic = topic.replace(/\s/g, "_");
  return `${CACHE_PREFIX}${dateIso}_${birthYear}_${safeTopic}`;
}

export function getCachedFortune(cacheKey: string): FortuneResult | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FortuneResult & { expiresAt?: number };
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    return { ...parsed, cached: true };
  } catch {
    return null;
  }
}

export function setCachedFortune(cacheKey: string, result: FortuneResult): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      ...result,
      cached: true,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }));
    pruneOldCache();
  } catch { /* localStorage full — ignore */ }
}

function pruneOldCache(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
    }
    if (keys.length > 40) {
      keys.slice(0, keys.length - 40).forEach((k) => localStorage.removeItem(k));
    }
  } catch { /* ignore */ }
}
