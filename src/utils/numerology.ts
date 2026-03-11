// ============================================================
// numerology.ts — Thần Số Học
// Life Path · Soul Urge · Expression · Personal Year
// ============================================================

export interface NumerologyProfile {
  lifePathNumber: number;
  lifePathInfo:   NumberInfo;
  personalYear:   number;
  personalYearInfo: NumberInfo;
  soulUrge:       number;
  soulUrgeInfo:   NumberInfo;
  birthDay:       number;
  birthDayInfo:   NumberInfo;
}

export interface NumberInfo {
  number:      number;
  title:       string;
  emoji:       string;
  keyword:     string;
  description: string;
  strengths:   string[];
  challenges:  string[];
  color:       string;
  colorHex:    string;
}

// ─── Reduce to single digit (giữ 11, 22, 33 là master numbers) ─

export function reduceNumber(n: number, keepMaster = true): number {
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) break;
    n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}

// ─── Life Path = tổng toàn bộ ngày tháng năm sinh ────────────

export function calcLifePath(day: number, month: number, year: number): number {
  const sum =
    reduceNumber(day, false) +
    reduceNumber(month, false) +
    reduceNumber(year, false);
  return reduceNumber(sum);
}

// ─── Soul Urge = nguyên âm trong tên (dùng ngày sinh thay thế) ─
// Vì không có tên, dùng ngày sinh (Birth Day number)

export function calcBirthDay(day: number): number {
  return reduceNumber(day);
}

// ─── Personal Year = Life Path + năm hiện tại ─────────────────

export function calcPersonalYear(day: number, month: number, currentYear: number): number {
  const yearSum = reduceNumber(currentYear, false);
  const sum = reduceNumber(day, false) + reduceNumber(month, false) + yearSum;
  return reduceNumber(sum);
}

// ─── Number database ──────────────────────────────────────────

