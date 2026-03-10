// ============================================================
// lunar.ts — Huyền Cơ Các: Core Lunar Calendar Logic
// ============================================================

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  yearElement: string;
  yearElementName: string;
}

export interface UserProfile {
  birthYear: number;
  canChiYear: string;
  element: string;
  elementName: string;
  destinyName: string;
  shopeeProduct: ShopeeProduct;
}

export interface ShopeeProduct {
  name: string;
  description: string;
  url: string;
  emoji: string;
}

// ─── Can & Chi Arrays ────────────────────────────────────────
const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

// ─── Ngũ Hành (5 Elements) ───────────────────────────────────
// Based on Can Chi of year → Nạp Âm (60-year cycle destiny)
const DESTINY_TABLE: Record<string, { element: string; elementName: string; destinyName: string }> = {
  "Giáp Tý":   { element: "kim",  elementName: "Kim",  destinyName: "Hải Trung Kim (Vàng trong biển)" },
  "Ất Sửu":    { element: "kim",  elementName: "Kim",  destinyName: "Hải Trung Kim (Vàng trong biển)" },
  "Bính Dần":  { element: "hoa",  elementName: "Hỏa",  destinyName: "Lư Trung Hỏa (Lửa trong lò)" },
  "Đinh Mão":  { element: "hoa",  elementName: "Hỏa",  destinyName: "Lư Trung Hỏa (Lửa trong lò)" },
  "Mậu Thìn":  { element: "moc",  elementName: "Mộc",  destinyName: "Đại Lâm Mộc (Rừng cây lớn)" },
  "Kỷ Tỵ":     { element: "moc",  elementName: "Mộc",  destinyName: "Đại Lâm Mộc (Rừng cây lớn)" },
  "Canh Ngọ":  { element: "tho",  elementName: "Thổ",  destinyName: "Lộ Bàng Thổ (Đất ven đường)" },
  "Tân Mùi":   { element: "tho",  elementName: "Thổ",  destinyName: "Lộ Bàng Thổ (Đất ven đường)" },
  "Nhâm Thân": { element: "kim",  elementName: "Kim",  destinyName: "Kiếm Phong Kim (Vàng mũi kiếm)" },
  "Quý Dậu":   { element: "kim",  elementName: "Kim",  destinyName: "Kiếm Phong Kim (Vàng mũi kiếm)" },
  "Giáp Tuất": { element: "hoa",  elementName: "Hỏa",  destinyName: "Sơn Đầu Hỏa (Lửa đỉnh núi)" },
  "Ất Hợi":    { element: "hoa",  elementName: "Hỏa",  destinyName: "Sơn Đầu Hỏa (Lửa đỉnh núi)" },
  "Bính Tý":   { element: "thuy", elementName: "Thủy", destinyName: "Giản Hạ Thủy (Nước suối nhỏ)" },
  "Đinh Sửu":  { element: "thuy", elementName: "Thủy", destinyName: "Giản Hạ Thủy (Nước suối nhỏ)" },
  "Mậu Dần":   { element: "tho",  elementName: "Thổ",  destinyName: "Thành Đầu Thổ (Đất đầu thành)" },
  "Kỷ Mão":    { element: "tho",  elementName: "Thổ",  destinyName: "Thành Đầu Thổ (Đất đầu thành)" },
  "Canh Thìn":  { element: "kim",  elementName: "Kim",  destinyName: "Bạch Lạp Kim (Vàng cây nến)" },
  "Tân Tỵ":    { element: "kim",  elementName: "Kim",  destinyName: "Bạch Lạp Kim (Vàng cây nến)" },
  "Nhâm Ngọ":  { element: "moc",  elementName: "Mộc",  destinyName: "Dương Liễu Mộc (Cây liễu)" },
  "Quý Mùi":   { element: "moc",  elementName: "Mộc",  destinyName: "Dương Liễu Mộc (Cây liễu)" },
  "Giáp Thân": { element: "thuy", elementName: "Thủy", destinyName: "Tuyền Trung Thủy (Nước trong suối)" },
  "Ất Dậu":    { element: "thuy", elementName: "Thủy", destinyName: "Tuyền Trung Thủy (Nước trong suối)" },
  "Bính Tuất": { element: "tho",  elementName: "Thổ",  destinyName: "Ốc Thượng Thổ (Đất trên mái)" },
  "Đinh Hợi":  { element: "tho",  elementName: "Thổ",  destinyName: "Ốc Thượng Thổ (Đất trên mái)" },
  "Mậu Tý":    { element: "hoa",  elementName: "Hỏa",  destinyName: "Tích Lịch Hỏa (Sấm sét)" },
  "Kỷ Sửu":    { element: "hoa",  elementName: "Hỏa",  destinyName: "Tích Lịch Hỏa (Sấm sét)" },
  "Canh Dần":  { element: "moc",  elementName: "Mộc",  destinyName: "Tùng Bách Mộc (Cây tùng bách)" },
  "Tân Mão":   { element: "moc",  elementName: "Mộc",  destinyName: "Tùng Bách Mộc (Cây tùng bách)" },
  "Nhâm Thìn":  { element: "thuy", elementName: "Thủy", destinyName: "Trường Lưu Thủy (Nước sông dài)" },
  "Quý Tỵ":    { element: "thuy", elementName: "Thủy", destinyName: "Trường Lưu Thủy (Nước sông dài)" },
  "Giáp Ngọ":  { element: "kim",  elementName: "Kim",  destinyName: "Sa Trung Kim (Vàng trong cát)" },
  "Ất Mùi":    { element: "kim",  elementName: "Kim",  destinyName: "Sa Trung Kim (Vàng trong cát)" },
  "Bính Thân": { element: "hoa",  elementName: "Hỏa",  destinyName: "Sơn Hạ Hỏa (Lửa dưới núi)" },
  "Đinh Dậu":  { element: "hoa",  elementName: "Hỏa",  destinyName: "Sơn Hạ Hỏa (Lửa dưới núi)" },
  "Mậu Tuất":  { element: "moc",  elementName: "Mộc",  destinyName: "Bình Địa Mộc (Cây đất bằng)" },
  "Kỷ Hợi":    { element: "moc",  elementName: "Mộc",  destinyName: "Bình Địa Mộc (Cây đất bằng)" },
  "Canh Tý":   { element: "tho",  elementName: "Thổ",  destinyName: "Bích Thượng Thổ (Đất trên vách)" },
  "Tân Sửu":   { element: "tho",  elementName: "Thổ",  destinyName: "Bích Thượng Thổ (Đất trên vách)" },
  "Nhâm Dần":  { element: "kim",  elementName: "Kim",  destinyName: "Kim Bạch Kim (Vàng ròng)" },
  "Quý Mão":   { element: "kim",  elementName: "Kim",  destinyName: "Kim Bạch Kim (Vàng ròng)" },
  "Giáp Thìn":  { element: "hoa",  elementName: "Hỏa",  destinyName: "Phúc Đăng Hỏa (Lửa ngọn đèn)" },
  "Ất Tỵ":     { element: "hoa",  elementName: "Hỏa",  destinyName: "Phúc Đăng Hỏa (Lửa ngọn đèn)" },
  "Bính Ngọ":  { element: "thuy", elementName: "Thủy", destinyName: "Thiên Hà Thủy (Nước sông ngân)" },
  "Đinh Mùi":  { element: "thuy", elementName: "Thủy", destinyName: "Thiên Hà Thủy (Nước sông ngân)" },
  "Mậu Thân":  { element: "tho",  elementName: "Thổ",  destinyName: "Đại Dịch Thổ (Đất bờ rộng)" },
  "Kỷ Dậu":    { element: "tho",  elementName: "Thổ",  destinyName: "Đại Dịch Thổ (Đất bờ rộng)" },
  "Canh Tuất": { element: "kim",  elementName: "Kim",  destinyName: "Xuyến Xoa Kim (Vàng vòng hoa)" },
  "Tân Hợi":   { element: "kim",  elementName: "Kim",  destinyName: "Xuyến Xoa Kim (Vàng vòng hoa)" },
  "Nhâm Tý":   { element: "moc",  elementName: "Mộc",  destinyName: "Tang Chá Mộc (Cây dâu gốc)" },
  "Quý Sửu":   { element: "moc",  elementName: "Mộc",  destinyName: "Tang Chá Mộc (Cây dâu gốc)" },
  "Giáp Dần":  { element: "thuy", elementName: "Thủy", destinyName: "Đại Khê Thủy (Nước khe lớn)" },
  "Ất Mão":    { element: "thuy", elementName: "Thủy", destinyName: "Đại Khê Thủy (Nước khe lớn)" },
  "Bính Thìn":  { element: "tho",  elementName: "Thổ",  destinyName: "Sa Trung Thổ (Đất trong cát)" },
  "Đinh Tỵ":   { element: "tho",  elementName: "Thổ",  destinyName: "Sa Trung Thổ (Đất trong cát)" },
  "Mậu Ngọ":   { element: "hoa",  elementName: "Hỏa",  destinyName: "Thiên Thượng Hỏa (Lửa trên trời)" },
  "Kỷ Mùi":    { element: "hoa",  elementName: "Hỏa",  destinyName: "Thiên Thượng Hỏa (Lửa trên trời)" },
  "Canh Thân": { element: "moc",  elementName: "Mộc",  destinyName: "Thạch Lựu Mộc (Cây lựu đá)" },
  "Tân Dậu":   { element: "moc",  elementName: "Mộc",  destinyName: "Thạch Lựu Mộc (Cây lựu đá)" },
  "Nhâm Tuất": { element: "thuy", elementName: "Thủy", destinyName: "Đại Hải Thủy (Nước biển lớn)" },
  "Quý Hợi":   { element: "thuy", elementName: "Thủy", destinyName: "Đại Hải Thủy (Nước biển lớn)" },
};

