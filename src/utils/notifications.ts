// ============================================================
// notifications.ts — Push Notification Helpers
// Không cần backend, dùng Notification API + localStorage
// ============================================================

const NOTIF_KEY      = "hcc_notif_enabled";
const LAST_DAILY_KEY = "hcc_notif_last_daily"; // ISO date string
const LAST_EVENT_KEY = "hcc_notif_last_event";

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  const granted = result === "granted";
  try { localStorage.setItem(NOTIF_KEY, granted ? "1" : "0"); } catch {}
  return granted;
}

// ─── Gửi thông báo hàng ngày sáng sớm ────────────────────────

interface DailyNotifData {
  todayLabel: string;   // VD: "Ngày Bính Tuất - Đinh Sửu"
  quality: string;      // VD: "Ngày tốt ✅" | "Ngày trung bình ⚡"
  tip: string;          // 1 câu tip ngắn
}

export function tryDailyNotification(data: DailyNotifData): void {
  if (Notification.permission !== "granted") return;

  // Chỉ gửi 1 lần/ngày
  const today = new Date().toISOString().slice(0, 10);
  try {
    if (localStorage.getItem(LAST_DAILY_KEY) === today) return;
  } catch {}

  // Chỉ gửi trong khoảng 5h - 11h sáng
  const hour = new Date().getHours();
  if (hour < 5 || hour > 11) return;

  try {
    new Notification(`📅 ${data.todayLabel}`, {
      body: `${data.quality}\n${data.tip}`,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: "daily-fortune",
      silent: false,
    } as NotificationOptions);
    localStorage.setItem(LAST_DAILY_KEY, today);
  } catch {}
}

// ─── Nhắc sự kiện sắp đến ────────────────────────────────────

interface PersonalEventLite {
  id: string;
  name: string;
  type: "lunar" | "solar";
  day: number;
  month: number;
  year?: number;
  repeat: boolean;
}

function solarDaysUntil(day: number, month: number, year?: number): number {
  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target: Date;

  if (year && !({} as Record<string, boolean>)[""]) {
    // one-time event with specific year
    target = new Date(year, month - 1, day);
  } else {
    // yearly repeat — try this year, if passed try next
    target = new Date(now.getFullYear(), month - 1, day);
    if (target < nowDate) {
      target = new Date(now.getFullYear() + 1, month - 1, day);
    }
  }
  return Math.round((target.getTime() - nowDate.getTime()) / 86_400_000);
}

export function tryEventReminders(): void {
  if (Notification.permission !== "granted") return;

  const today = new Date().toISOString().slice(0, 10);
  try {
    if (localStorage.getItem(LAST_EVENT_KEY) === today) return;
  } catch {}

  let raw = "";
  try { raw = localStorage.getItem("hcc_personal_events") ?? ""; } catch {}
  if (!raw) return;

  let events: PersonalEventLite[] = [];
  try { events = JSON.parse(raw); } catch { return; }

  const upcoming = events
    .filter(e => e.type === "solar") // lunar reminder cần convert, tạm skip
    .map(e => ({ ...e, daysLeft: solarDaysUntil(e.day, e.month, e.repeat ? undefined : e.year) }))
    .filter(e => e.daysLeft >= 0 && e.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (!upcoming.length) return;

  const first = upcoming[0];
  const label = first.daysLeft === 0 ? "Hôm nay" : first.daysLeft === 1 ? "Ngày mai" : `Còn ${first.daysLeft} ngày`;

  try {
    new Notification(`🎉 Sắp đến: ${first.name}`, {
      body: `${label} — ${first.day}/${first.month}\n${upcoming.length > 1 ? `Còn ${upcoming.length - 1} sự kiện khác sắp đến` : ""}`,
      icon: "/pwa-192x192.png",
      tag: "event-reminder",
      silent: false,
    } as NotificationOptions);
    localStorage.setItem(LAST_EVENT_KEY, today);
  } catch {}
}

// ─── Lên lịch thông báo sáng mai (qua SW message) ────────────

export function scheduleNextDayNotification(): void {
  if (!("serviceWorker" in navigator)) return;
  if (Notification.permission !== "granted") return;

  // Tính milliseconds đến 7h sáng mai
  const now = new Date();
  const tomorrow7am = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 1,
    7, 0, 0, 0
  );
  const msUntil = tomorrow7am.getTime() - now.getTime();

  navigator.serviceWorker.ready.then(reg => {
    reg.active?.postMessage({
      type: "SCHEDULE_MORNING_NOTIF",
      delay: msUntil,
    });
  }).catch(() => {});
}
