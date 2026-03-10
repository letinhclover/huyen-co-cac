// ============================================================
// gemini.ts — Huyền Cơ Các: Gemini AI (Native Fetch)
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
  // Raw debug info — để hiển thị khi cần debug
  debug?: string;
}

// ─── Model ───────────────────────────────────────────────────
// Dùng model stable đã xác nhận có trong danh sách
const MODEL = "gemini-2.0-flash-001";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

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
    "Tổng quan":   "Tổng quan năng lượng hôm nay: cảm xúc, tương tác, lời khuyên thực tế.",
    "Sự Nghiệp":   "Công việc hôm nay: deadline, đồng nghiệp, cơ hội hay rủi ro. Cụ thể và thực tế.",
    "Tình Duyên":  "Tình cảm hôm nay: gặp gỡ, giữ lửa hay giải quyết mâu thuẫn. Ấm áp, không phán xét.",
    "Tài Lộc":     "Tiền bạc hôm nay: chi tiêu, cơ hội hay tiết kiệm. Thực tế và hữu ích.",
  };

  return `Bạn là chuyên gia tâm lý và tử vi Gen Z, nói như nhắn tin cho bạn thân.

Sinh năm: ${userYear} (${userCanChi}) | Mệnh: ${userMenh}
Ngày: ${dateLabel} | Can Chi ngày: ${todayCanChi} | Chủ đề: ${topic}

${guides[topic]}

Quy tắc: 3-4 câu, không Hán Việt khó, không hù dọa, không chung chung, ví dụ thực tế (meeting, nhắn tin, cà phê...). Text thuần, không markdown.`;
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
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY ?? "").trim();

  if (!apiKey) {
    throw {
      type: "no_api_key",
      message: "Chưa có API key. Kiểm tra Cloudflare Environment Variables.",
      debug: "VITE_GEMINI_API_KEY is empty or undefined",
    } as GeminiError;
  }

  const url  = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(userYear, userMenh, userCanChi, todayCanChi, dateLabel, topic) }] }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 300 },
  };

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timer);
    const isAbort = err instanceof Error && err.name === "AbortError";
    throw {
      type:    "network",
      message: isAbort
        ? "Kết nối quá chậm (timeout 15s), thử lại nhé."
        : "Không kết nối được tới Gemini. Kiểm tra mạng.",
      debug: String(err),
    } as GeminiError;
  }
  clearTimeout(timer);

  // Đọc body dù lỗi hay không
  let rawBody = "";
  try { rawBody = await res.text(); } catch { rawBody = "(unreadable)"; }

  if (!res.ok) {
    // Parse để lấy thông tin lỗi chi tiết
    let apiMsg = "";
    try {
      const j = JSON.parse(rawBody) as { error?: { message?: string; status?: string } };
      apiMsg = j?.error?.message ?? j?.error?.status ?? "";
    } catch { apiMsg = rawBody.slice(0, 200); }

    const debug = `HTTP ${res.status} | ${apiMsg}`;

    if (res.status === 429) {
      throw {
        type:    "rate_limit",
        message: "API đang bị giới hạn (429). Chờ 1-2 phút rồi thử lại nhé.",
        debug,
      } as GeminiError;
    }
    if (res.status === 400) {
      throw {
        type:    "unknown",
        message: `Yêu cầu không hợp lệ (400): ${apiMsg}`,
        debug,
      } as GeminiError;
    }
    if (res.status === 401 || res.status === 403) {
      throw {
        type:    "no_api_key",
        message: `API key không hợp lệ hoặc thiếu quyền (${res.status}).`,
        debug,
      } as GeminiError;
    }
    if (res.status === 404) {
      throw {
        type:    "unknown",
        message: `Model không tồn tại (404): ${MODEL}`,
        debug,
      } as GeminiError;
    }
    throw {
      type:    "unknown",
      message: `Lỗi từ Gemini (${res.status}): ${apiMsg || "không rõ nguyên nhân"}`,
      debug,
    } as GeminiError;
  }

  // Parse success
  let text = "";
  try {
    const j = JSON.parse(rawBody) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    text = j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  } catch {
    throw {
      type:    "unknown",
      message: "Phản hồi từ AI không đọc được, thử lại nhé.",
      debug:   rawBody.slice(0, 300),
    } as GeminiError;
  }

  if (!text) {
    throw {
      type:    "unknown",
      message: "AI trả về phản hồi rỗng, thử lại nhé.",
      debug:   rawBody.slice(0, 300),
    } as GeminiError;
  }

  return { text, topic, generatedAt: new Date().toISOString(), cached: false };
}

// ─── Cache ────────────────────────────────────────────────────

const PREFIX   = "hcc_v3_";           // đổi prefix = xoá cache cũ tự động
const TTL      = 24 * 60 * 60 * 1000; // 24h

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
    localStorage.setItem(key, JSON.stringify({
      ...result, cached: true, expiresAt: Date.now() + TTL,
    }));
    // Dọn cache cũ (prefix cũ)
    const OLD = ["hcc_fortune_", "hcc_"];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && OLD.some(o => k.startsWith(o))) localStorage.removeItem(k);
    }
  } catch { /* full */ }
}
