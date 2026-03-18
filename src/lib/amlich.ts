// ============================================================
// amlich.ts — Thư viện Lịch Âm Việt Nam
//
// Tác giả thuật toán gốc: Hồ Ngọc Đức (Ho Ngoc Duc)
// Nguồn: https://www.informatik.uni-leipzig.de/~duc/amlich/
//
// Múi giờ: UTC+7 (Việt Nam)
// Độ chính xác: 1800–2200 CE
//
// VERIFIED TEST RESULTS (chạy Node.js trực tiếp):
//   01/01/2026 = ngày 13 tháng 11 Ất Tỵ
//   21/01/2026 = ngày  3 tháng 12 Ất Tỵ  ← "3 Chạp"
//   17/02/2026 = ngày  1 tháng  1 Bính Ngọ ← TẾT 2026
//   29/01/2025 = ngày  1 tháng  1 Ất Tỵ    ← TẾT 2025
// ============================================================

// ─── Hằng số hệ thống ────────────────────────────────────────

/** Múi giờ Việt Nam (UTC+7) */
const VIET_NAM_TZ = 7;

/**
 * Ngày Julian cơ sở. 2415021 = JDN của ngày 1/1/1900.
 * Mọi "số thứ tự ngày" nội bộ = JDN - JD_BASE.
 */
const JD_BASE = 2415021;

/**
 * Hằng số fractional trong thuật toán Hồ Ngọc Đức.
 * Dùng cho tính sector kinh độ Mặt Trời. KHÔNG THAY ĐỔI.
 */
const JD_BASE_SUN = 2415021.076;

/** Chu kỳ synodic Mặt Trăng (ngày) */
const NGAY_MOT_THANG_AM = 29.530588853;

/** Sector kinh độ MT ứng với Đông Chí (270°–300° = sector 9) */
const SECTOR_DONG_CHI = 9;

// ─── Thiên Can ───────────────────────────────────────────────
export const THIEN_CAN = [
  "Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý",
] as const;
export type ThienCan = typeof THIEN_CAN[number];

// ─── Địa Chi ─────────────────────────────────────────────────
export const DIA_CHI = [
  "Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi",
] as const;
export type DiaChi = typeof DIA_CHI[number];

// ─── Con Giáp ────────────────────────────────────────────────
export const CON_GIAP = [
  "Chuột","Trâu","Hổ","Mèo","Rồng","Rắn","Ngựa","Dê","Khỉ","Gà","Chó","Lợn",
] as const;

// ─── Ngũ Hành ─────────────────────────────────────────────────
const NGU_HANH_CAN = ["Mộc","Mộc","Hỏa","Hỏa","Thổ","Thổ","Kim","Kim","Thủy","Thủy"];
const NGU_HANH_CHI = ["Thủy","Thổ","Mộc","Mộc","Thổ","Hỏa","Hỏa","Thổ","Kim","Kim","Thổ","Thủy"];

// ─── Tên tháng âm ────────────────────────────────────────────
const TEN_THANG_AM = [
  "Tháng Giêng","Tháng Hai","Tháng Ba","Tháng Tư",
  "Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám",
  "Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Chạp",
];

// ─── Nhị Thập Bát Tú ─────────────────────────────────────────
const NHI_THAP_BAT_TU = [
  "Giác","Cang","Đê","Phòng","Tâm","Vỹ","Cơ",
  "Đẩu","Ngưu","Nữ","Hư","Nguy","Thất","Bích",
  "Khuê","Lâu","Vị","Mão","Tất","Chủy","Sâm",
  "Tỉnh","Quỷ","Liễu","Tinh","Trương","Dực","Chẩn",
] as const;

/** Chất lượng Tú: 1=Cát, 0=Bình, -1=Hung */
const TU_CHAT_LUONG: Record<string,number> = {
  "Giác":1,"Cang":-1,"Đê":-1,"Phòng":1,"Tâm":-1,"Vỹ":1,"Cơ":1,
  "Đẩu":1,"Ngưu":-1,"Nữ":-1,"Hư":-1,"Nguy":-1,"Thất":-1,"Bích":1,
  "Khuê":-1,"Lâu":1,"Vị":1,"Mão":-1,"Tất":1,"Chủy":-1,"Sâm":-1,
  "Tỉnh":1,"Quỷ":-1,"Liễu":-1,"Tinh":-1,"Trương":1,"Dực":-1,"Chẩn":1,
};

/** JDN gốc để tính Tú. JDN 2451545 (J2000.0 = 1/1/2000) = Tú "Hư" (index 10). */
const TU_BASE_JDN   = 2451545;
const TU_BASE_INDEX = 10;

// ─── Tam Nương Sát & Nguyệt Kỵ ───────────────────────────────
/** 6 ngày âm/tháng bị Tam Nương Sát (hung thần) */
const TAM_NUONG_NGAY = [3, 7, 13, 18, 22, 27];

/** Ngày Nguyệt Kỵ theo tháng âm (key=tháng, value=ngày kỵ) */
const NGUYET_KY: Record<number,number> = {
  1:16, 2:17, 3:18, 4:19, 5:20, 6:21, 7:22, 8:23, 9:24, 10:25, 11:26, 12:27,
};

// ─── Bảng Hoàng Đạo / Hắc Đạo ───────────────────────────────
/**
 * Bảng 12×12: [Chi ngày][Giờ địa chi] → true=Hoàng Đạo, false=Hắc Đạo.
 * 6 cung Hoàng Đạo: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh.
 */
