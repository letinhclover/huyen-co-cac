// ============================================================
// almanac.ts — Lịch Vạn Niên Utilities
// Kim Lâu · Hoàng Ốc · Tam Tai · Ngày tốt/xấu · Đổi ngày
// ============================================================

import { solarToLunar, toJDN, getCanChiDay, getCanChiMonth, getCanChiYear, CAN, CHI } from "./astrology";

// ─── Types ───────────────────────────────────────────────────

export interface AgeAnalysis {
  age: number;
  kimLau:   boolean;
  hoangOc:  boolean;
  tamTai:   boolean;
  ketHon:   { good: boolean; reason: string };
  xayNha:   { good: boolean; reason: string };
  overall:  "tốt" | "trung bình" | "cần cúng giải" | "nên tránh";
  overallColor: string;
  tips: string[];
}

export interface DayInfo {
  solarDate:  string;
  lunarDate:  string;
  canChiDay:  string;
  canChiMonth: string;
  canChiYear: string;
  truc:       string;
  trucMeaning: string;
  goodFor:    string[];
  badFor:     string[];
  overallRating: 1 | 2 | 3 | 4 | 5;
  starCount:  number;
}

export interface DateConversion {
  solar: { day: number; month: number; year: number };
  lunar: { day: number; month: number; year: number; isLeap: boolean };
  canChiDay:   string;
  canChiMonth: string;
  canChiYear:  string;
  weekday:     string;
}

// ─── Kim Lâu (tuổi xấu cho xây nhà) ─────────────────────────
// Công thức: tuổi tính theo âm lịch, chia 10 lấy dư
// Dư 1, 3, 6, 8 → Kim Lâu (Đại hạn)

export function isKimLau(tuoi: number): boolean {
  const r = tuoi % 10;
  return [1, 3, 6, 8].includes(r);
}

// ─── Hoàng Ốc (tuổi cần cẩn thận khi xây) ───────────────────
// Dư 4, 9 → Hoàng Ốc

export function isHoangOc(tuoi: number): boolean {
  const r = tuoi % 10;
  return [4, 9].includes(r);
}

// ─── Tam Tai (3 năm hạn liên tiếp theo chi năm sinh) ─────────
// Tý-Thìn-Thân hại Dần-Ngọ-Tuất
// Sửu-Tỵ-Dậu hại Hợi-Mão-Mùi
// Dần-Ngọ-Tuất hại Tý-Thìn-Thân
// Hợi-Mão-Mùi hại Sửu-Tỵ-Dậu

const TAM_TAI_GROUPS: Record<number, number[]> = {
  0: [2, 6, 10], // Tý bị Tam Tai năm Dần, Ngọ, Tuất
  4: [2, 6, 10], // Thìn
  8: [2, 6, 10], // Thân
  2: [0, 4, 8],  // Dần bị Tam Tai năm Tý, Thìn, Thân
  6: [0, 4, 8],  // Ngọ
  10: [0, 4, 8], // Tuất
  1: [3, 7, 11], // Sửu bị năm Hợi, Mão, Mùi
  5: [3, 7, 11], // Tỵ
  9: [3, 7, 11], // Dậu
  3: [1, 5, 9],  // Dần bị Sửu, Tỵ, Dậu
  7: [1, 5, 9],  // Mùi
  11: [1, 5, 9], // Hợi
};

export function isTamTai(chiNamSinh: number, chiNamHienTai: number): boolean {
  const badYears = TAM_TAI_GROUPS[chiNamSinh] ?? [];
  return badYears.includes(chiNamHienTai);
}

// ─── Phân tích tuổi toàn diện ─────────────────────────────────

