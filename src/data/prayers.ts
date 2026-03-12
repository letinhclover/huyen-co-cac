// ============================================================
// prayers.ts — Thư Viện Văn Khấn 25 Bài Phổ Biến
// Biến số: [tên tín chủ], [địa chỉ cư ngụ], [ngày tháng]
// ============================================================

export interface Prayer {
  id:       string;
  category: string;
  title:    string;
  emoji:    string;
  occasion: string;  // dịp sử dụng
  content:  string;  // bài khấn với [biến số]
}

export const PRAYER_CATEGORIES = [
  { id:"tet",       label:"Lễ Tết",          emoji:"🎊" },
  { id:"gia_tien",  label:"Gia Tiên / Giỗ",  emoji:"🕯️" },
  { id:"than_tai",  label:"Thần Tài / Táo",  emoji:"💰" },
  { id:"phong_tho", label:"Phong Thổ",       emoji:"🏡" },
  { id:"cau_an",    label:"Cầu An / Sức Khỏe",emoji:"🙏" },
  { id:"khai_truong",label:"Khai Trương",    emoji:"🎋" },
];

export const PRAYERS: Prayer[] = [
  // ─── LỄ TẾT ─────────────────────────────────────────────────
  {
    id: "tet_nguyen_dan",
    category: "tet",
    emoji: "🎊",
    title: "Văn Khấn Giao Thừa",
    occasion: "Đêm 30 Tết / Giao thừa",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.

Con kính lạy Đức Đương Lai Hạ Sinh Di Lặc Tôn Phật.
Con kính lạy Đức Bồ Tát Quán Thế Âm.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đương niên hành khiển, Thái Tuế Chí Đức Tôn thần.
Con kính lạy các ngài Thần linh cai quản trong xứ này.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay là ngày [ngày tháng], nhân tiết Trừ Tịch giao thừa, năm cũ qua đi, năm mới bắt đầu.

Chúng con thành tâm sắm sửa hương hoa lễ vật, bày trước án thờ, dâng lên trước bề trên, cúi xin chứng giám.

Nguyện xin phù hộ cho toàn thể gia đình chúng con trong năm mới: sức khỏe dồi dào, bình an hạnh phúc, vạn sự như ý, mọi điều tốt lành.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "tet_ram_thang_gieng",
    category: "tet",
    emoji: "🌕",
    title: "Văn Khấn Rằm Tháng Giêng",
    occasion: "Ngày 15 tháng Giêng âm lịch",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.

Con kính lạy Đức Phật Thích Ca Mâu Ni.
Con kính lạy Đức Bồ Tát Quán Thế Âm.
Con kính lạy Thánh Thần Hoàng Thiên Hậu Thổ.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay là ngày rằm tháng Giêng, ngày [ngày tháng], nhằm ngày Thượng Nguyên Thiên Quan ban phước.

Chúng con thành tâm dâng hương hoa lễ vật cúng dường Tam Bảo và chư vị Thần linh.

Cúi xin chư vị chứng minh, phù hộ cho gia đình chúng con: mạnh khỏe, bình an, công việc thuận lợi, gia đình hòa thuận, năm mới mọi điều tốt đẹp.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "tet_doan_ngo",
    category: "tet",
    emoji: "☀️",
    title: "Văn Khấn Tết Đoan Ngọ",
    occasion: "Mùng 5 tháng 5 âm lịch",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Đương Lai Hạ Sinh Di Lặc Tôn Phật.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Thổ Địa chính thần.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay là ngày mùng 5 tháng 5 âm lịch, ngày [ngày tháng], nhân tiết Đoan Ngọ — ngày Tết diệt sâu bọ, trừ tà, bảo vệ sức khỏe.

Chúng con thành tâm sắm lễ rượu nếp, hoa quả, hương đăng, dâng lên trước bề trên.

Cúi xin phù hộ cho gia đình chúng con: thân thể khỏe mạnh, tai ương tiêu trừ, vạn sự bình an.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "tet_trung_thu",
    category: "tet",
    emoji: "🌙",
    title: "Văn Khấn Tết Trung Thu",
    occasion: "Rằm tháng 8 âm lịch",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Bồ Tát Quán Thế Âm Bồ Tát.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay là ngày rằm tháng Tám, ngày [ngày tháng], nhân tiết Trung Thu — ngày trăng tròn sáng nhất trong năm.

Chúng con thành tâm bày biện hương hoa, bánh trung thu, hoa quả, đèn lồng dâng kính.

Cúi xin chư vị phù hộ cho gia đình chúng con: đoàn viên hạnh phúc, con cái ngoan ngoãn học giỏi, gia đình sum vầy bình an.

Nam mô A Di Đà Phật! (3 lần)`,
  },

  // ─── GIA TIÊN / GIỖ ─────────────────────────────────────────
  {
    id: "gio_chap",
    category: "gia_tien",
    emoji: "🕯️",
    title: "Văn Khấn Giỗ Chạp (Kỵ Nhật)",
    occasion: "Ngày giỗ hàng năm",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy các cụ Tổ tiên nội ngoại họ [tên tín chủ].

Hôm nay là ngày [ngày tháng], tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Nhân ngày húy kỵ (kỵ nhật) của (cụ/ông/bà)..., chúng con thành kính sắm sửa hương hoa, trà rượu, lễ vật dâng lên.

Kính mời hương linh (cụ/ông/bà) về thụ hưởng lễ vật, chứng giám lòng thành.

Cúi xin (cụ/ông/bà) phù hộ độ trì cho toàn thể con cháu: mạnh khỏe, bình an, làm ăn phát đạt, học hành tiến tới.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "gia_tien_ram_mung1",
    category: "gia_tien",
    emoji: "🏮",
    title: "Văn Khấn Gia Tiên Rằm / Mùng Một",
    occasion: "Ngày Rằm và Mùng Một hàng tháng",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ.
Con kính lạy Tổ tiên ông bà.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay là ngày [ngày tháng], chúng con thành tâm dâng hương, hoa, lễ vật lên gia tiên nội ngoại.

Kính mời chư vị hương linh gia tiên về thụ hưởng lễ vật, chứng giám lòng con cháu.

Phù hộ cho toàn gia được bình an, khỏe mạnh, công việc suôn sẻ, gia đình hòa thuận.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "thanh_minh",
    category: "gia_tien",
    emoji: "⛰️",
    title: "Văn Khấn Tảo Mộ Thanh Minh",
    occasion: "Tiết Thanh Minh (tháng 3 dương lịch)",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Thổ Thần, Thổ Địa, Thần linh cai quản khu vực này.
Con kính lạy chư vị hương linh nằm trong khu vực này.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], nhân tiết Thanh Minh, chúng con đến đây sửa sang, dọn dẹp phần mộ của (ông/bà/cụ)...

Chúng con thành kính dâng hương hoa, lễ vật, cầu xin chư vị Thần linh, hương linh tiên nhân chứng giám.

Phù hộ cho con cháu được bình an, mạnh khỏe, làm ăn phát đạt, học hành tấn tới.

Nam mô A Di Đà Phật! (3 lần)`,
  },

  // ─── THẦN TÀI / TÁO ─────────────────────────────────────────
  {
    id: "than_tai_hang_ngay",
    category: "than_tai",
    emoji: "💰",
    title: "Văn Khấn Thần Tài Hàng Ngày",
    occasion: "Cúng Thần Tài / Thổ Địa hàng ngày",
    content: `Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy ngài Thần Tài.
Con kính lạy ngài Thổ Địa.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con thành tâm dâng hương hoa, trà, lễ vật kính lên ngài Thần Tài, Thổ Địa.

Cúi xin ngài phù hộ cho chúng con: buôn may bán đắt, tiền tài vào như nước, công việc suôn sẻ, gia đạo bình an.

Cầu tài — tài vào nhà. Cầu lộc — lộc đến cửa. Vạn sự hanh thông, bình an thịnh vượng.`,
  },
  {
    id: "than_tai_mung1_ram",
    category: "than_tai",
    emoji: "🌟",
    title: "Văn Khấn Thần Tài Rằm / Mùng Một",
    occasion: "Ngày Rằm, Mùng Một, mùng 10 mỗi tháng",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy ngài Đương cảnh Thành Hoàng.
Con kính lạy ngài Thần Tài chính thần.
Con kính lạy ngài Thổ Địa chính thần.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con thành kính sắm sửa lễ vật: hương hoa, trà rượu, vàng mã, ngũ quả, dâng lên trước bề trên.

Cúi xin ngài Thần Tài, Thổ Địa chứng giám lòng thành, phù hộ độ trì cho chúng con: mạnh khỏe bình an, buôn bán thuận lợi, tiền tài thịnh vượng, gia đình hòa thuận.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "tao_quan",
    category: "than_tai",
    emoji: "🔥",
    title: "Văn Khấn Tiễn Táo Quân (23 Tháng Chạp)",
    occasion: "Ngày 23 tháng Chạp",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy ngài Đông Trù Tư Mệnh Táo Phủ Thần Quân.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày 23 tháng Chạp, ngày [ngày tháng], chúng con thành tâm sắm sửa hương hoa, vàng mã, áo mão, cá chép — phương tiện để ngài về chầu Thiên đình.

Kính cẩn tâu trình: trong năm qua, chúng con có điều gì sơ xuất, lỡ lời, kính xin ngài rộng lòng tha thứ.

Cầu xin ngài tâu với Ngọc Hoàng ban phước lành cho gia đình chúng con trong năm mới: bình an, sức khỏe, tài lộc dồi dào.

Kính tiễn ngài lên đường, về chầu Thiên đình. Nam mô A Di Đà Phật!`,
  },

  // ─── PHONG THỔ ───────────────────────────────────────────────
  {
    id: "dong_tho",
    category: "phong_tho",
    emoji: "⛏️",
    title: "Văn Khấn Động Thổ Xây Dựng",
    occasion: "Trước khi khởi công xây dựng nhà / công trình",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy ngài Hoàng Thiên Hậu Thổ.
Con kính lạy ngài Thổ Công, Thổ Địa, Thổ Thần cai quản tại khu đất này.
Con kính lạy các ngài Long Mạch Thần linh tại đây.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con thành tâm sắm sửa hương hoa, lễ vật, kính dâng trước các ngài.

Chúng con xin phép các ngài Thần linh cho phép được khởi công xây dựng tại mảnh đất này.

Cúi xin các ngài phù hộ: công trình thuận lợi, thợ thầy bình an, công việc hoàn thành tốt đẹp, gia đình chúng con được bình an, thịnh vượng trong ngôi nhà mới.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "nhap_trach",
    category: "phong_tho",
    emoji: "🏠",
    title: "Văn Khấn Nhập Trạch (Về Nhà Mới)",
    occasion: "Ngày dọn về nhà mới",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy ngài Hoàng Thiên Hậu Thổ.
Con kính lạy Thổ Công, Thổ Địa, Thổ Thần.
Con kính lạy ngài Táo Quân, Thần Tài, Thần Môn.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], gia đình chúng con về ở nhà mới tại địa chỉ trên.

Chúng con thành kính xin trình với các ngài: từ nay gia đình chúng con xin được cư ngụ tại đây, cầu mong các ngài phù hộ che chở.

Cúi xin phù hộ cho gia đình chúng con: bình an khỏe mạnh, tài lộc phong phú, gia đạo hưng vượng, mọi điều như ý trong ngôi nhà mới này.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "sang_cat",
    category: "phong_tho",
    emoji: "⚱️",
    title: "Văn Khấn Sang Cát / Cải Táng",
    occasion: "Trước khi cải táng, bốc mộ",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Thổ Thần, Long Mạch Thần linh cai quản khu vực này.
Con kính lạy hương linh (ông/bà/cụ)...

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con cháu trong gia đình chúng con xin phép thực hiện lễ sang cát, cải táng cho (ông/bà/cụ)...

Kính xin Thổ Thần, Long Mạch cho phép con cháu được thực hiện lễ này. Kính xin hương linh (ông/bà/cụ) thứ lỗi nếu có điều gì bất kính.

Cầu nguyện cho hương linh được siêu thoát, an nghỉ nơi cõi vĩnh hằng. Phù hộ cho con cháu bình an, mạnh khỏe.

Nam mô A Di Đà Phật! (3 lần)`,
  },

  // ─── CẦU AN ──────────────────────────────────────────────────
  {
    id: "cau_an_dau_nam",
    category: "cau_an",
    emoji: "🙏",
    title: "Văn Khấn Cầu An Đầu Năm",
    occasion: "Đầu năm mới, đi lễ chùa",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Đức Phật Thích Ca Mâu Ni.
Con kính lạy Đức Bồ Tát Quán Thế Âm.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], đầu xuân năm mới, con đến dâng hương lễ Phật, cầu nguyện bình an.

Con kính dâng hương hoa, lễ vật nhỏ mọn, lòng thành kính trước Tam Bảo.

Cúi xin Đức Phật, Bồ Tát thương xót chúng sinh, ban phúc lành cho gia đình con: sức khỏe bình an, tâm hồn thanh thản, vượt qua mọi khó khăn trong năm mới, gia đình hòa thuận hạnh phúc.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "cau_suc_khoe",
    category: "cau_an",
    emoji: "💚",
    title: "Văn Khấn Cầu Sức Khỏe",
    occasion: "Cầu cho người thân bệnh tật, ốm đau",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy Đức Phật Dược Sư Lưu Ly Quang Như Lai.
Con kính lạy Đức Bồ Tát Quán Thế Âm.
Con kính lạy Đức Bồ Tát Địa Tạng.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con thành tâm dâng hương, hoa, lễ vật cầu xin Đức Phật, Bồ Tát từ bi.

Con kính xin Đức Phật Dược Sư gia hộ cho (tên người bệnh): bệnh tật tiêu trừ, thân thể phục hồi, tinh thần an định, sức khỏe dần bình phục.

Cầu xin ân đức Tam Bảo chiếu soi, phù hộ cho toàn gia bình an.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "xuat_hanh",
    category: "cau_an",
    emoji: "🚗",
    title: "Văn Khấn Xuất Hành Đầu Năm",
    occasion: "Ngày đầu tiên ra khỏi nhà trong năm mới",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Hộ Pháp thiện thần.
Con kính lạy ngài Thổ Công, Thổ Địa.
Con kính lạy ngài Thần Đường, Thần Lộ, Thần Xuất Hành.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con thành tâm xuất hành, kính xin các ngài phù hộ.

Trên đường đi: tai qua nạn khỏi, gặp nhiều may mắn, công việc hanh thông, sự nghiệp thăng tiến.

Cầu xin mọi điều tốt lành đến với gia đình con trong suốt hành trình và cả năm mới này.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "cau_thi",
    category: "cau_an",
    emoji: "📚",
    title: "Văn Khấn Cầu Thi Cử Đỗ Đạt",
    occasion: "Trước kỳ thi quan trọng",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Văn Xương Đế Quân — Thần bảo trợ học vấn, thi cử.
Con kính lạy Đức Khổng Tử Tiên Thánh.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con thành tâm dâng hương cầu nguyện.

Con (hoặc con cháu) sắp tham dự kỳ thi quan trọng. Con đã cố gắng học tập, rèn luyện, nay kính xin ngài phù hộ.

Cúi xin Đức Văn Xương phù hộ cho: đầu óc sáng suốt, trí nhớ tốt, bình tĩnh tự tin, thi cử thuận lợi, đỗ đạt như ý nguyện.

Nam mô A Di Đà Phật! (3 lần)`,
  },

  // ─── KHAI TRƯƠNG ─────────────────────────────────────────────
  {
    id: "khai_truong",
    category: "khai_truong",
    emoji: "🎋",
    title: "Văn Khấn Khai Trương",
    occasion: "Ngày khai trương cửa hàng, doanh nghiệp",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Hoàng Thiên Hậu Thổ.
Con kính lạy ngài Thần Tài chính thần.
Con kính lạy ngài Thổ Địa chính thần.
Con kính lạy ngài Thành Hoàng Bổn Cảnh.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con thành tâm làm lễ khai trương cơ sở kinh doanh.

Chúng con kính dâng hương hoa, lễ vật, cầu xin chư vị Thần linh chứng giám.

Cúi xin phù hộ cho cơ sở kinh doanh của chúng con: khai trương thuận lợi, buôn may bán đắt, khách hàng đông đúc, tiền tài vào như nước, mọi việc hanh thông, sự nghiệp phát đạt.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "ky_hop_dong",
    category: "khai_truong",
    emoji: "📋",
    title: "Văn Khấn Ký Hợp Đồng Làm Ăn",
    occasion: "Trước khi ký kết hợp đồng lớn",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ.
Con kính lạy ngài Thần Tài, Thổ Địa.
Con kính lạy Tổ tiên ông bà.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con chuẩn bị ký kết hợp đồng, giao dịch làm ăn quan trọng.

Chúng con thành tâm dâng hương, cầu xin chư vị Thần linh, Tổ tiên phù hộ.

Cúi xin phù hộ cho: hợp đồng thuận lợi, hai bên tin tưởng, công việc hanh thông, lợi ích đôi bên, sự hợp tác lâu dài thịnh vượng.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "mua_xe",
    category: "khai_truong",
    emoji: "🚙",
    title: "Văn Khấn Nhận Xe Mới",
    occasion: "Ngày mua xe, nhận xe mới",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Hoàng Thiên Hậu Thổ.
Con kính lạy ngài Thần Tài, Thổ Địa.
Con kính lạy ngài Thần Đường, Thần Lộ.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], chúng con thành tâm làm lễ nhận xe mới.

Chúng con dâng hương hoa, hoa quả kính lên các ngài, cầu xin phù hộ.

Cúi xin phù hộ: xe mới đầy đủ bình an, máy móc hoạt động tốt, người lái an toàn, không tai nạn, không rủi ro, mọi chuyến đi đều thuận lợi bình an.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "nhan_viec",
    category: "khai_truong",
    emoji: "💼",
    title: "Văn Khấn Nhận Việc Làm Mới",
    occasion: "Ngày đi làm ở nơi làm việc mới",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Hoàng Thiên Hậu Thổ.
Con kính lạy Thổ Công, Thổ Địa nơi làm việc.
Con kính lạy Tổ tiên ông bà nội ngoại.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con bắt đầu công việc mới tại nơi làm việc mới.

Chúng con thành tâm cầu nguyện, kính xin chư vị phù hộ.

Cúi xin phù hộ cho con: hòa thuận với đồng nghiệp, được cấp trên tin tưởng, công việc thuận lợi, phát triển sự nghiệp, lương thưởng xứng đáng, làm việc bình an.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "khai_but",
    category: "khai_truong",
    emoji: "✍️",
    title: "Văn Khấn Khai Bút Đầu Năm",
    occasion: "Ngày viết những chữ đầu tiên trong năm mới",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Văn Xương Đế Quân.
Con kính lạy Đức Khổng Tử.
Con kính lạy chư vị Tiên hiền, Tiên Nho.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng] đầu xuân năm mới, con thành tâm làm lễ khai bút.

Kính dâng hương hoa, cầu xin chư vị Thần linh văn học phù hộ.

Cúi xin phù hộ cho con: văn chương tiến bộ, trí tuệ sáng suốt, học hành thông đạt, công danh thuận lợi, sự nghiệp văn chương phát triển trong năm mới này.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    id: "ram_thang_7",
    category: "gia_tien",
    emoji: "🕯️",
    title: "Văn Khấn Rằm Tháng Bảy (Xá Tội Vong Nhân)",
    occasion: "Rằm tháng 7 âm lịch - Lễ Vu Lan",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật.
Con kính lạy Đức Địa Tạng Vương Bồ Tát.
Con kính lạy các chư vị Thần linh.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay rằm tháng Bảy, ngày [ngày tháng], nhân lễ Vu Lan báo hiếu và Xá Tội Vong Nhân.

Chúng con thành tâm sắm sửa hương hoa, lễ vật, quần áo vàng mã, dâng lên cúng tế.

Kính mời hương linh Tổ tiên nội ngoại, và các vong linh không nơi nương tựa về thụ hưởng lễ vật.

Cầu xin Đức Địa Tạng Vương Bồ Tát xá tội, phù hộ cho chư vong linh được siêu thoát, sớm được đầu thai chuyển kiếp.

Phù hộ cho gia đình chúng con bình an, con cháu hiếu thuận.

Nam mô Địa Tạng Vương Bồ Tát! (3 lần)`,
  },
  {
    id: "cau_duyen",
    category: "cau_an",
    emoji: "💑",
    title: "Văn Khấn Cầu Duyên",
    occasion: "Xin duyên lành, cầu nhân duyên tốt đẹp",
    content: `Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Bồ Tát Quán Thế Âm từ bi.
Con kính lạy ngài Tơ Hồng Nguyệt Lão.
Con kính lạy ngài Thánh Mẫu.

Tín chủ con là [tên tín chủ], ngụ tại [địa chỉ cư ngụ].

Hôm nay ngày [ngày tháng], con thành tâm dâng hương, hoa tươi, quả ngon, kính cầu.

Con đã trưởng thành, hết lòng mong muốn tìm được người bạn đời tốt lành, chung thủy, đồng tâm.

Cúi xin Nguyệt Lão xe chỉ đỏ, Đức Bồ Tát phù hộ cho con sớm gặp được người có duyên, nhân duyên tốt đẹp, trăm năm hạnh phúc.

Nam mô A Di Đà Phật! (3 lần)`,
  },
];

// Helper: search prayers
export function searchPrayers(query: string): Prayer[] {
  if (!query.trim()) return PRAYERS;
  const q = query.toLowerCase();
  return PRAYERS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.occasion.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.content.toLowerCase().includes(q)
  );
}

export function getPrayersByCategory(cat: string): Prayer[] {
  if (!cat) return PRAYERS;
  return PRAYERS.filter(p => p.category === cat);
}