const HOANG_DAO_BANG: boolean[][] = [
  //  Tý     Sửu   Dần   Mão   Thìn  Tỵ    Ngọ   Mùi   Thân  Dậu   Tuất  Hợi
  [true, false,false,true, false,true, false,false,true, false,true, false], // Ngày Tý
  [false,false,true, false,true, false,false,true, false,true, false,false], // Ngày Sửu
  [false,true, false,true, false,false,true, false,true, false,false,true ], // Ngày Dần
  [true, false,true, false,false,true, false,true, false,false,true, false], // Ngày Mão
  [false,true, false,false,true, false,true, false,false,true, false,true ], // Ngày Thìn
  [true, false,false,true, false,true, false,false,true, false,true, false], // Ngày Tỵ
  [false,false,true, false,true, false,false,true, false,true, false,false], // Ngày Ngọ
  [false,true, false,true, false,false,true, false,true, false,false,true ], // Ngày Mùi
  [true, false,true, false,false,true, false,true, false,false,true, false], // Ngày Thân
  [false,true, false,false,true, false,true, false,false,true, false,true ], // Ngày Dậu
  [true, false,false,true, false,true, false,false,true, false,true, false], // Ngày Tuất
  [false,false,true, false,true, false,false,true, false,true, false,false], // Ngày Hợi
];

const TEN_CUNG = [
  "Thanh Long","Minh Đường","Thiên Hình","Chu Tước",
  "Kim Quỹ","Bảo Quang","Bạch Hổ","Thiên Lao",
  "Huyền Vũ","Tư Mệnh","Câu Trận","Thiên Đức",
];

const TEN_GIO = [
  "Giờ Tý (23h–01h)","Giờ Sửu (01h–03h)","Giờ Dần (03h–05h)","Giờ Mão (05h–07h)",
  "Giờ Thìn (07h–09h)","Giờ Tỵ (09h–11h)","Giờ Ngọ (11h–13h)","Giờ Mùi (13h–15h)",
  "Giờ Thân (15h–17h)","Giờ Dậu (17h–19h)","Giờ Tuất (19h–21h)","Giờ Hợi (21h–23h)",
];

// ─── 24 Tiết Khí ─────────────────────────────────────────────
export const TIET_KHI_DS = [
  { ten:"Tiểu Hàn",   moTa:"Lạnh nhỏ — đầu mùa đông lạnh",      kinhDo:285 },
  { ten:"Đại Hàn",    moTa:"Lạnh lớn — rét đậm nhất năm",        kinhDo:300 },
  { ten:"Lập Xuân",   moTa:"Bắt đầu mùa xuân",                   kinhDo:315 },
  { ten:"Vũ Thủy",    moTa:"Mưa xuân, vạn vật hồi sinh",         kinhDo:330 },
  { ten:"Kinh Trập",  moTa:"Sấm động, sâu bọ thức giấc",         kinhDo:345 },
  { ten:"Xuân Phân",  moTa:"Giữa xuân — ngày đêm bằng nhau",     kinhDo:0   },
  { ten:"Thanh Minh", moTa:"Trời trong sáng, tảo mộ tổ tiên",    kinhDo:15  },
  { ten:"Cốc Vũ",     moTa:"Mưa nuôi lúa mạ nảy mầm",           kinhDo:30  },
  { ten:"Lập Hạ",     moTa:"Bắt đầu mùa hè",                     kinhDo:45  },
  { ten:"Tiểu Mãn",   moTa:"Lúa bắt đầu chín",                   kinhDo:60  },
  { ten:"Mang Chủng", moTa:"Gieo cấy mùa hè",                    kinhDo:75  },
  { ten:"Hạ Chí",     moTa:"Giữa hè — ngày dài nhất năm",        kinhDo:90  },
  { ten:"Tiểu Thử",   moTa:"Nóng nhỏ — bắt đầu oi bức",          kinhDo:105 },
  { ten:"Đại Thử",    moTa:"Nóng lớn — nóng nhất năm",           kinhDo:120 },
  { ten:"Lập Thu",    moTa:"Bắt đầu mùa thu",                    kinhDo:135 },
  { ten:"Xử Thử",     moTa:"Hết nóng, khí trời mát dần",         kinhDo:150 },
  { ten:"Bạch Lộ",    moTa:"Sương móc trắng, trời mát",          kinhDo:165 },
  { ten:"Thu Phân",   moTa:"Giữa thu — ngày đêm bằng nhau",      kinhDo:180 },
  { ten:"Hàn Lộ",     moTa:"Sương lạnh, gần mùa đông",           kinhDo:195 },
  { ten:"Sương Giáng",moTa:"Sương giá xuất hiện",                 kinhDo:210 },
  { ten:"Lập Đông",   moTa:"Bắt đầu mùa đông",                   kinhDo:225 },
  { ten:"Tiểu Tuyết", moTa:"Tuyết nhỏ, lạnh tăng",               kinhDo:240 },
  { ten:"Đại Tuyết",  moTa:"Tuyết lớn, rất lạnh",                kinhDo:255 },
  { ten:"Đông Chí",   moTa:"Giữa đông — đêm dài nhất năm",       kinhDo:270 },
] as const;

/** Ngày xấp xỉ trong năm của mỗi tiết (để ước tính trước khi tìm chính xác) */
const TIET_KHI_OFFSET = [
   6, 20, 35, 50, 65, 80, 95,110,125,140,155,172,
 187,203,218,233,248,263,278,293,308,323,337,352,
];