export function analyzeAge(
  birthYear: number,
  checkYear: number = new Date().getFullYear()
): AgeAnalysis {
  const age = checkYear - birthYear + 1; // tuổi âm lịch
  const chiNamSinh = (birthYear - 4) % 12;
  const chiNamHT   = (checkYear - 4) % 12;

  const kimLau  = isKimLau(age);
  const hoangOc = isHoangOc(age);
  const tamTai  = isTamTai(chiNamSinh, chiNamHT);

  // Kết hôn
  let ketHon = { good: true, reason: "Năm này phù hợp để kết hôn." };
  if (kimLau) {
    ketHon = { good: false, reason: "Tuổi Kim Lâu — nên chọn năm khác hoặc cúng giải trước khi làm lễ." };
  } else if (tamTai) {
    ketHon = { good: false, reason: "Đang trong vòng Tam Tai — nên đợi qua hoặc làm lễ giải hạn." };
  } else if (hoangOc) {
    ketHon = { good: true, reason: "Tuổi Hoàng Ốc — có thể kết hôn nhưng nên chọn ngày tốt kỹ càng." };
  }

  // Xây nhà
  let xayNha = { good: true, reason: "Năm này hợp để xây nhà hoặc mua nhà mới." };
  if (kimLau) {
    xayNha = { good: false, reason: "Tuổi Kim Lâu — không nên đứng tên xây nhà năm này." };
  } else if (hoangOc) {
    xayNha = { good: false, reason: "Tuổi Hoàng Ốc — nên nhờ người tuổi hợp đứng tên thay." };
  } else if (tamTai) {
    xayNha = { good: true, reason: "Tam Tai không ảnh hưởng trực tiếp đến xây nhà, nhưng nên chọn ngày khởi công kỹ." };
  }

  // Overall
  let overall: AgeAnalysis["overall"] = "tốt";
  let overallColor = "#16A34A";
  const tips: string[] = [];

  if (kimLau) {
    overall = "nên tránh";
    overallColor = "#DC2626";
    tips.push("Tuổi Kim Lâu: tránh khởi công việc lớn, xây nhà, kết hôn trong năm nay.");
    tips.push("Nếu bắt buộc, hãy nhờ thầy chọn ngày tốt và làm lễ cúng giải trước.");
  } else if (hoangOc && tamTai) {
    overall = "cần cúng giải";
    overallColor = "#D97706";
    tips.push("Vừa Hoàng Ốc vừa Tam Tai — nên làm lễ giải hạn đầu năm.");
    tips.push("Các việc lớn nên nhờ người tuổi hợp đứng ra thực hiện thay.");
  } else if (hoangOc) {
    overall = "cần cúng giải";
    overallColor = "#D97706";
    tips.push("Tuổi Hoàng Ốc: cẩn thận sức khỏe và tài chính.");
    tips.push("Việc xây nhà nên nhờ người tuổi khác đứng tên.");
  } else if (tamTai) {
    overall = "trung bình";
    overallColor = "#2563EB";
    tips.push("Tam Tai năm thứ " + (tamTai ? "này" : "?") + ": giữ thái độ bình tĩnh, tránh xung đột.");
    tips.push("Sức khỏe cần chú ý, tránh phẫu thuật không cần thiết.");
  } else {
    tips.push("Năm này khá thuận lợi để thực hiện các kế hoạch lớn.");
    tips.push("Vẫn nên chọn ngày tốt cho các việc quan trọng.");
  }

  return {
    age, kimLau, hoangOc, tamTai,
    ketHon, xayNha,
    overall, overallColor, tips,
  };
}

// ─── 12 Trực (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế) ──

const TRUC_LIST = ["Kiến","Trừ","Mãn","Bình","Định","Chấp","Phá","Nguy","Thành","Thu","Khai","Bế"];

const TRUC_DATA: Record<string, { meaning: string; good: string[]; bad: string[] }> = {
  "Kiến": {
    meaning: "Ngày xây dựng, thiết lập — tốt để khởi đầu.",
    good: ["Khai trương", "Ký hợp đồng", "Cưới hỏi", "Nhập học"],
    bad: ["Kiện tụng", "Phẫu thuật"],
  },
  "Trừ": {
    meaning: "Ngày trừ khử, dọn dẹp — tốt để loại bỏ cái cũ.",
    good: ["Dọn nhà", "Chia tay quan hệ xấu", "Cai nghiện", "Chữa bệnh"],
    bad: ["Kết hôn", "Khai trương", "Ký hợp đồng"],
  },
  "Mãn": {
    meaning: "Ngày đầy đủ, sung mãn — tốt cho hầu hết công việc.",
    good: ["Khai trương", "Mua sắm", "Hội họp", "Đầu tư"],
    bad: ["Tang lễ"],
  },
  "Bình": {
    meaning: "Ngày bình ổn, an lành — tốt cho các việc thường ngày.",
    good: ["Du lịch", "Gặp gỡ", "Học tập", "Sửa chữa"],
    bad: ["Khởi công", "Đám tang"],
  },
  "Định": {
    meaning: "Ngày ổn định, quyết định — tốt để chốt các việc quan trọng.",
    good: ["Ký kết", "Hôn lễ", "Khai trương", "Mua nhà"],
    bad: ["Xuất hành xa"],
  },
  "Chấp": {
    meaning: "Ngày nắm giữ, bền vững — tốt cho việc lâu dài.",
    good: ["Trồng cây", "Xây nhà", "Làm nông"],
    bad: ["Xuất hành", "Đầu tư mạo hiểm"],
  },
  "Phá": {
    meaning: "Ngày phá vỡ — nên tránh các việc quan trọng.",
    good: ["Phá dỡ nhà cũ", "Kết thúc hợp đồng"],
    bad: ["Khai trương", "Cưới hỏi", "Ký kết", "Mua sắm lớn"],
  },
  "Nguy": {
    meaning: "Ngày nguy hiểm — cẩn thận trong mọi việc.",
    good: ["Việc nhỏ thông thường"],
    bad: ["Đi xa", "Leo trèo", "Phẫu thuật", "Đầu tư"],
  },
  "Thành": {
    meaning: "Ngày thành công — cực kỳ tốt cho các khởi đầu.",
    good: ["Khai trương", "Cưới hỏi", "Ký hợp đồng", "Nhập học", "Ra mắt sản phẩm"],
    bad: ["Kiện tụng", "Khiếu nại"],
  },
  "Thu": {
    meaning: "Ngày thu hoạch — tốt để hoàn thành và nhận kết quả.",
    good: ["Thu tiền", "Nghiệm thu công trình", "Tổng kết"],
    bad: ["Khởi công mới", "Phẫu thuật"],
  },
  "Khai": {
    meaning: "Ngày khai mở — rất tốt để bắt đầu điều mới.",
    good: ["Khai trương", "Ra mắt", "Khởi công", "Nhập học", "Xuất hành"],
    bad: ["Tang lễ"],
  },
  "Bế": {
    meaning: "Ngày đóng lại — không tốt cho khởi đầu.",
    good: ["Chôn cất", "Kết thúc hợp đồng", "Đóng cửa hàng"],
    bad: ["Khai trương", "Cưới hỏi", "Đầu tư"],
  },
};