const NUMBER_DB: Record<number, Omit<NumberInfo, "number">> = {
  1: {
    title: "Số 1 — Người Tiên Phong",
    emoji: "🦁",
    keyword: "Độc lập · Lãnh đạo · Sáng tạo",
    description: "Bạn sinh ra để dẫn đầu. Ý chí mạnh mẽ, luôn muốn tự mình quyết định và không thích bị kiểm soát. Tư duy độc lập là vũ khí lớn nhất của bạn.",
    strengths: ["Quyết đoán, dứt khoát", "Sáng tạo và đổi mới", "Tự tin vào bản thân", "Tinh thần tiên phong"],
    challenges: ["Dễ ích kỷ, không lắng nghe", "Cứng đầu khi bị phản đối", "Khó nhờ người khác giúp"],
    color: "Đỏ · Vàng kim",
    colorHex: "#F59E0B",
  },
  2: {
    title: "Số 2 — Người Hòa Giải",
    emoji: "🕊️",
    keyword: "Hợp tác · Nhạy cảm · Cân bằng",
    description: "Bạn là người giỏi lắng nghe và cảm nhận cảm xúc người khác. Thế mạnh nằm ở sự đồng cảm và khả năng kết nối người với người.",
    strengths: ["Nhạy cảm và tinh tế", "Giỏi hòa giải mâu thuẫn", "Trung thành trong tình cảm", "Làm việc nhóm rất tốt"],
    challenges: ["Thiếu quyết đoán", "Dễ bị ảnh hưởng bởi người khác", "Hay lo lắng quá mức"],
    color: "Xanh lam · Bạc",
    colorHex: "#60A5FA",
  },
  3: {
    title: "Số 3 — Người Sáng Tạo",
    emoji: "🎨",
    keyword: "Sáng tạo · Vui vẻ · Biểu đạt",
    description: "Bạn có tài năng thiên bẩm trong việc truyền đạt ý tưởng và truyền cảm hứng cho người xung quanh. Cuộc sống với bạn luôn màu sắc và đầy năng lượng.",
    strengths: ["Tài năng nghệ thuật và ngôn ngữ", "Lạc quan, hài hước", "Truyền cảm hứng tốt", "Xã giao rộng rãi"],
    challenges: ["Dễ phân tán, thiếu tập trung", "Hay nói nhiều hơn làm", "Tài chính không ổn định"],
    color: "Vàng · Cam",
    colorHex: "#F97316",
  },
  4: {
    title: "Số 4 — Người Xây Dựng",
    emoji: "🏗️",
    keyword: "Kỷ luật · Thực tế · Bền vững",
    description: "Bạn là nền tảng vững chắc của mọi tập thể. Chăm chỉ, có kỷ luật và luôn hoàn thành những gì đã cam kết — dù có khó khăn đến đâu.",
    strengths: ["Kỷ luật và kiên nhẫn", "Đáng tin cậy 100%", "Tư duy hệ thống, logic", "Xây dựng nền tảng bền vững"],
    challenges: ["Cứng nhắc, khó thay đổi", "Làm việc quá sức", "Khó thích nghi với bất ngờ"],
    color: "Xanh lá · Nâu đất",
    colorHex: "#16A34A",
  },
  5: {
    title: "Số 5 — Người Tự Do",
    emoji: "🦋",
    keyword: "Tự do · Phiêu lưu · Thay đổi",
    description: "Bạn sinh ra để khám phá. Thích trải nghiệm mới, ghét bị ràng buộc và luôn tìm kiếm sự kích thích. Sự linh hoạt là sức mạnh đặc biệt của bạn.",
    strengths: ["Thích nghi nhanh với thay đổi", "Tư duy linh hoạt", "Trải nghiệm phong phú", "Năng động và hấp dẫn"],
    challenges: ["Thiếu ổn định, dễ bỏ cuộc", "Khó cam kết lâu dài", "Hay tìm kiếm cảm giác mới liên tục"],
    color: "Xanh ngọc · Bạc hà",
    colorHex: "#06B6D4",
  },
  6: {
    title: "Số 6 — Người Chăm Sóc",
    emoji: "🌸",
    keyword: "Trách nhiệm · Tình yêu · Gia đình",
    description: "Trái tim bạn luôn hướng về người thân và cộng đồng. Bạn có khả năng tạo ra môi trường ấm áp, chữa lành cho mọi người xung quanh.",
    strengths: ["Tình yêu thương vô điều kiện", "Có trách nhiệm cao", "Giỏi giải quyết xung đột gia đình", "Tạo sự ổn định cho tập thể"],
    challenges: ["Hay hi sinh quá mức", "Dễ kiểm soát người thân", "Khó buông bỏ mọi thứ"],
    color: "Hồng · Xanh lá nhạt",
    colorHex: "#EC4899",
  },
  7: {
    title: "Số 7 — Người Tìm Kiếm",
    emoji: "🔭",
    keyword: "Trí tuệ · Tâm linh · Chiều sâu",
    description: "Bạn là người của tri thức và chiều sâu. Luôn đặt câu hỏi về bản chất của cuộc sống và tìm kiếm sự thật ẩn sau những điều bình thường.",
    strengths: ["Trí tuệ phân tích sắc bén", "Trực giác mạnh", "Độc lập trong tư duy", "Chuyên gia trong lĩnh vực sâu"],
    challenges: ["Hay sống trong đầu quá nhiều", "Khó mở lòng cảm xúc", "Cô đơn khi không được hiểu"],
    color: "Tím · Xanh navy",
    colorHex: "#7C3AED",
  },
  8: {
    title: "Số 8 — Người Quyền Lực",
    emoji: "👑",
    keyword: "Thành công · Vật chất · Quyền lực",
    description: "Bạn có khả năng hiếm có trong việc biến ý tưởng thành tiền bạc và quyền lực. Nhìn thấy cơ hội mà người khác bỏ qua là tài năng đặc trưng của bạn.",
    strengths: ["Tư duy kinh doanh bén nhạy", "Tham vọng và bền bỉ", "Lãnh đạo tự nhiên", "Khả năng phục hồi sau thất bại"],
    challenges: ["Quá tập trung vào vật chất", "Dễ kiêu ngạo khi thành công", "Bỏ bê cảm xúc và gia đình"],
    color: "Đen · Vàng kim",
    colorHex: "#D97706",
  },
  9: {
    title: "Số 9 — Người Nhân Từ",
    emoji: "🌍",
    keyword: "Nhân ái · Hoàn thiện · Buông bỏ",
    description: "Bạn là tổng hòa của tất cả các con số. Trái tim rộng lớn, luôn muốn đóng góp cho nhân loại và có khả năng nhìn thấy bức tranh toàn cảnh mà người khác không thấy.",
    strengths: ["Lòng từ bi sâu sắc", "Sáng tạo và nghệ thuật", "Hiểu biết rộng", "Truyền cảm hứng cho nhiều người"],
    challenges: ["Hay mang nặng cảm xúc người khác", "Khó buông bỏ quá khứ", "Mất định hướng khi không có mục tiêu lớn"],
    color: "Đỏ huyết · Vàng cam",
    colorHex: "#DC2626",
  },
  11: {
    title: "Số 11 — Nhà Tiên Tri",
    emoji: "⚡",
    keyword: "Trực giác · Cảm hứng · Tâm linh",
    description: "Số master 11 — bạn có kết nối đặc biệt với trực giác và thế giới tâm linh. Thường cảm nhận được điều gì đó trước khi nó xảy ra.",
    strengths: ["Trực giác cực kỳ nhạy bén", "Truyền cảm hứng tự nhiên", "Tầm nhìn xa", "Kết nối tâm linh sâu"],
    challenges: ["Hay lo lắng và nhạy cảm quá", "Áp lực từ kỳ vọng cao", "Khó cân bằng lý trí và cảm xúc"],
    color: "Trắng ánh bạc · Tím nhạt",
    colorHex: "#A78BFA",
  },
  22: {
    title: "Số 22 — Kiến Trúc Sư Vũ Trụ",
    emoji: "🏛️",
    keyword: "Tầm nhìn lớn · Thực tế · Di sản",
    description: "Số master 22 — tiềm năng lớn nhất trong thần số học. Bạn có khả năng biến những ước mơ vĩ đại thành hiện thực có thể chạm tay vào được.",
    strengths: ["Tầm nhìn vĩ mô", "Khả năng tổ chức phi thường", "Kết hợp lý tưởng và thực tế", "Để lại di sản lâu dài"],
    challenges: ["Gánh nặng trách nhiệm quá lớn", "Hay tự đặt kỳ vọng không tưởng", "Kiệt sức khi không có hỗ trợ"],
    color: "Vàng kim · Trắng",
    colorHex: "#EAB308",
  },
  33: {
    title: "Số 33 — Thầy Giáo Vũ Trụ",
    emoji: "🕯️",
    keyword: "Chữa lành · Hy sinh · Tình yêu vô điều kiện",
    description: "Số master 33 hiếm gặp nhất. Bạn đến trái đất với sứ mệnh chữa lành và nâng đỡ người khác qua tình yêu thuần khiết không vụ lợi.",
    strengths: ["Yêu thương vô điều kiện", "Chữa lành cảm xúc người khác", "Sáng tạo để phụng sự", "Trí tuệ tâm linh cao"],
    challenges: ["Tự bỏ bê bản thân", "Mang gánh nặng của người khác", "Khó nhận lấy sự yêu thương"],
    color: "Vàng · Trắng",
    colorHex: "#FCD34D",
  },
};

