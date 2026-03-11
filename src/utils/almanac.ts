// ============================================================
// almanac.ts — Lịch Vạn Niên (Powered by Lịch VN 2026 data)
// Dữ liệu thật từ lichvn.pak: 12 Trực, 114 Sao, 6 Ngày Xấu
// ============================================================

import { toJDN, solarToLunar, getCanChiDay } from "./astrology";
import {
  NGAY_TRUC, SAO_TOT_XAU, NHI_THAP_BAT_TU,
  type TrucInfo, type SaoInfo,
} from "../data/lichvn-data";

// ─── Types ───────────────────────────────────────────────────

export interface DayAnalysis {
  solarDate:    string;
  lunarDate:    string;
  canChiDay:    string;
  canChiMonth:  string;
  canChiYear:   string;
  truc:         TrucInfo;
  saoTot:       SaoInfo[];
  saoXau:       SaoInfo[];
  saoBatTu:     typeof NHI_THAP_BAT_TU[0];
  ngayXauList:  string[];
  rating: {
    xayDung:   number; // 1-5
    kinhDoanh: number;
    cuoiHoi:   number;
    anTang:    number;
    overall:   number;
  };
  summary: string;
  isTot:   boolean;
}

export interface AgeAnalysis {
  age:        number;
  kimLau:     boolean;
  hoangOc:    boolean;
  tamTai:     boolean;
  ketHon:     { good: boolean; reason: string };
  xayNha:     { good: boolean; reason: string };
  overall:    "tốt" | "trung bình" | "cần cúng giải" | "nên tránh";
  overallColor: string;
  tips:       string[];
}

// ─── Core Calculations ────────────────────────────────────────

function chiDayIdx(jdn: number): number {
  return ((jdn + 1) % 12 + 12) % 12;
}

function chiMonthIdx(lunarMonth: number): number {
  return ((lunarMonth + 1) % 12 + 12) % 12;
}

function getTruc(jdn: number, lunarMonth: number): TrucInfo {
  const idx = ((chiDayIdx(jdn) - chiMonthIdx(lunarMonth)) % 12 + 12) % 12;
  return NGAY_TRUC[idx] ?? NGAY_TRUC[0];
}

// 28 Sao — ref: JDN 2451549 (Jan 5 2000) = Sao Giác (idx 0)
const NTBT_REF_JDN = 2451549;
function getSaoBatTu(jdn: number) {
  const idx = ((jdn - NTBT_REF_JDN) % 28 + 28) % 28;
  return NHI_THAP_BAT_TU[idx];
}

function getSaosForDay(jdn: number, lunarMonth: number): { tot: SaoInfo[]; xau: SaoInfo[] } {
  const cc  = getCanChiDay(jdn);
  const can = cc.split(" ")[0];
  const chi = cc.split(" ")[1] ?? "";
  const mIdx = lunarMonth - 1;
  const tot: SaoInfo[] = [];
  const xau: SaoInfo[] = [];

  for (const sao of SAO_TOT_XAU) {
    const v = sao.byMonth[mIdx];
    if (!v) continue;
    if (v === can || v === chi || v === can + "_" + chi) {
      const avg = (sao.xayDung + sao.kinhDoanh + sao.cuoiHoi + sao.anTang) / 4;
      if (avg >= 3) tot.push(sao);
      else xau.push(sao);
    }
  }
  return { tot, xau };
}

const VANG_VONG: Record<number, string> = {
  1:"Dần",2:"Tỵ",3:"Thân",4:"Hợi",5:"Mão",6:"Ngọ",7:"Dậu",8:"Tý",9:"Thìn",10:"Mùi",11:"Tuất",12:"Sửu",
};
const SAT_CHU: Record<number, string> = {
  1:"Tỵ",2:"Tý",3:"Mùi",4:"Mão",5:"Thân",6:"Tuất",7:"Sửu",8:"Hợi",9:"Ngọ",10:"Dậu",11:"Dần",12:"Thìn",
};
const DUONG_CONG: Record<number, number[]> = {
  1:[13],2:[11],3:[9],4:[7],5:[5],6:[3],7:[8,29],8:[27],9:[25],10:[23],11:[21],12:[19],
};

function getNgayXau(lunarDay: number, lunarMonth: number, chi: string): string[] {
  const r: string[] = [];
  if ([5,14,23].includes(lunarDay))        r.push("Nguyệt Kỵ");
  if ([3,7,13,18,22,27].includes(lunarDay)) r.push("Tam Nương");
  if (DUONG_CONG[lunarMonth]?.includes(lunarDay)) r.push("Dương Công Kỵ");
  if (VANG_VONG[lunarMonth] === chi)       r.push("Vãng Vong");
  if (SAT_CHU[lunarMonth] === chi)         r.push("Sát Chủ");
  return r;
}