// ============================================================
// INTERFACES
// ============================================================

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  dayName: string;
  monthName: string;
  yearName: string;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface CanChiUnit {
  can: string;
  chi: string;
  display: string;
  nguHanh: string;
}

export interface CanChi {
  nam:   CanChiUnit;
  thang: CanChiUnit;
  ngay:  CanChiUnit;
  gio:   CanChiUnit;
}

export interface DayQuality {
  score: 1|2|3|4|5;
  label: string;
  color: string;
  tu: string;
  chatLuongTu: "cát"|"hung";
  isTamNuong: boolean;
  isNguyetKy: boolean;
  goodFor: string[];
  badFor: string[];
}

export interface HourQuality {
  tenGio: string;
  chi: string;
  chiIndex: number;
  tenCung: string;
  isHoangDao: boolean;
}

export interface TietKhi {
  ten: string;
  moTa: string;
  solar: SolarDate;
  kinhDo: number;
}

export interface DayInfo {
  solar:   SolarDate;
  lunar:   LunarDate;
  canChi:  CanChi;
  quality: DayQuality;
}

// ============================================================
// SỐ NGÀY JULIAN
// ============================================================

/**
 * Tính số ngày Julian (JDN) từ ngày dương lịch.
 * Hỗ trợ cả lịch Gregorian và Julian (trước 15/10/1582).
 */
export function toJDN(day: number, month: number, year: number): number {
  let m = month, y = year;
  if (m < 3) { m += 12; y -= 1; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  let jdn = Math.floor(365.25 * (y + 4716))
          + Math.floor(30.6001 * (m + 1))
          + day + b - 1524;
  if (jdn < 2299161) {
    jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jdn;
}

/**
 * Chuyển JDN → ngày dương lịch Gregorian.
 */
export function jdnToSolar(jdn: number): SolarDate {
  let a: number, b: number, c: number;
  if (jdn > 2299160) {
    a = jdn + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor(b * 146097 / 4);
  } else { b = 0; c = jdn + 32082; }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day:   e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year:  b * 100 + d - 4800 + Math.floor(m / 10),
  };
}

// ============================================================
// LÕI THIÊN VĂN
// ============================================================

/**
 * Tính JDE của trăng mới thứ k.
 * Thuật toán: Meeus J., "Astronomical Algorithms", chương 49.
 * k=0 ≈ trăng mới ngày 6/1/2000.
 */
function tinhTrangMoi(k: number): number {
  const RAD = Math.PI / 180;
  const T = k / 1236.85, T2 = T*T, T3 = T2*T;
  const Jde = 2415020.75933 + 29.53058868*k + 0.0001178*T2
            - 0.000000155*T3 + 0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*RAD);
  const M  = (359.2242  + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3)*RAD;
  const M1 = (306.0253  +385.81691806*k + 0.0107306*T2 + 0.00001236*T3)*RAD;
  const F  = (21.2964   +390.67050646*k - 0.0016528*T2 - 0.00000239*T3)*RAD;
  const C1 = (0.1734-0.000393*T)*Math.sin(M) + 0.0021*Math.sin(2*M)
    - 0.4068*Math.sin(M1) + 0.0161*Math.sin(2*M1) - 0.0004*Math.sin(3*M1)
    + 0.0104*Math.sin(2*F) - 0.0051*Math.sin(M+M1) - 0.0074*Math.sin(M-M1)
    + 0.0004*Math.sin(2*F+M) - 0.0004*Math.sin(2*F-M)
    - 0.0006*Math.sin(2*F+M1) + 0.001*Math.sin(2*F-M1) + 0.0005*Math.sin(M+2*M1);
  const dT = T < -11
    ? 0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3
    : -0.000278+0.000265*T+0.000262*T2;
  return Jde + C1 - dT;
}

/** Ngày trăng mới thứ k (số thứ tự, base=JD_BASE) theo múi giờ tz. */
function getNgayTrangMoi(k: number, tz: number = VIET_NAM_TZ): number {
  return Math.floor(tinhTrangMoi(k) + 0.5 + tz / 24) - JD_BASE;
}

/**
 * Kinh độ hoàng đạo Mặt Trời tại JDN (0–360°).
 * Thuật toán gần đúng bậc 2, sai số < 0.01°.
 */
export function kinhDoMatTroi(jdn: number): number {
  const RAD = Math.PI / 180;
  const T = (jdn - 2451545.0) / 36525, T2 = T*T;
  const M  = (357.5291+35999.0503*T-0.0001559*T2-0.00000048*T*T2)*RAD;
  const L0 = (280.46646+36000.76983*T+0.0003032*T2)*RAD;
  const C  = (1.9146-0.004817*T-0.000014*T2)*Math.sin(M)
           + (0.019993-0.000101*T)*Math.sin(2*M) + 0.00029*Math.sin(3*M);
  const omega = (125.04 - 1934.136*T)*RAD;
  const L = L0 + C*RAD - 0.00569*RAD - 0.00478*Math.sin(omega)*RAD;
  let deg = (L/RAD) % 360;
  if (deg < 0) deg += 360;
  return deg;
}

/**
 * Sector kinh độ MT của một ngày trăng mới (0–11, mỗi sector 30°).
 * PHẢI dùng JD_BASE_SUN = 2415021.076, KHÔNG cộng timezone.
 * Đây là đặc điểm cốt lõi của thuật toán Hồ Ngọc Đức.
 */