export function getNumberInfo(n: number): NumberInfo {
  const info = NUMBER_DB[n] ?? NUMBER_DB[9];
  return { number: n, ...info };
}

// ─── Personal Year meaning ────────────────────────────────────

const PERSONAL_YEAR_DB: Record<number, { title: string; summary: string; focus: string }> = {
  1: { title: "Năm Khởi Đầu Mới",    summary: "Năm để bắt đầu những dự án mới, đặt nền móng cho 9 năm tiếp theo. Hãy dũng cảm thử những điều chưa từng làm.", focus: "Hành động · Khởi nghiệp · Định hướng" },
  2: { title: "Năm Hợp Tác",          summary: "Năm của các mối quan hệ, kết nối và kiên nhẫn. Mọi thứ sẽ phát triển chậm nhưng chắc — đừng vội vàng.", focus: "Quan hệ · Kiên nhẫn · Hòa hợp" },
  3: { title: "Năm Sáng Tạo",         summary: "Năng lượng vui vẻ và sáng tạo lên cao. Đây là thời điểm biểu đạt bản thân, giao tiếp nhiều hơn và tận hưởng cuộc sống.", focus: "Biểu đạt · Vui vẻ · Xã giao" },
  4: { title: "Năm Xây Dựng",         summary: "Năm làm việc chăm chỉ, xây dựng nền tảng. Kết quả sẽ không hiện ngay nhưng công sức bỏ ra năm nay sẽ trả lời trong tương lai.", focus: "Kỷ luật · Xây dựng · Ổn định" },
  5: { title: "Năm Thay Đổi",         summary: "Bước ngoặt và thay đổi lớn đang đến. Giữ sự linh hoạt và chào đón cái mới — đây là năm phiêu lưu.", focus: "Linh hoạt · Khám phá · Đổi mới" },
  6: { title: "Năm Gia Đình",         summary: "Tập trung vào gia đình, tình yêu và trách nhiệm cộng đồng. Năm để chữa lành và củng cố các mối quan hệ thân thiết.", focus: "Gia đình · Trách nhiệm · Chữa lành" },
  7: { title: "Năm Nội Tâm",          summary: "Năm của sự chiêm nghiệm và phát triển tâm linh. Hãy dành thời gian cho bản thân, học hỏi và tìm kiếm ý nghĩa sâu hơn.", focus: "Suy ngẫm · Học hỏi · Tâm linh" },
  8: { title: "Năm Thu Hoạch",        summary: "Năm của thành công vật chất và sự công nhận. Những gì bạn đã xây dựng trước đây bắt đầu sinh quả — hãy tự tin nắm bắt cơ hội.", focus: "Sự nghiệp · Tài chính · Thành công" },
  9: { title: "Năm Kết Thúc Chu Kỳ", summary: "Năm để buông bỏ những gì không còn phù hợp. Dọn dẹp — cả vật chất lẫn cảm xúc — để chuẩn bị cho chu kỳ mới.", focus: "Buông bỏ · Tha thứ · Hoàn thiện" },
  11: { title: "Năm Giác Ngộ",        summary: "Trực giác và nhận thức tâm linh đặc biệt mạnh năm nay. Hãy tin vào linh cảm của bản thân.", focus: "Trực giác · Tâm linh · Soi sáng" },
  22: { title: "Năm Kiến Tạo Lớn",   summary: "Tiềm năng xây dựng điều gì đó có tầm ảnh hưởng lớn. Tư duy vĩ mô và hành động thực tế sẽ tạo ra kết quả phi thường.", focus: "Tầm nhìn · Xây dựng · Di sản" },
};

export function getPersonalYearInfo(n: number) {
  return PERSONAL_YEAR_DB[n] ?? PERSONAL_YEAR_DB[9];
}

// ─── Build full profile ───────────────────────────────────────

export function buildNumerologyProfile(
  day: number,
  month: number,
  year: number
): NumerologyProfile {
  const lifePath    = calcLifePath(day, month, year);
  const birthDay    = calcBirthDay(day);
  const personalYear = calcPersonalYear(day, month, new Date().getFullYear());
  // Soul urge dùng birth day number như một proxy đơn giản
  const soulUrge    = reduceNumber(month + day);

  return {
    lifePathNumber:   lifePath,
    lifePathInfo:     getNumberInfo(lifePath),
    personalYear,
    personalYearInfo: getNumberInfo(personalYear),
    soulUrge,
    soulUrgeInfo:     getNumberInfo(soulUrge),
    birthDay,
    birthDayInfo:     getNumberInfo(birthDay),
  };
}