// ─── Shopee Affiliate Products by Element ────────────────────
const SHOPEE_PRODUCTS: Record<string, ShopeeProduct> = {
  kim: {
    name: "Vòng Thạch Anh Trắng Mệnh Kim",
    description: "Thạch anh trắng tăng cường năng lượng Kim, thu hút tài lộc và thanh lọc không khí xung quanh bạn.",
    emoji: "💎",
    url: "https://shopee.vn/search?keyword=vong+thach+anh+trang+menh+kim",
  },
  moc: {
    name: "Vòng Mắt Hổ Mệnh Mộc",
    description: "Đá mắt hổ tự nhiên giúp tăng sự tự tin, kiên định và bảo vệ bạn khỏi những năng lượng tiêu cực.",
    emoji: "🟡",
    url: "https://shopee.vn/search?keyword=vong+mat+ho+menh+moc",
  },
  thuy: {
    name: "Vòng Aquamarine Xanh Mệnh Thủy",
    description: "Aquamarine xanh biển giúp tâm trí bình yên, cải thiện giao tiếp và tăng cường trực giác nhạy bén.",
    emoji: "🩵",
    url: "https://shopee.vn/search?keyword=vong+aquamarine+xanh+menh+thuy",
  },
  hoa: {
    name: "Vòng Mã Não Đỏ Mệnh Hỏa",
    description: "Mã não đỏ rực là viên đá của đam mê và năng lượng, giúp bạn bùng cháy nhiệt huyết mỗi ngày.",
    emoji: "🔴",
    url: "https://shopee.vn/search?keyword=vong+ma+nao+do+menh+hoa",
  },
  tho: {
    name: "Vòng Thạch Anh Tím Mệnh Thổ",
    description: "Thạch anh tím giúp bạn vừa vững chắc như đất, vừa có trực giác sâu sắc để đưa ra quyết định khôn ngoan.",
    emoji: "💜",
    url: "https://shopee.vn/search?keyword=vong+thach+anh+tim+menh+tho",
  },
};