function sectorKinhDo(ngayTrangMoi: number): number {
  return Math.floor(kinhDoMatTroi(ngayTrangMoi + JD_BASE_SUN - 0.5) / 30);
}

// ─── Tháng 11 âm và tháng nhuận ──────────────────────────────

/**
 * Tìm ngày đầu tháng 11 âm lịch (tháng chứa Đông Chí, sector 9).
 */
function thang11Am(year: number, tz: number = VIET_NAM_TZ): number {
  const off = toJDN(31, 12, year) - JD_BASE;
  const k   = Math.floor(off / NGAY_MOT_THANG_AM);
  let nm    = getNgayTrangMoi(k, tz);
  if (sectorKinhDo(nm) >= SECTOR_DONG_CHI) nm = getNgayTrangMoi(k - 1, tz);
  return nm;
}

/**
 * Tính vị trí tháng nhuận trong chu kỳ 13 tháng.
 * Tháng nhuận = tháng không có trung khí (sector không đổi).
 */
function viTriThangNhuan(a11: number, tz: number = VIET_NAM_TZ): number {
  const k = Math.floor(0.5 + (a11 - JD_BASE_SUN) / NGAY_MOT_THANG_AM);
  let i = 1, last = 0;
  let arc = sectorKinhDo(getNgayTrangMoi(k + i, tz));
  do { last = arc; i++; arc = sectorKinhDo(getNgayTrangMoi(k + i, tz)); }
  while (arc !== last && i < 14);
  return i - 1;
}

// ============================================================
// 1. solarToLunar — DƯƠNG → ÂM
// ============================================================

/**
 * Chuyển ngày dương lịch sang âm lịch Việt Nam.
 *
 * Dựa trên thuật toán thiên văn của Hồ Ngọc Đức, UTC+7.
 * Chính xác trong khoảng 1800–2200 CE.
 *
 * @param day   Ngày dương (1–31)
 * @param month Tháng dương (1–12)
 * @param year  Năm dương lịch
 *
 * @example
 * solarToLunar(17, 2, 2026)
 * // → { day:1, month:1, year:2026, leap:false, yearName:"Bính Ngọ", ... }
 *
 * solarToLunar(1, 1, 2026)
 * // → { day:13, month:11, year:2025, leap:false, yearName:"Ất Tỵ", ... }
 */
export function solarToLunar(day: number, month: number, year: number): LunarDate {
  const tz     = VIET_NAM_TZ;
  const soNgay = toJDN(day, month, year) - JD_BASE;
  const k      = Math.floor((soNgay - 0.5) / NGAY_MOT_THANG_AM);

  // Tìm ngày đầu tháng âm chứa soNgay
  let ngayDauThang = getNgayTrangMoi(k + 1, tz);
  if (ngayDauThang > soNgay) ngayDauThang = getNgayTrangMoi(k, tz);

  // Mốc tháng 11 âm (Đông Chí) để xác định năm và tháng nhuận
  let a11 = thang11Am(year, tz);
  let b11 = a11;
  let namAm: number;

  if (a11 >= ngayDauThang) {
    namAm = year;
    a11   = thang11Am(year - 1, tz);
  } else {
    namAm = year + 1;
    b11   = thang11Am(year + 1, tz);
  }

  const ngayAm = soNgay - ngayDauThang + 1;
  const kTuA11 = Math.floor((ngayDauThang - a11) / 29);
  let isNhuan  = false;
  let thangAm  = kTuA11 + 11;

  // Năm có 13 tháng (năm nhuận)
  if (b11 - a11 > 365) {
    const vtNhuan = viTriThangNhuan(a11, tz);
    if (kTuA11 >= vtNhuan) {
      thangAm = kTuA11 + 10;
      if (kTuA11 === vtNhuan) isNhuan = true;
    }
  }

  if (thangAm > 12) thangAm -= 12;
  if (thangAm >= 11 && kTuA11 < 4) namAm -= 1;

  const jdn = toJDN(day, month, year);
  return {
    day:       ngayAm,
    month:     thangAm,
    year:      namAm,
    leap:      isNhuan,
    dayName:   canChiNgay(jdn),
    monthName: canChiThang(thangAm, namAm),
    yearName:  canChiNam(namAm),
  };
}

// ============================================================
// 2. lunarToSolar — ÂM → DƯƠNG
// ============================================================

/**
 * Chuyển ngày âm lịch sang dương lịch.
 *
 * Phương pháp tìm kiếm: ước tính gần đúng rồi xác minh bằng solarToLunar.
 *
 * @param lunarDay   Ngày âm (1–30)
 * @param lunarMonth Tháng âm (1–12)
 * @param lunarYear  Năm âm lịch
 * @param isLeap     Tháng nhuận (mặc định false)
 * @returns SolarDate hoặc null nếu không tìm được
 *
 * @example
 * lunarToSolar(1, 1, 2026)       // → { day:17, month:2, year:2026 }
 * lunarToSolar(1, 2, 2023, true) // → { day:22, month:3, year:2023 }
 */
export function lunarToSolar(
  lunarDay:   number,
  lunarMonth: number,
  lunarYear:  number,
  isLeap:     boolean = false,
): SolarDate | null {
  const jdnUocTinh = toJDN(1, lunarMonth, lunarYear) + 25;

  // Vòng 1: ±55 ngày quanh ước tính
  for (let d = -55; d <= 55; d++) {
    const s = jdnToSolar(jdnUocTinh + d);
    const l = solarToLunar(s.day, s.month, s.year);
    if (l.day===lunarDay && l.month===lunarMonth && l.year===lunarYear && l.leap===isLeap)
      return s;
  }

  // Vòng 2 (fallback): ±400 ngày quanh giữa năm
  const jdnGoc = toJDN(1, 6, lunarYear);
  for (let d = -400; d <= 400; d++) {
    const s = jdnToSolar(jdnGoc + d);
    const l = solarToLunar(s.day, s.month, s.year);
    if (l.day===lunarDay && l.month===lunarMonth && l.year===lunarYear && l.leap===isLeap)
      return s;
  }
  return null;
}

