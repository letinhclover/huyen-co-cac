// ============================================================
// astrology.ts — Huyền Cơ Các: Core Astrology Engine
// ============================================================

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
}

export interface UserProfile {
  birthYear: number;
  canChiYear: string;
  element: string;
  elementName: string;
  elementEmoji: string;
  destinyName: string;
  canIndex: number;
  chiIndex: number;
}

export interface EnergyResult {
  score: number;
  status: "harmony" | "neutral" | "mild_conflict" | "conflict";
  statusLabel: string;
  statusColor: string;
  headline: string;
  detail: string;
  luckyColor: string;
  avoidAction: string;
}

// ─── Celestial Stems & Branches ──────────────────────────────
export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

// ─── Chi relationships ────────────────────────────────────────
// Tam Hợp (Triple Harmony): +30 energy bonus
const TAM_HOP: [number, number, number][] = [
  [0, 4, 8],   // Tý-Thìn-Thân
  [1, 5, 9],   // Sửu-Tỵ-Dậu
  [2, 6, 10],  // Dần-Ngọ-Tuất
  [3, 7, 11],  // Mão-Mùi-Hợi
];

// Lục Hợp (Six Harmonies): +25 energy bonus
const LUC_HOP: [number, number][] = [
  [0, 1],   // Tý-Sửu
  [2, 11],  // Dần-Hợi
  [3, 10],  // Mão-Tuất
  [4, 9],   // Thìn-Dậu
  [5, 8],   // Tỵ-Thân
  [6, 7],   // Ngọ-Mùi
];

// Tứ Hành Xung (Four Conflicts): -30 energy penalty
const TU_HANH_XUNG: [number, number][] = [
  [0, 6],  // Tý-Ngọ
  [1, 7],  // Sửu-Mùi
  [2, 8],  // Dần-Thân
  [3, 9],  // Mão-Dậu
  [4, 10], // Thìn-Tuất
  [5, 11], // Tỵ-Hợi
];

// ─── Destiny Table (Nạp Âm 60 năm) ──────────────────────────
interface DestinyInfo {
  element: string;
  elementName: string;
  elementEmoji: string;
  destinyName: string;
}