// ─── Core Conversion Functions ────────────────────────────────

/**
 * Convert Solar date to Julian Day Number
 */
export function toJDN(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jdn < 2299161) {
    jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jdn;
}

/**
 * Calculate New Moon (index k) using JDE (Julian Ephemeris Day)
 */
function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jde =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = (359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3) * dr;
  const Mpr = (306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3) * dr;
  const F = (21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3) * dr;
  let C1 =
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
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jde + C1 - deltat;
}

/**
 * Get Sun Longitude (degrees) for a given JDN
 */
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

function getNewMoonDay(k: number, timeZone: number): number {
  return Math.floor(newMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(year: number, timeZone: number): number {
  const off = toJDN(31, 12, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = Math.floor(sunLongitude(nm + 2415021.076 - 0.5) / 30);
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor(0.5 + (a11 - 2415021.076) / 29.530588853);
  let last = 0;
  let i = 1;
  let arc = Math.floor(sunLongitude(getNewMoonDay(k + i, timeZone) + 2415021.076 - 0.5) / 30);
  do {
    last = arc;
    i++;
    arc = Math.floor(sunLongitude(getNewMoonDay(k + i, timeZone) + 2415021.076 - 0.5) / 30);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Main function: Convert Solar date → Lunar date with Can Chi
 */
export function solarToLunar(day: number, month: number, year: number): LunarDate {
  const timeZone = 7; // Vietnam UTC+7
  const dayNumber = toJDN(day, month, year) - 2415021;
  const k = Math.floor((dayNumber - 0.5) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

  let a11 = getLunarMonth11(year, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, timeZone);
  } else {
    lunarYear = year + 1;
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let isLeapMonth = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) isLeapMonth = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth,
    canChiDay: getCanChiDay(dayNumber + 2415021),
    canChiMonth: getCanChiMonth(lunarMonth, lunarYear),
    canChiYear: getCanChiYear(lunarYear),
    yearElement: getElementFromYear(lunarYear),
    yearElementName: getElementNameFromYear(lunarYear),
  };
}

// ─── Can Chi Calculations ─────────────────────────────────────

export function getCanChiYear(year: number): string {
  const can = CAN[(year + 6) % 10];
  const chi = CHI[(year + 8) % 12];
  return `${can} ${chi}`;
}

export function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
  const canIndex = (lunarYear * 12 + lunarMonth + 3) % 10;
  const can = CAN[canIndex < 0 ? canIndex + 10 : canIndex];
  const chi = CHI[(lunarMonth + 0) % 12];
  return `${can} ${chi}`;
}

export function getCanChiDay(jdn: number): string {
  const can = CAN[(jdn + 9) % 10];
  const chi = CHI[(jdn + 1) % 12];
  return `${can} ${chi}`;
}

// ─── Element (Ngũ Hành) Helpers ───────────────────────────────

export function getElementFromYear(year: number): string {
  const canChi = getCanChiYear(year);
  return DESTINY_TABLE[canChi]?.element ?? "tho";
}

export function getElementNameFromYear(year: number): string {
  const canChi = getCanChiYear(year);
  return DESTINY_TABLE[canChi]?.elementName ?? "Thổ";
}

export function getDestinyFromYear(year: number): { element: string; elementName: string; destinyName: string } {
  const canChi = getCanChiYear(year);
  return (
    DESTINY_TABLE[canChi] ?? {
      element: "tho",
      elementName: "Thổ",
      destinyName: "Bình Địa Mộc — Tự nhiên, vững chắc",
    }
  );
}