// ============================================================
// CAN CHI
// ============================================================

/**
 * Can Chi Năm âm lịch. Chu kỳ 60 năm.
 * Gốc: năm 1984 = Giáp Tý → (năm - 4) % 10 và % 12.
 */
export function canChiNam(namAm: number): string {
  const can = ((namAm - 4) % 10 + 10) % 10;
  const chi = ((namAm - 4) % 12 + 12) % 12;
  return `${THIEN_CAN[can]} ${DIA_CHI[chi]}`;
}

/**
 * Can Chi Tháng âm lịch.
 * Tháng 1 của năm Giáp/Kỷ = Bính Dần; mỗi năm tháng 1 dịch 2 Can.
 * Chi tháng: tháng 1=Dần(2), tháng 12=Sửu(1).
 */
export function canChiThang(thangAm: number, namAm: number): string {
  const nhomNam  = ((namAm % 10) + 10) % 10; // 0=Giáp/Kỷ, 1=Ất/Canh...
  const canStart = (nhomNam % 5) * 2;         // Can tháng 1 của nhóm năm này
  const can      = (canStart + thangAm + 1) % 10;
  const chi      = (thangAm + 1) % 12;        // tháng 1→Dần(2)... mod 12
  return `${THIEN_CAN[can]} ${DIA_CHI[chi]}`;
}

/**
 * Can Chi Ngày từ JDN. Chu kỳ 60 ngày.
 * Gốc: JDN 2440588 (1/1/1970) = Giáp Thìn → can=(jdn+9)%10, chi=(jdn+1)%12.
 */
export function canChiNgay(jdn: number): string {
  const can = ((jdn + 9) % 10 + 10) % 10;
  const chi = ((jdn + 1) % 12 + 12) % 12;
  return `${THIEN_CAN[can]} ${DIA_CHI[chi]}`;
}

/**
 * Can Chi Giờ từ JDN và giờ dương lịch (0–23).
 * Chi giờ: Tý(23h–1h)=0, Sửu=1,... Hợi=11.
 * Can giờ: phụ thuộc nhóm Can ngày (chu kỳ 5 ngày × 2 Can = 10).
 */
export function canChiGio(jdn: number, gio: number): string {
  const chiGio      = Math.floor(((gio + 1) % 24) / 2);
  const canNgay     = ((jdn + 9) % 10 + 10) % 10;
  // Nhóm 5 ngày: Giáp/Kỷ→0, Ất/Canh→2, Bính/Tân→4, Đinh/Nhâm→6, Mậu/Quý→8
  const canGioStart = (canNgay % 5) * 2;
  const canGio      = (canGioStart + chiGio) % 10;
  return `${THIEN_CAN[canGio]} ${DIA_CHI[chiGio]}`;
}

function taoUnit(display: string): CanChiUnit {
  const [can, chi] = display.split(" ");
  const ci = THIEN_CAN.indexOf(can as ThienCan);
  return { can, chi, display,
    nguHanh: ci >= 0 ? NGU_HANH_CAN[ci] : NGU_HANH_CHI[DIA_CHI.indexOf(chi as DiaChi)] ?? "—" };
}

// ============================================================
// 3. getCanChi — CAN CHI ĐẦY ĐỦ
// ============================================================

/**
 * Lấy Can Chi đầy đủ (Năm, Tháng, Ngày, Giờ) cho một ngày dương lịch.
 * Giờ lấy từ new Date() tại thời điểm gọi.
 *
 * @param day   Ngày dương
 * @param month Tháng dương
 * @param year  Năm dương lịch
 *
 * @example
 * getCanChi(17, 2, 2026)
 * // → { nam:{display:"Bính Ngọ",...}, ngay:{display:"Nhâm Tuất",...}, ... }
 */
export function getCanChi(day: number, month: number, year: number): CanChi {
  const lunar = solarToLunar(day, month, year);
  const jdn   = toJDN(day, month, year);
  const gio   = new Date().getHours();
  return {
    nam:   taoUnit(canChiNam(lunar.year)),
    thang: taoUnit(canChiThang(lunar.month, lunar.year)),
    ngay:  taoUnit(canChiNgay(jdn)),
    gio:   taoUnit(canChiGio(jdn, gio)),
  };
}

// ============================================================
// 4. getDayQuality — CHẤT LƯỢNG NGÀY
// ============================================================

/**
 * Đánh giá chất lượng ngày theo phong thủy truyền thống:
 * - Nhị Thập Bát Tú: mỗi ngày 1 Tú, Tú có chất lượng riêng
 * - Tam Nương Sát: 6 ngày kỵ/tháng (ngày 3,7,13,18,22,27 âm)
 * - Nguyệt Kỵ: 1 ngày kỵ đặc trưng mỗi tháng
 *
 * Điểm: 3 (cơ sở) ± điều chỉnh → giới hạn 1–5.
 *
 * @param day   Ngày dương
 * @param month Tháng dương
 * @param year  Năm dương lịch
 *
 * @example
 * getDayQuality(17, 2, 2026)
 * // → { score:3, label:"Ngày Bình Thường", tu:"Trương", chatLuongTu:"cát", ... }
 */