function calcRating(
  truc: TrucInfo, tot: SaoInfo[], xau: SaoInfo[],
  ngayXau: string[], batTu: typeof NHI_THAP_BAT_TU[0]
) {
  const calc = (f: "xayDung"|"kinhDoanh"|"cuoiHoi"|"anTang") => {
    let s = truc[f];
    for (const t of tot) s += (t[f] >= 5 ? 1 : 0);
    for (const x of xau) s = Math.max(0, s - 1);
    s = Math.max(0, s - ngayXau.length);
    if (batTu[f] >= 4) s += 1; else if (batTu[f] === 0) s = Math.max(0, s - 1);
    return Math.min(5, Math.max(1, Math.round(s / 2)));
  };
  const xayDung   = calc("xayDung");
  const kinhDoanh = calc("kinhDoanh");
  const cuoiHoi   = calc("cuoiHoi");
  const anTang    = calc("anTang");
  return { xayDung, kinhDoanh, cuoiHoi, anTang, overall: Math.round((xayDung+kinhDoanh+cuoiHoi+anTang)/4) };
}

// ─── Public API ───────────────────────────────────────────────

export function analyzeDayFull(day: number, month: number, year: number): DayAnalysis {
  const jdn   = toJDN(day, month, year);
  const lunar = solarToLunar(day, month, year);
  const cc    = getCanChiDay(jdn);
  const chi   = cc.split(" ")[1] ?? "";

  const truc     = getTruc(jdn, lunar.month);
  const { tot, xau } = getSaosForDay(jdn, lunar.month);
  const saoBatTu = getSaoBatTu(jdn);
  const ngayXau  = getNgayXau(lunar.day, lunar.month, chi);
  const rating   = calcRating(truc, tot, xau, ngayXau, saoBatTu);

  const isTot  = rating.overall >= 3 && ngayXau.length === 0;
  const label  = truc.dinhGia === "tốt" ? "ngày tốt" : truc.dinhGia === "xấu" ? "ngày xấu" : "ngày bình thường";
  let summary  = `Trực ${truc.ten} (${label})`;
  if (tot.length > 0) summary += ` · ${tot.slice(0,2).map(s=>s.name).join(", ")}`;
  if (ngayXau.length > 0) summary += ` · ⚠️ ${ngayXau.join(", ")}`;

  return {
    solarDate:   `${day}/${month}/${year}`,
    lunarDate:   `${lunar.day}/${lunar.month}${lunar.isLeapMonth?" nhuận":""} ${lunar.canChiYear}`,
    canChiDay:   cc,
    canChiMonth: lunar.canChiMonth,
    canChiYear:  lunar.canChiYear,
    truc, saoTot: tot, saoXau: xau, saoBatTu, ngayXauList: ngayXau, rating, summary, isTot,
  };
}

export function getGoodDaysInMonth(
  month: number, year: number,
  purpose: "xayDung"|"kinhDoanh"|"cuoiHoi"|"anTang"
): Array<{ day: number; info: DayAnalysis }> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Array<{ day: number; info: DayAnalysis }> = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const info = analyzeDayFull(d, month, year);
    if (info.rating[purpose] >= 3 && info.ngayXauList.length === 0) {
      result.push({ day: d, info });
    }
  }
  return result;
}

export function isKimLau(tuoi: number): boolean   { return [1,3,6,8].includes(tuoi % 10); }
export function isHoangOc(tuoi: number): boolean  { return [4,9].includes(tuoi % 10); }
export function isTamTai(birthYear: number, curYear: number): boolean {
  const diff = ((curYear + 8) % 12 - (birthYear + 8) % 12 + 12) % 12;
  return [0,1,2].includes(diff);
}

export function analyzeAge(birthYear: number, currentYear: number): AgeAnalysis {
  const age       = currentYear - birthYear + 1;
  const kimLau_   = isKimLau(age);
  const hoangOc_  = isHoangOc(age);
  const tamTai_   = isTamTai(birthYear, currentYear);
  const tips: string[] = [];
  let overall: AgeAnalysis["overall"] = "tốt";
  if (tamTai_)   { overall = "nên tránh"; tips.push("Năm Tam Tai — nên hoãn xây nhà và kết hôn"); }
  if (kimLau_)   { if (overall === "tốt") overall = "cần cúng giải"; tips.push("Tuổi Kim Lâu — cần cúng giải trước khi xây nhà"); }
  if (hoangOc_)  { if (overall === "tốt") overall = "cần cúng giải"; tips.push("Tuổi Hoàng Ốc — nên xem kỹ trước việc lớn"); }
  if (tips.length === 0) tips.push("Tuổi không có hạn lớn, thuận lợi");
  const colorMap: Record<string,string> = { "tốt":"#22c55e","trung bình":"#eab308","cần cúng giải":"#f97316","nên tránh":"#ef4444" };
  return {
    age, kimLau:kimLau_, hoangOc:hoangOc_, tamTai:tamTai_,
    ketHon: { good:!tamTai_&&!kimLau_, reason:tamTai_?"Năm Tam Tai":kimLau_?"Tuổi Kim Lâu":"Thuận lợi" },
    xayNha: { good:!tamTai_&&!kimLau_, reason:tamTai_?"Năm Tam Tai":kimLau_?"Tuổi Kim Lâu":"Thuận lợi" },
    overall, overallColor: colorMap[overall], tips,
  };
}