export function getTruc(jdn: number, lunarMonth: number): string {
  // Trực tính theo Can Chi ngày + tháng âm lịch
  const idx = (jdn + lunarMonth) % 12;
  return TRUC_LIST[idx] ?? "Kiến";
}

// ─── Rating ngày ──────────────────────────────────────────────

const GOOD_TRUC  = ["Thành", "Khai", "Định", "Mãn", "Kiến"];
const BAD_TRUC   = ["Phá", "Nguy", "Bế", "Trừ"];

function getDayRating(truc: string): 1 | 2 | 3 | 4 | 5 {
  if (["Thành", "Khai"].includes(truc))   return 5;
  if (GOOD_TRUC.includes(truc))           return 4;
  if (["Thu", "Chấp"].includes(truc))     return 3;
  if (["Trừ", "Bình"].includes(truc))     return 2;
  if (BAD_TRUC.includes(truc))            return 1;
  return 3;
}

// ─── Full day info ────────────────────────────────────────────

export function getDayInfo(day: number, month: number, year: number): DayInfo {
  const lunar      = solarToLunar(day, month, year);
  const jdn        = toJDN(day, month, year);
  const canChiDay  = getCanChiDay(jdn);
  const canChiM    = getCanChiMonth(month, year);
  const canChiY    = getCanChiYear(year);
  const truc       = getTruc(jdn, lunar.month);
  const trucData   = TRUC_DATA[truc] ?? TRUC_DATA["Bình"];
  const rating     = getDayRating(truc);

  const lunarStr = `${lunar.isLeapMonth ? "Nhuận " : ""}${lunar.day}/${lunar.month}`;

  return {
    solarDate:   `${day}/${month}/${year}`,
    lunarDate:   lunarStr,
    canChiDay,
    canChiMonth: canChiM,
    canChiYear:  canChiY,
    truc,
    trucMeaning: trucData.meaning,
    goodFor:     trucData.good,
    badFor:      trucData.bad,
    overallRating: rating,
    starCount:   rating,
  };
}

// ─── Đổi ngày dương → âm ─────────────────────────────────────

export function solarToLunarFull(day: number, month: number, year: number): DateConversion {
  const lunar   = solarToLunar(day, month, year);
  const jdn     = toJDN(day, month, year);
  const WEEKDAYS = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];

  return {
    solar:       { day, month, year },
    lunar:       { day: lunar.day, month: lunar.month, year: lunar.year, isLeap: lunar.isLeapMonth },
    canChiDay:   getCanChiDay(jdn),
    canChiMonth: getCanChiMonth(month, year),
    canChiYear:  getCanChiYear(year),
    weekday,
  };
}

// ─── Tìm ngày tốt trong tháng ────────────────────────────────

export function getGoodDaysInMonth(month: number, year: number): number[] {
  const days: number[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const info = getDayInfo(d, month, year);
    if (info.overallRating >= 4) days.push(d);
  }
  return days;
}

// ─── Các năm tốt gần nhất để xây nhà / kết hôn ───────────────

export function getGoodYears(
  birthYear: number,
  type: "xayNha" | "ketHon",
  fromYear = new Date().getFullYear(),
  count = 3
): number[] {
  const good: number[] = [];
  let y = fromYear;
  while (good.length < count) {
    const a = analyzeAge(birthYear, y);
    const ok = type === "xayNha" ? a.xayNha.good : a.ketHon.good;
    if (ok) good.push(y);
    y++;
  }
  return good;
}