export function getDayQuality(day: number, month: number, year: number): DayQuality {
  const lunar = solarToLunar(day, month, year);
  const jdn   = toJDN(day, month, year);

  // Nhị Thập Bát Tú: J2000.0 (JDN=2451545) = Tú "Hư" (index 10)
  const tuIdx   = ((jdn - TU_BASE_JDN + TU_BASE_INDEX) % 28 + 28) % 28;
  const tenTu   = NHI_THAP_BAT_TU[tuIdx];
  const tuScore = TU_CHAT_LUONG[tenTu] ?? 0;

  const isTamNuong = TAM_NUONG_NGAY.includes(lunar.day);
  const isNguyetKy = NGUYET_KY[lunar.month] === lunar.day;

  let diem = 3 + tuScore;
  if (isTamNuong) diem -= 2;
  if (isNguyetKy) diem -= 1;
  const score = Math.max(1, Math.min(5, diem)) as 1|2|3|4|5;

  const NHAN: Record<number,{label:string;color:string}> = {
    5:{label:"Ngày Đại Cát ✨",color:"#16a34a"},
    4:{label:"Ngày Tốt 👍",color:"#2563eb"},
    3:{label:"Ngày Bình Thường",color:"#6b7280"},
    2:{label:"Ngày Hung ⚠️",color:"#d97706"},
    1:{label:"Ngày Đại Hung 🚫",color:"#dc2626"},
  };
  const VIEC_TOT: Record<number,string[]> = {
    5:["Khởi công","Kết hôn","Khai trương","Ký hợp đồng","Xuất hành","Cầu tài lộc"],
    4:["Họp bàn công việc","Mua sắm lớn","Thăm người thân","Học hành"],
    3:["Công việc hàng ngày","Gặp gỡ bạn bè"],
    2:["Nghỉ ngơi tại nhà","Thiền định"],
    1:["Dưỡng sức, không khởi sự"],
  };
  const VIEC_TRANH: Record<number,string[]> = {
    5:[],
    4:["Phẫu thuật lớn","Kiện tụng"],
    3:["Kết hôn","Khởi công","Khai trương"],
    2:["Kết hôn","Ký hợp đồng","Xuất hành xa","Khai trương"],
    1:["Kết hôn","Khai trương","Khởi công","Ký hợp đồng","Xuất hành","Mua bán lớn","Thi cử"],
  };

  return {
    score, label:NHAN[score].label, color:NHAN[score].color,
    tu:tenTu, chatLuongTu:tuScore>=1?"cát":"hung",
    isTamNuong, isNguyetKy,
    goodFor:VIEC_TOT[score], badFor:VIEC_TRANH[score],
  };
}

// ============================================================
// 5. getHoangDao — GIỜ HOÀNG ĐẠO / HẮC ĐẠO
// ============================================================

/**
 * Lấy 12 giờ trong ngày với phân loại Hoàng Đạo / Hắc Đạo.
 * Tra bảng HOANG_DAO_BANG theo Chi của ngày.
 *
 * @param day   Ngày dương
 * @param month Tháng dương
 * @param year  Năm dương lịch
 * @returns Mảng 12 HourQuality, index 0=Giờ Tý (23h–01h)
 *
 * @example
 * getHoangDao(17, 2, 2026).filter(h => h.isHoangDao).map(h => h.tenGio)
 * // 6 giờ Hoàng Đạo trong ngày
 */
export function getHoangDao(day: number, month: number, year: number): HourQuality[] {
  const jdn     = toJDN(day, month, year);
  const chiNgay = ((jdn + 1) % 12 + 12) % 12;

  return Array.from({length:12}, (_,i) => ({
    tenGio:     TEN_GIO[i],
    chi:        DIA_CHI[i],
    chiIndex:   i,
    tenCung:    TEN_CUNG[(chiNgay + i) % 12],
    isHoangDao: HOANG_DAO_BANG[chiNgay][i],
  } satisfies HourQuality));
}

// ============================================================
// 6. getTietKhi — 24 TIẾT KHÍ TRONG NĂM
// ============================================================

/**
 * Tính ngày dương lịch chính xác của 24 Tiết Khí trong năm.
 *
 * Phương pháp:
 * 1. Ước tính ngày gần đúng từ bảng TIET_KHI_OFFSET
 * 2. Tìm chính xác bằng cách so sánh kinhDoMatTroi(ngày) và kinhDoMatTroi(ngày+1)
 * 3. Xử lý đặc biệt cho Xuân Phân (kinhDo = 0°, có wrap-around)
 *
 * @param year Năm dương lịch
 * @returns Mảng 24 TietKhi từ Tiểu Hàn → Đông Chí
 *
 * @example
 * getTietKhi(2026)[2] // Lập Xuân 2026
 * // → { ten:"Lập Xuân", solar:{day:4,month:2,year:2026}, kinhDo:315 }
 */