const DESTINY_TABLE: Record<string, DestinyInfo> = {
  "Giáp Tý":    { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Hải Trung Kim — Vàng trong lòng biển" },
  "Ất Sửu":     { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Hải Trung Kim — Vàng trong lòng biển" },
  "Bính Dần":   { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Lư Trung Hỏa — Lửa trong lò nung" },
  "Đinh Mão":   { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Lư Trung Hỏa — Lửa trong lò nung" },
  "Mậu Thìn":   { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Đại Lâm Mộc — Rừng cây già vững chắc" },
  "Kỷ Tỵ":      { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Đại Lâm Mộc — Rừng cây già vững chắc" },
  "Canh Ngọ":   { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Lộ Bàng Thổ — Đất bên vệ đường" },
  "Tân Mùi":    { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Lộ Bàng Thổ — Đất bên vệ đường" },
  "Nhâm Thân":  { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Kiếm Phong Kim — Vàng mũi kiếm sắc bén" },
  "Quý Dậu":    { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Kiếm Phong Kim — Vàng mũi kiếm sắc bén" },
  "Giáp Tuất":  { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Sơn Đầu Hỏa — Lửa trên đỉnh núi" },
  "Ất Hợi":     { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Sơn Đầu Hỏa — Lửa trên đỉnh núi" },
  "Bính Tý":    { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Giản Hạ Thủy — Nước suối chảy nhẹ" },
  "Đinh Sửu":   { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Giản Hạ Thủy — Nước suối chảy nhẹ" },
  "Mậu Dần":    { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Thành Đầu Thổ — Đất đắp đầu thành" },
  "Kỷ Mão":     { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Thành Đầu Thổ — Đất đắp đầu thành" },
  "Canh Thìn":  { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Bạch Lạp Kim — Vàng ánh sáng nến trắng" },
  "Tân Tỵ":     { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Bạch Lạp Kim — Vàng ánh sáng nến trắng" },
  "Nhâm Ngọ":   { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Dương Liễu Mộc — Cây liễu mềm mại" },
  "Quý Mùi":    { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Dương Liễu Mộc — Cây liễu mềm mại" },
  "Giáp Thân":  { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Tuyền Trung Thủy — Nước mạch ngầm trong lòng đất" },
  "Ất Dậu":     { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Tuyền Trung Thủy — Nước mạch ngầm trong lòng đất" },
  "Bính Tuất":  { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Ốc Thượng Thổ — Đất phủ trên mái nhà" },
  "Đinh Hợi":   { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Ốc Thượng Thổ — Đất phủ trên mái nhà" },
  "Mậu Tý":     { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Tích Lịch Hỏa — Lửa của sấm chớp" },
  "Kỷ Sửu":     { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Tích Lịch Hỏa — Lửa của sấm chớp" },
  "Canh Dần":   { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Tùng Bách Mộc — Cây tùng bách kiên cường" },
  "Tân Mão":    { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Tùng Bách Mộc — Cây tùng bách kiên cường" },
  "Nhâm Thìn":  { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Trường Lưu Thủy — Nước sông dài chảy mãi" },
  "Quý Tỵ":     { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Trường Lưu Thủy — Nước sông dài chảy mãi" },
  "Giáp Ngọ":   { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Sa Trung Kim — Vàng ẩn trong cát" },
  "Ất Mùi":     { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Sa Trung Kim — Vàng ẩn trong cát" },
  "Bính Thân":  { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Sơn Hạ Hỏa — Lửa bùng dưới chân núi" },
  "Đinh Dậu":   { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Sơn Hạ Hỏa — Lửa bùng dưới chân núi" },
  "Mậu Tuất":   { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Bình Địa Mộc — Cây cỏ trên đồng bằng" },
  "Kỷ Hợi":     { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Bình Địa Mộc — Cây cỏ trên đồng bằng" },
  "Canh Tý":    { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Bích Thượng Thổ — Đất phủ trên vách tường" },
  "Tân Sửu":    { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Bích Thượng Thổ — Đất phủ trên vách tường" },
  "Nhâm Dần":   { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Kim Bạch Kim — Vàng ròng tinh khiết nhất" },
  "Quý Mão":    { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Kim Bạch Kim — Vàng ròng tinh khiết nhất" },
  "Giáp Thìn":  { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Phúc Đăng Hỏa — Ngọn lửa từ đèn phúc lành" },
  "Ất Tỵ":      { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Phúc Đăng Hỏa — Ngọn lửa từ đèn phúc lành" },
  "Bính Ngọ":   { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Thiên Hà Thủy — Nước sông Ngân Hà" },
  "Đinh Mùi":   { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Thiên Hà Thủy — Nước sông Ngân Hà" },
  "Mậu Thân":   { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Đại Dịch Thổ — Đất bãi rộng lớn" },
  "Kỷ Dậu":     { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Đại Dịch Thổ — Đất bãi rộng lớn" },
  "Canh Tuất":  { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Xuyến Xoa Kim — Vàng vòng hoa trang sức" },
  "Tân Hợi":    { element: "kim",  elementName: "Kim",  elementEmoji: "🪙", destinyName: "Xuyến Xoa Kim — Vàng vòng hoa trang sức" },
  "Nhâm Tý":    { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Tang Chá Mộc — Cây dâu gốc rễ xù xì" },
  "Quý Sửu":    { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Tang Chá Mộc — Cây dâu gốc rễ xù xì" },
  "Giáp Dần":   { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Đại Khê Thủy — Nước khe suối lớn" },
  "Ất Mão":     { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Đại Khê Thủy — Nước khe suối lớn" },
  "Bính Thìn":  { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Sa Trung Thổ — Đất ẩn trong cát bụi" },
  "Đinh Tỵ":    { element: "tho",  elementName: "Thổ",  elementEmoji: "🌏", destinyName: "Sa Trung Thổ — Đất ẩn trong cát bụi" },
  "Mậu Ngọ":    { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Thiên Thượng Hỏa — Lửa trên bầu trời" },
  "Kỷ Mùi":     { element: "hoa",  elementName: "Hỏa",  elementEmoji: "🔥", destinyName: "Thiên Thượng Hỏa — Lửa trên bầu trời" },
  "Canh Thân":  { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Thạch Lựu Mộc — Cây lựu mọc trên đá" },
  "Tân Dậu":    { element: "moc",  elementName: "Mộc",  elementEmoji: "🌳", destinyName: "Thạch Lựu Mộc — Cây lựu mọc trên đá" },
  "Nhâm Tuất":  { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Đại Hải Thủy — Nước đại dương mênh mông" },
  "Quý Hợi":    { element: "thuy", elementName: "Thủy", elementEmoji: "💧", destinyName: "Đại Hải Thủy — Nước đại dương mênh mông" },
};

// ─── Shopee Affiliate Products ────────────────────────────────
export interface ShopeeProduct {
  name: string;
  description: string;
  emoji: string;
  url: string;
  price: string;
}

export const SHOPEE_PRODUCTS: Record<string, ShopeeProduct> = {
  kim: {
    name: "Vòng Thạch Anh Trắng Mệnh Kim",
    emoji: "💎",
    description: "Thạch anh trắng tăng cường năng lượng Kim, thu hút tài lộc và thanh lọc không gian xung quanh bạn.",
    price: "từ 89.000đ",
    url: "https://s.shopee.vn/2BA6PD7Tho",
  },
  moc: {
    name: "Vòng Mắt Hổ Tự Nhiên Mệnh Mộc",
    emoji: "🟡",
    description: "Đá mắt hổ giúp tăng sự tự tin, kiên định và bảo vệ bạn khỏi những năng lượng tiêu cực mỗi ngày.",
    price: "từ 120.000đ",
    url: "https://s.shopee.vn/AKVo8QpDWE",
  },
  thuy: {
    name: "Vòng Aquamarine Xanh Biển Mệnh Thủy",
    emoji: "🩵",
    description: "Aquamarine giúp tâm trí bình yên, cải thiện giao tiếp và tăng trực giác nhạy bén của người mệnh Thủy.",
    price: "từ 150.000đ",
    url: "https://s.shopee.vn/2LTWbOZEhP",
  },
  hoa: {
    name: "Vòng Mã Não Đỏ Rực Mệnh Hỏa",
    emoji: "🔴",
    description: "Mã não đỏ là viên đá của đam mê và nhiệt huyết, giúp người mệnh Hỏa bùng cháy năng lượng mỗi ngày.",
    price: "từ 95.000đ",
    url: "https://s.shopee.vn/7VBckwxNq5",
  },
  tho: {
    name: "Vòng Thạch Anh Tím Mệnh Thổ",
    emoji: "💜",
    description: "Thạch anh tím kết hợp sự vững chắc của Thổ và trực giác tâm linh, giúp bạn đưa ra quyết định khôn ngoan.",
    price: "từ 110.000đ",
    url: "https://s.shopee.vn/10y916K7Kr",
  },
};

// ─── Julian Day Number Conversion ────────────────────────────

export function toJDN(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jdn < 2299161) {
    jdn =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  }
  return jdn;
}

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  const Jde =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = (359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3) * dr;
  const Mpr = (306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3) * dr;
  const F = (21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3) * dr;
  const C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M) +
    0.0021 * Math.sin(2 * M) -
    0.4068 * Math.sin(Mpr) +
    0.0161 * Math.sin(2 * Mpr) -
    0.0004 * Math.sin(3 * Mpr) +
    0.0104 * Math.sin(2 * F) -
    0.0051 * Math.sin(M + Mpr) -
    0.0074 * Math.sin(M - Mpr) +
    0.0004 * Math.sin(2 * F + M) -
    0.0004 * Math.sin(2 * F - M) -
    0.0006 * Math.sin(2 * F + Mpr) +
    0.001 * Math.sin(2 * F - Mpr) +
    0.0005 * Math.sin(M + 2 * Mpr);
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jde + C1 - deltat;
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = (357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2) * dr;
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T2) * dr;
  const C =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.00029 * Math.sin(3 * M);
  const sun = L0 + C * dr;
  const omega = (125.04 - 1934.136 * T) * dr;
  const lsun = sun - 0.00569 * dr - 0.00478 * Math.sin(omega) * dr;
  let lsunDeg = (lsun / dr) % 360;
  if (lsunDeg < 0) lsunDeg += 360;
  return lsunDeg;
}

function getNewMoonDay(k: number, tz: number): number {
  // Returns dayNumber (JDN - 2415021) so comparisons in solarToLunar are consistent
  return Math.floor(newMoon(k) + 0.5 + tz / 24) - 2415021;
}

function getLunarMonth11(year: number, tz: number): number {
  const off = toJDN(31, 12, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  const sl = Math.floor(sunLongitude(nm + 2415021.076 - 0.5) / 30);
  if (sl >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}

function getLeapMonthOffset(a11: number, tz: number): number {
  const k = Math.floor(0.5 + (a11 - 2415021.076) / 29.530588853);
  let i = 1;
  let last = 0;
  let arc = Math.floor(sunLongitude(getNewMoonDay(k + i, tz) + 2415021.076 - 0.5) / 30);
  do {
    last = arc;
    i++;
    arc = Math.floor(sunLongitude(getNewMoonDay(k + i, tz) + 2415021.076 - 0.5) / 30);
  } while (arc !== last && i < 14);
  return i - 1;
}

// ─── Main Converter ───────────────────────────────────────────

export function solarToLunar(day: number, month: number, year: number): LunarDate {
  const tz = 7;
  const dayNumber = toJDN(day, month, year) - 2415021;
  const k = Math.floor((dayNumber - 0.5) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);

  let a11 = getLunarMonth11(year, tz);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, tz);
  } else {
    lunarYear = year + 1;
    b11 = getLunarMonth11(year + 1, tz);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let isLeapMonth = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapOffset = getLeapMonthOffset(a11, tz);
    if (diff >= leapOffset) {
      lunarMonth = diff + 10;
      if (diff === leapOffset) isLeapMonth = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  const jdn = toJDN(day, month, year);

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth,
    canChiDay: getCanChiDay(jdn),
    canChiMonth: getCanChiMonth(lunarMonth, lunarYear),
    canChiYear: getCanChiYear(lunarYear),
  };
}

// ─── Can Chi Helpers ──────────────────────────────────────────

export function getCanChiYear(year: number): string {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

export function getCanChiMonth(month: number, year: number): string {
  const canIdx = ((year * 12 + month) % 10 + 10) % 10;
  return `${CAN[canIdx]} ${CHI[(month + 0) % 12]}`;
}

export function getCanChiDay(jdn: number): string {
  return `${CAN[(jdn + 9) % 10]} ${CHI[(jdn + 1) % 12]}`;
}

export function getChiIndex(year: number): number {
  return (year + 8) % 12;
}

export function getCanIndex(year: number): number {
  return (year + 6) % 10;
}

// ─── Build UserProfile from birth year ───────────────────────

export function buildUserProfile(birthYear: number): UserProfile {
  const canChi = getCanChiYear(birthYear);
  const destiny = DESTINY_TABLE[canChi] ?? {
    element: "tho",
    elementName: "Thổ",
    elementEmoji: "🌏",
    destinyName: "Bình Địa Mộc — Tự nhiên, vững chắc",
  };
  return {
    birthYear,
    canChiYear: canChi,
    element: destiny.element,
    elementName: destiny.elementName,
    elementEmoji: destiny.elementEmoji,
    destinyName: destiny.destinyName,
    canIndex: getCanIndex(birthYear),
    chiIndex: getChiIndex(birthYear),
  };
}

export function getShopeeProduct(element: string): ShopeeProduct {
  return SHOPEE_PRODUCTS[element] ?? SHOPEE_PRODUCTS["tho"];
}

// ─── Energy Calculator (Core Algorithm) ──────────────────────

export function calculateDailyEnergy(userProfile: UserProfile, date: Date): EnergyResult {
  const { day, month, year } = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
  const jdn = toJDN(day, month, year);
  const todayChiIndex = (jdn + 1) % 12;
  const todayCanIndex = (jdn + 9) % 10;
  const userChiIndex = userProfile.chiIndex;
  const userCanIndex = userProfile.canIndex;

  let score = 50; // base score
  let status: EnergyResult["status"] = "neutral";

  // Check Tứ Hành Xung (Four Conflicts) — heavy penalty
  const isXung = TU_HANH_XUNG.some(
    ([a, b]) =>
      (a === userChiIndex && b === todayChiIndex) ||
      (b === userChiIndex && a === todayChiIndex)
  );

  // Check Tam Hợp (Triple Harmony) — big bonus
  const isTamHop = TAM_HOP.some((group) => group.includes(userChiIndex) && group.includes(todayChiIndex));

  // Check Lục Hợp (Six Harmonies) — medium bonus
  const isLucHop = LUC_HOP.some(
    ([a, b]) =>
      (a === userChiIndex && b === todayChiIndex) ||
      (b === userChiIndex && a === todayChiIndex)
  );

  // Check Can compatibility (same element family = bonus)
  const canCompatible = Math.abs(userCanIndex - todayCanIndex) <= 1 || Math.abs(userCanIndex - todayCanIndex) === 9;

  if (isXung) {
    score -= 30;
    status = "conflict";
  } else if (isTamHop) {
    score += 30;
    status = "harmony";
  } else if (isLucHop) {
    score += 25;
    status = "harmony";
  }

  if (canCompatible) score += 10;
  else score -= 5;

  // Deterministic variation based on date
  const dateHash = (day * 7 + month * 31 + year * 3) % 15;
  score += dateHash - 7;

  // Clamp
  score = Math.max(5, Math.min(100, score));

  // Build result messages
  const todayChi = CHI[todayChiIndex];
  const userChi = CHI[userChiIndex];

  let statusLabel = "";
  let statusColor = "";
  let headline = "";
  let detail = "";
  let luckyColor = "";
  let avoidAction = "";

  if (status === "conflict" || score < 35) {
    status = "conflict";
    statusLabel = "Cần Cẩn Thận";
    statusColor = "text-red-400";
    headline = `Ngày ${todayChi} và tuổi ${userChi} của bạn đang có chút căng thẳng`;
    detail = `Hôm nay năng lượng của bạn hơi thấp và bạn có thể dễ cáu hơn bình thường. Đừng lo — chỉ cần tránh tranh cãi với đồng nghiệp, không đưa ra quyết định lớn và tối về nghe nhạc thư giãn nhé. Ngày mai sẽ tốt hơn!`;
    luckyColor = "Trắng hoặc xám nhạt";
    avoidAction = "Tránh ký kết hợp đồng, tranh luận nơi đông người";
  } else if (status === "harmony" || score >= 70) {
    status = "harmony";
    statusLabel = isTamHop ? "Cực Thuận Lợi" : "Thuận Lợi";
    statusColor = "text-emerald-400";
    headline = isTamHop
      ? `Ngày ${todayChi} đang cộng hưởng mạnh mẽ với tuổi ${userChi} của bạn`
      : `Ngày ${todayChi} và tuổi ${userChi} đang hòa hợp tốt`;
    detail = isTamHop
      ? `Tuyệt vời! Hôm nay là một trong những ngày đỉnh nhất của bạn. Sếp dễ tính, đối tác cởi mở, rất hợp để chốt sale, đề xuất ý tưởng mới, hoặc hẹn hò lần đầu. Hãy tận dụng ngay!`
      : `Hôm nay mọi thứ đang chảy đúng hướng với bạn. Giao tiếp suôn sẻ, các mối quan hệ dễ xây dựng hơn. Đây là thời điểm tốt để kết nối với người quan trọng hoặc giải quyết chuyện còn dang dở.`;
    luckyColor = "Vàng gold hoặc xanh ngọc";
    avoidAction = "Không cần tránh gì — cứ ra ngoài và gặp gỡ mọi người!";
  } else if (score < 50) {
    status = "mild_conflict";
    statusLabel = "Bình Thường";
    statusColor = "text-yellow-400";
    headline = `Ngày ${todayChi} và tuổi ${userChi} đang ở trạng thái trung tính`;
    detail = `Hôm nay không có gì đặc biệt xấu, nhưng cũng không có tailwind đặc biệt. Hãy cứ làm việc đều đặn, không cần phải cố gắng phi thường. Tối về thư giãn với bạn bè hoặc gia đình sẽ tốt cho tinh thần.`;
    luckyColor = "Xanh lam nhẹ";
    avoidAction = "Tránh quyết định bốc đồng, hành động theo kế hoạch";
  } else {
    status = "neutral";
    statusLabel = "Ổn Định";
    statusColor = "text-blue-400";
    headline = `Ngày ${todayChi} và tuổi ${userChi} đang hài hòa nhẹ nhàng`;
    detail = `Năng lượng hôm nay ổn định và cân bằng — không quá cao, không quá thấp. Đây là ngày lý tưởng để làm những việc cần sự tỉ mỉ, kiên nhẫn như học kỹ năng mới, review tài liệu hay dọn dẹp inbox.`;
    luckyColor = "Trắng hoặc xanh lá nhạt";
    avoidAction = "Không cần tránh nhiều — giữ nhịp độ đều là được";
  }

  return { score, status, statusLabel, statusColor, headline, detail, luckyColor, avoidAction };
}

// ─── Lunar to Solar Conversion ────────────────────────────────
// Duyệt từ đầu tháng âm lịch để tìm ngày dương lịch tương ứng
export function lunarToSolar(
  lunarDay: number, lunarMonth: number, lunarYear: number,
  isLeapMonth = false
): { day:number; month:number; year:number } | null {
  // Search around the lunar year - start from Jan of that year
  const startSolar = { day:1, month:1, year: lunarYear };
  const endYear = lunarYear + 1;

  for (let y = lunarYear - 1; y <= endYear; y++) {
    for (let m = 1; m <= 12; m++) {
      // Days in this solar month
      const daysInMonth = new Date(y, m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const lunar = solarToLunar(d, m, y);
        if (
          lunar.day === lunarDay &&
          lunar.month === lunarMonth &&
          lunar.year === lunarYear &&
          lunar.isLeapMonth === isLeapMonth
        ) {
          return { day:d, month:m, year:y };
        }
      }
    }
  }
  return null;
}
