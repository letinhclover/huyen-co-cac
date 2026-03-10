// ============================================================
// gemini.ts — Huyền Cơ Các: Gemini AI (Native Fetch - No SDK)
// Dùng REST API trực tiếp thay vì @google/generative-ai SDK
// để tránh lỗi "Failed to fetch" trên môi trường browser
// ============================================================

// ─── Topic definitions ────────────────────────────────────────

export type FortuneTopic = "Tổng quan" | "Sự Nghiệp" | "Tình Duyên" | "Tài Lộc";

export const FORTUNE_TOPICS: { id: FortuneTopic; emoji: string; label: string }[] = [
  { id: "Tổng quan",  emoji: "🌟", label: "Tổng Quan"  },
  { id: "Sự Nghiệp",  emoji: "💼", label: "Sự Nghiệp"  },
  { id: "Tình Duyên", emoji: "❤️", label: "Tình Duyên" },
  { id: "Tài Lộc",    emoji: "💰", label: "Tài Lộc"    },
];

// ─── Types ────────────────────────────────────────────────────

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

// ─── Gemini REST API endpoint ─────────────────────────────────
// Dùng fetch thẳng đến Google API — không cần SDK
const GEMINI_MODEL   = "gemini-1.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
      "Đưa ra nhận xét tổng quan về năng lượng của họ hôm nay: cảm xúc, tương tác xã hội, lời khuyên sống tốt nhất cho ngày này.",
    "Sự Nghiệp":
      "Tập trung vào công việc hôm nay: deadline, đồng nghiệp, sếp, quyết định nghề nghiệp, cơ hội hay rủi ro. Rất cụ thể và thực tế.",
    "Tình Duyên":
      "Tập trung vào chuyện tình cảm hôm nay: nếu độc thân — cơ hội gặp gỡ hay tự yêu bản thân. Nếu có đôi — cách giữ lửa hoặc giải quyết mâu thuẫn. Ấm áp, không phán xét.",
    "Tài Lộc":
      "Tập trung vào tiền bạc hôm nay: có nên chi tiêu lớn không, cơ hội tài chính, hay nhắc nhở tiết kiệm. Thực tế và hữu ích.",
  };

  return `Bạn là chuyên gia tâm lý và tử vi phong cách Gen Z, nói chuyện như người bạn thân đang nhắn tin.

Thông tin người dùng:
- Sinh năm: ${userYear} (Can Chi: ${userCanChi})
- Bản mệnh: ${userMenh}
- Ngày xem: ${dateLabel} (Can Chi ngày: ${todayCanChi})
- Chủ đề: ${topic}

Nhiệm vụ: ${topicGuide[topic]}

Quy tắc bắt buộc:
- Chỉ 3-4 câu, không hơn.
- Giọng như nhắn tin cho bạn bè, tự nhiên, gần gũi.
- TUYỆT ĐỐI KHÔNG dùng từ Hán Việt khó (cấm: tuần không, triệt lộ, hung tinh...).
- KHÔNG hù dọa, KHÔNG nói chung chung.
- Đề cập ví dụ thực tế (meeting, deadline, nhắn tin ai đó...).
- Chỉ trả về text thuần, không markdown, không gạch đầu dòng.`;
}

// ─── Core fetch function ──────────────────────────────────────

export async function generateDailyFortune(
  userYear: string,
  userMenh: string,
  userCanChi: string,
  todayCanChi: string,
  dateLabel: string,
  topic: FortuneTopic = "Tổng quan"
): Promise<FortuneResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey || apiKey.trim() === "") {
    throw buildError("no_api_key", "Chưa cấu hình VITE_GEMINI_API_KEY. Kiểm tra Cloudflare Environment Variables nhé.");
  }

  const prompt  = buildPrompt(userYear, userMenh, userCanChi, todayCanChi, dateLabel, topic);
  const url     = `${GEMINI_API_URL}?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature:     0.88,
      topK:            40,
      topP:            0.95,
      maxOutputTokens: 280,
    },
  };

  // Timeout 15s
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });

    clearTimeout(timeoutId);

    // Xử lý HTTP errors
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const status  = res.status;

      if (status === 400) {
        const msg = (errBody as { error?: { message?: string } })?.error?.message ?? "";
        if (msg.includes("API_KEY") || msg.includes("api key")) {
          throw buildError("no_api_key", "API key không hợp lệ, kiểm tra lại trong Cloudflare nhé.");
        }
        throw buildError("unknown", "Yêu cầu không hợp lệ, thử lại sau nhé.");
      }
      if (status === 401 || status === 403) {
        throw buildError("no_api_key", "API key không có quyền truy cập. Kiểm tra lại key hoặc bật Generative Language API.");
      }
      if (status === 429) {
        throw buildError("rate_limit", "Huyền Cơ đang được hỏi quá nhiều, thử lại sau vài phút nhé 🙏");
      }
      if (status >= 500) {
        throw buildError("network", "Google AI đang bảo trì, thử lại sau ít phút nhé.");
      }
      throw buildError("unknown", `Lỗi không xác định (${status}), thử lại sau nhé.`);
    }

    // Parse response
    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      error?: { message?: string };
    };

    if (data.error) {
      throw buildError("unknown", data.error.message ?? "Lỗi từ Gemini, thử lại sau nhé.");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!text) {
      throw buildError("unknown", "Vũ trụ chưa có câu trả lời lúc này, thử lại sau nhé 😊");
    }

    return { text, topic, generatedAt: new Date().toISOString(), cached: false };

  } catch (err: unknown) {
    clearTimeout(timeoutId);

    // Đã là GeminiError → throw tiếp
    if (err && typeof err === "object" && "type" in err && "message" in err) {
      throw err;
    }

    // AbortError = timeout
    if (err instanceof Error && err.name === "AbortError") {
      throw buildError("network", "Kết nối hơi chậm, thử lại sau vài giây nhé 😅");
    }

    // TypeError: Failed to fetch = mất mạng hoặc CORS
    if (err instanceof TypeError) {
      throw buildError("network", "Không kết nối được tới Gemini. Kiểm tra mạng và thử lại nhé.");
    }

    throw buildError("unknown", "Có sự cố nhỏ, thử lại sau ít phút nhé.");
  }
}

function buildError(type: GeminiError["type"], message: string): GeminiError {
  return { type, message };
}

// ─── Cache helpers ────────────────────────────────────────────

const CACHE_PREFIX = "hcc_fortune_";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export function makeCacheKey(
  dateIso: string,
  birthYear: number | string,
  topic: FortuneTopic
): string {
  return `${CACHE_PREFIX}${dateIso}_${birthYear}_${topic.replace(/\s/g, "_")}`;
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
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ ...result, cached: true, expiresAt: Date.now() + CACHE_TTL_MS })
    );
    pruneOldCache();
  } catch { /* localStorage full */ }
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