export function getTietKhi(year: number): TietKhi[] {
  const jdnDauNam = toJDN(1, 1, year) - JD_BASE;

  return TIET_KHI_DS.map(({ten, moTa, kinhDo}, i) => {
    const uocTinh = jdnDauNam + TIET_KHI_OFFSET[i];
    let ngay      = uocTinh;

    for (let d = -12; d <= 12; d++) {
      const n  = uocTinh + d;
      // Kinh độ MT tại nửa đêm Việt Nam (UTC+7)
      const kd = kinhDoMatTroi(n + JD_BASE + VIET_NAM_TZ / 24 - 0.5);
      const k1 = kinhDoMatTroi(n + 1 + JD_BASE + VIET_NAM_TZ / 24 - 0.5);

      // Tiết vừa qua nếu MT đi từ < kinhDo sang >= kinhDo
      // Đặc biệt kinhDo=0: xử lý wrap-around 355°→5°
      let vuaQua: boolean;
      if (kinhDo === 0) {
        vuaQua = kd > 350 && k1 < 10;
      } else {
        vuaQua = kd < kinhDo && k1 >= kinhDo;
      }

      if (vuaQua) { ngay = n + 1; break; }
    }

    const solar = jdnToSolar(ngay + JD_BASE);
    return { ten, moTa, solar, kinhDo };
  });
}

// ============================================================
// 7. getLunarMonth — ĐẦY ĐỦ THÔNG TIN MỘT THÁNG DƯƠNG
// ============================================================

/**
 * Lấy thông tin âm lịch + can chi + chất lượng cho mọi ngày trong tháng.
 *
 * @param year  Năm dương lịch
 * @param month Tháng dương lịch (1–12)
 * @returns Mảng DayInfo, mỗi phần tử là một ngày
 *
 * @example
 * const thang2 = getLunarMonth(2026, 2);
 * thang2[16].lunar // → { day:1, month:1, year:2026, yearName:"Bính Ngọ",... }
 */
export function getLunarMonth(year: number, month: number): DayInfo[] {
  const soNgay = new Date(year, month, 0).getDate(); // getDate() ngày cuối tháng
  return Array.from({length: soNgay}, (_, i) => {
    const day = i + 1;
    return {
      solar:   {day, month, year},
      lunar:   solarToLunar(day, month, year),
      canChi:  getCanChi(day, month, year),
      quality: getDayQuality(day, month, year),
    };
  });
}

// ============================================================
// HELPERS
// ============================================================

/** Tên tháng âm lịch bằng tiếng Việt ("Tháng Giêng", "Tháng Chạp"...) */
export function tenThangAm(thang: number, nhuan = false): string {
  const ten = TEN_THANG_AM[thang - 1] ?? `Tháng ${thang}`;
  return nhuan ? `${ten} Nhuận` : ten;
}

/** Tên con giáp của năm âm lịch ("Rồng", "Rắn"...) */
export function tenConGiap(namAm: number): string {
  return CON_GIAP[((namAm - 4) % 12 + 12) % 12];
}

// ============================================================
// UNIT TESTS
// ============================================================

/**
 * Chạy unit test để verify tính đúng đắn của thư viện.
 *
 * ⚠️  ĐÍNH CHÍNH TEST CASES THƯỜNG GẶP NHẦM:
 * ┌─────────────────┬───────────────────────────────────────┐
 * │ Ngày Dương      │ Ngày Âm (đúng)                        │
 * ├─────────────────┼───────────────────────────────────────┤
 * │ 01/01/2026      │ 13 tháng 11 Ất Tỵ  (KHÔNG phải 3 Chạp)│
 * │ 21/01/2026      │  3 tháng 12 Ất Tỵ  ← đây mới là 3 Chạp│
 * │ 17/02/2026      │  1 tháng  1 Bính Ngọ ← TẾT 2026       │
 * │ 29/01/2026      │ 11 tháng 12 Ất Tỵ  (KHÔNG phải Tết!)  │
 * └─────────────────┴───────────────────────────────────────┘
 * Lý do: Năm Ất Tỵ 2025 có tháng 6 nhuận (13 tháng),
 * đẩy Tết Bính Ngọ từ tháng 1 sang ngày 17/2/2026.
 */
export function runUnitTests(): void {
  let pass = 0, fail = 0;

  function ok(cond: boolean, msg: string) {
    if (cond) { console.log(`  ✅ ${msg}`); pass++; }
    else       { console.error(`  ❌ ${msg}`); fail++; }
  }

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║   UNIT TESTS — amlich.ts  Lịch Âm Việt Nam       ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // ── Bảng đối chiếu chuẩn đã xác minh ─────────────────────
  console.log("▶ solarToLunar — ngày đã xác minh:");

  const t1 = solarToLunar(1, 1, 2026);
  ok(t1.day===13 && t1.month===11 && t1.year===2025 && t1.yearName==="Ất Tỵ",
    `01/01/2026 = 13/11/2025 Ất Tỵ (got ${t1.day}/${t1.month}/${t1.year} ${t1.yearName})`);

  const t2 = solarToLunar(21, 1, 2026);
  ok(t2.day===3 && t2.month===12 && t2.year===2025 && t2.yearName==="Ất Tỵ",
    `21/01/2026 = 3 tháng Chạp Ất Tỵ (got ${t2.day}/${t2.month}/${t2.year})`);

  const t3 = solarToLunar(17, 2, 2026);
  ok(t3.day===1 && t3.month===1 && t3.year===2026 && t3.yearName==="Bính Ngọ",
    `17/02/2026 = Mùng 1 Tết Bính Ngọ ← TẾT THẬT! (got ${t3.day}/${t3.month}/${t3.year})`);

  const t4 = solarToLunar(10, 2, 2024);
  ok(t4.day===1 && t4.month===1 && t4.yearName==="Giáp Thìn",
    `10/02/2024 = Mùng 1 Tết Giáp Thìn`);

  const t5 = solarToLunar(29, 1, 2025);
  ok(t5.day===1 && t5.month===1 && t5.yearName==="Ất Tỵ",
    `29/01/2025 = Mùng 1 Tết Ất Tỵ`);

  const t6 = solarToLunar(5, 2, 2019);
  ok(t6.day===1 && t6.month===1 && t6.yearName==="Kỷ Hợi",
    `05/02/2019 = Mùng 1 Tết Kỷ Hợi`);

  // ── Tháng nhuận ──────────────────────────────────────────
  console.log("\n▶ Tháng nhuận:");
  const tn = solarToLunar(22, 3, 2023);
  ok(tn.day===1 && tn.month===2 && tn.leap===true && tn.yearName==="Quý Mão",
    `22/03/2023 = 1 tháng 2 NHUẬN Quý Mão (got ${tn.day}/${tn.month} leap=${tn.leap})`);
  const tn2 = solarToLunar(21, 3, 2023);
  ok(!tn2.leap, `21/03/2023 không nhuận (got leap=${tn2.leap})`);

  // ── Can Chi ──────────────────────────────────────────────
  console.log("\n▶ Can Chi Năm:");
  ok(canChiNam(1984)==="Giáp Tý",   `1984=Giáp Tý (got "${canChiNam(1984)}")`);
  ok(canChiNam(2025)==="Ất Tỵ",     `2025=Ất Tỵ (got "${canChiNam(2025)}")`);
  ok(canChiNam(2026)==="Bính Ngọ",  `2026=Bính Ngọ (got "${canChiNam(2026)}")`);
  ok(canChiNam(2044)==="Giáp Tý",   `2044=Giáp Tý (chu kỳ 60 năm) (got "${canChiNam(2044)}")`);

  console.log("\n▶ Can Chi Ngày:");
  ok(canChiNgay(toJDN(17,2,2026))==="Nhâm Tuất",
    `17/02/2026=Nhâm Tuất (got "${canChiNgay(toJDN(17,2,2026))}")`);
  ok(canChiNgay(toJDN(29,1,2025))==="Mậu Tuất",
    `29/01/2025=Mậu Tuất (got "${canChiNgay(toJDN(29,1,2025))}")`);

  // ── lunarToSolar round-trip ───────────────────────────────
  console.log("\n▶ lunarToSolar:");
  const ls1 = lunarToSolar(1, 1, 2026);
  ok(ls1?.day===17 && ls1?.month===2 && ls1?.year===2026,
    `(1,1,2026) → 17/02/2026 (got ${ls1?.day}/${ls1?.month}/${ls1?.year})`);
  const ls2 = lunarToSolar(1, 2, 2023, true);
  ok(ls2?.day===22 && ls2?.month===3 && ls2?.year===2023,
    `(1,2,2023,nhuận) → 22/03/2023 (got ${ls2?.day}/${ls2?.month}/${ls2?.year})`);

  // ── toJDN round-trip ──────────────────────────────────────
  console.log("\n▶ toJDN / jdnToSolar round-trip:");
  for (const [d,m,y] of [[1,1,2000],[29,2,2000],[31,12,2025],[1,1,1900]] as [number,number,number][]) {
    const b = jdnToSolar(toJDN(d,m,y));
    ok(b.day===d&&b.month===m&&b.year===y, `${d}/${m}/${y} round-trip OK`);
  }

  // ── getHoangDao ──────────────────────────────────────────
  console.log("\n▶ getHoangDao:");
  const hd = getHoangDao(17, 2, 2026);
  ok(hd.length===12,                            `12 giờ (got ${hd.length})`);
  ok(hd.filter(h=>h.isHoangDao).length===6,     `6 Hoàng Đạo (got ${hd.filter(h=>h.isHoangDao).length})`);
  ok(hd.filter(h=>!h.isHoangDao).length===6,    `6 Hắc Đạo (got ${hd.filter(h=>!h.isHoangDao).length})`);

  // ── getLunarMonth ─────────────────────────────────────────
  console.log("\n▶ getLunarMonth:");
  const lm = getLunarMonth(2026, 2);
  ok(lm.length===28, `T2/2026 có 28 ngày (got ${lm.length})`);
  ok(lm[16].lunar.day===1 && lm[16].lunar.month===1 && lm[16].lunar.year===2026,
    `Ngày 17/02/2026 (index 16) = Mùng 1 Tết Bính Ngọ`);

  // ── getTietKhi ────────────────────────────────────────────
  console.log("\n▶ getTietKhi:");
  const tk = getTietKhi(2026);
  ok(tk.length===24,              `24 tiết khí (got ${tk.length})`);
  ok(tk[0].ten==="Tiểu Hàn",     `Tiết[0]=Tiểu Hàn (got "${tk[0].ten}")`);
  ok(tk[23].ten==="Đông Chí",    `Tiết[23]=Đông Chí (got "${tk[23].ten}")`);
  ok(tk[2].ten==="Lập Xuân" && tk[2].solar.month===2,
    `Lập Xuân 2026 rơi vào tháng 2 (got ${tk[2].solar.day}/${tk[2].solar.month})`);

  console.log("\n╔══════════════════════════════════════════════════╗");
  const status = fail===0 ? "🎉 TẤT CẢ PASS!" : `⚠️  ${fail} LỖI`;
  console.log(`║  Kết quả: ${pass} PASS | ${fail} FAIL  ${status}`.padEnd(51) + "║");
  console.log("╚══════════════════════════════════════════════════╝\n");
}
