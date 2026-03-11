// AUTO-GENERATED from lichvn.pak SQLite — DO NOT EDIT MANUALLY
// Source: Lịch VN 2026 app (Apktool M extraction)

// ─── 12 Trực ─────────────────────────────────────────────────────────────────
export interface TrucInfo {
  id: number; ten: string; dinhGia: string;
  xayDung: number; kinhDoanh: number; cuoiHoi: number; anTang: number;
}

export const NGAY_TRUC: TrucInfo[] = [
  { id:0, ten:"Kiến", dinhGia:"bình thường", xayDung:0, kinhDoanh:4, cuoiHoi:4, anTang:0 },
  { id:1, ten:"Trừ", dinhGia:"bình thường", xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:3 },
  { id:2, ten:"Mãn", dinhGia:"tốt", xayDung:2, kinhDoanh:3, cuoiHoi:2, anTang:0 },
  { id:3, ten:"Bình", dinhGia:"tốt", xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:4 },
  { id:4, ten:"Định", dinhGia:"tốt", xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:4 },
  { id:5, ten:"Chấp", dinhGia:"bình thường", xayDung:2, kinhDoanh:2, cuoiHoi:2, anTang:0 },
  { id:6, ten:"Phá", dinhGia:"xấu", xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:7, ten:"Nguy", dinhGia:"xấu", xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:8, ten:"Thành", dinhGia:"tốt", xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:9, ten:"Thu", dinhGia:"tốt", xayDung:4, kinhDoanh:5, cuoiHoi:4, anTang:0 },
  { id:10, ten:"Khai", dinhGia:"tốt", xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:0 },
  { id:11, ten:"Bế", dinhGia:"xấu", xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
];

// ─── 6 Ngày Xấu theo tháng ──────────────────────────────────────────────────
export interface NgayXauInfo {
  id: number; ten: string;
  // T1-T12: Can Chi hoặc ngày âm lịch xấu trong tháng đó
  byMonth: (string | null)[];
}

export const NGAY_XAU: NgayXauInfo[] = [
  { id:1, ten:"Vãng Vong", byMonth:["Dần", "Tỵ", "Thân", "Hợi", "Mão", "Ngọ", "Dậu", "Tý", "Thìn", "Mùi", "Tuất", "Sửu"] },
  { id:2, ten:"Sát Chủ", byMonth:["Tỵ", "Tý", "Mùi", "Mão", "Thân", "Tuất", "Sửu", "Hợi", "Ngọ", "Dậu", "Dần", "Thìn"] },
  { id:3, ten:"Thọ Tử", byMonth:["Tuất", "Thìn", "Hợi", "Tỵ", "Tý", "Ngọ", "Sửu", "Mùi", "Dần", "Thân", "Mão", "Dậu"] },
  { id:4, ten:"Dương Công Kỵ", byMonth:["13", "11", "09", "07", "05", "03", "08, 29", "27", "25", "23", "21", "19"] },
  { id:5, ten:"Nguyệt Kỵ", byMonth:["05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23", "05, 14, 23"] },
  { id:6, ten:"Tam Nương", byMonth:["03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27", "03, 07, 13, 18, 22, 27"] },
];

// ─── 114 Sao Tốt/Xấu ────────────────────────────────────────────────────────
export interface SaoInfo {
  id: number; name: string; info: string | null;
  byMonth: (string | null)[]; // T1-T12: Can Chi ngày có sao này
  xayDung: number; kinhDoanh: number; cuoiHoi: number; anTang: number;
}

export const SAO_TOT_XAU: SaoInfo[] = [
  { id:1, name:"Thiên  Đức", info:null, byMonth:["Đinh","Thân","Nhâm","Tân","Hợi","Giáp","Quý","Dần","Bính","Ất","Tỵ","Canh"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:2, name:"Thiên Đức Hợp", info:null, byMonth:["Nhâm","Tý","Đinh","Bính","Dần","Kỷ","Mậu","Hợi","Tân","Canh","Thân","Ất"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:3, name:"Nguyệt Đức", info:null, byMonth:["Bính","Giáp","Nhâm","Canh","Bính","Giáp","Nhâm","Canh","Bính","Giáp","Nhâm","Canh"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:4, name:"Nguyệt Đức Hợp", info:"Tốt mọi việc, kỵ tố tụng", byMonth:["Tân","Kỷ","Đinh","Ất","Tân","Kỷ","Đinh","Ất","Tân","Kỷ","Đinh","Ất"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:5, name:"Thiên Hỷ (trực thành)", info:"Tốt mọi việc, nhất là cưới hỏi", byMonth:["Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu"], xayDung:4, kinhDoanh:4, cuoiHoi:7, anTang:4 },
  { id:6, name:"Thiên Phú (trực mãn)", info:"Tốt mọi việc, nhất là xây dựng nhà cửa, khai trương và an táng", byMonth:["Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão"], xayDung:6, kinhDoanh:6, cuoiHoi:4, anTang:6 },
  { id:7, name:"Thiên Quý", info:null, byMonth:["Giáp","Giáp","Giáp","Bính","Bính","Bính","Canh","Canh","Canh","Nhâm","Nhâm","Nhâm"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:8, name:"Thiên Quý", info:null, byMonth:["Ất","Ất","Ất","Đinh","Đinh","Đinh","Tân","Tân","Tân","Quý","Quý","Quý"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:9, name:"Thiên Xá", info:"Tốt cho tế tự, giải oan, trừ được các sao xấu, chỉ kiêng kỵ động thổ. Nếu gặp trực khai thì rất tốt tức là ngày thiên xá gặp sinh khí", byMonth:["Mậu_Dần","Mậu_Dần","Mậu_Dần","Giáp_Ngọ",null,"Giáp_Ngọ","Mậu_Thân","Mậu_Thân","Mậu_Thân","Giáp_Tý",null,"Giáp_Tý"], xayDung:2, kinhDoanh:10, cuoiHoi:10, anTang:10 },
  { id:10, name:"Sinh khí (trực khai)", info:"Tốt mọi việc, nhất là làm nhà, sửa nhà, động thổ, trồng cây", byMonth:["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"], xayDung:7, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:11, name:"Thiên Phúc", info:null, byMonth:["Kỷ","Mậu",null,"Tân","Tân",null,"Ất","Giáp",null,"Đinh","Bính",null], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:12, name:"Thiên Phúc", info:null, byMonth:[null,null,null,"Quý","Nhâm",null,null,null,null,null,null,null], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:13, name:"Thiên Thành", info:null, byMonth:["Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:14, name:"Thiên Quan", info:null, byMonth:["Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:15, name:"Thiên Mã", info:"Tốt cho việc xuất hành, giao dịch, cầu tài lộc", byMonth:["Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn"], xayDung:2, kinhDoanh:6, cuoiHoi:2, anTang:2 },
  { id:16, name:"Thiên Tài", info:"Tốt cho việc cầu tài lộc, khai trương", byMonth:["Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần"], xayDung:2, kinhDoanh:6, cuoiHoi:2, anTang:2 },
  { id:17, name:"Địa Tài", info:"Tốt cho việc cầu tài lộc, khai trương", byMonth:["Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão"], xayDung:2, kinhDoanh:6, cuoiHoi:2, anTang:2 },
  { id:18, name:"Nguyệt Tài", info:"Tốt cho việc cầu tài lộc, khai trương, xuất hành, di chuyển, giao dịch", byMonth:["Ngọ","Tỵ","Tỵ","Mùi","Dậu","Hợi","Ngọ","Tỵ","Tỵ","Mùi","Dậu","Hợi"], xayDung:3, kinhDoanh:7, cuoiHoi:3, anTang:3 },
  { id:19, name:"Nguyệt Ân", info:null, byMonth:["Bính","Đinh","Canh","Kỷ","Mậu","Tân","Nhâm","Quý","Canh","Ất","Giáp","Tân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:20, name:"Nguyệt Không", info:"Tốt cho việc làm nhà, làm gường", byMonth:["Nhâm","Canh","Bính","Giáp","Nhâm","Canh","Bính","Giáp","Nhâm","Canh","Bính","Giáp"], xayDung:6, kinhDoanh:2, cuoiHoi:2, anTang:2 },
  { id:21, name:"Minh Tinh", info:null, byMonth:["Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:22, name:"Thánh Tâm", info:"Tốt mọi việc, nhất là cầu phúc, tế tự", byMonth:["Hợi","Tỵ","Tý","Ngọ","Sửu","Mùi","Dần","Thân","Mão","Dậu","Thìn","Tuất"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:5 },
  { id:23, name:"Ngũ Phú", info:null, byMonth:["Hợi","Dần","Tỵ","Thân","Hợi","Dần","Tỵ","Thân","Hợi","Dần","Tỵ","Thân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:24, name:"Lộc Khố", info:"Tốt cho việc cầu tài, khai trương, giao dịch", byMonth:["Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão"], xayDung:2, kinhDoanh:6, cuoiHoi:2, anTang:2 },
  { id:25, name:"Phúc Sinh", info:null, byMonth:["Dậu","Mão","Tuất","Thìn","Hợi","Tỵ","Tý","Ngọ","Sửu","Mùi","Dần","Thân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:26, name:"Cát Khánh", info:null, byMonth:["Dậu","Dần","Hợi","Thìn","Sửu","Ngọ","Mão","Thân","Tỵ","Tuất","Mùi","Tý"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:27, name:"Âm Đức", info:null, byMonth:["Dậu","Mùi","Tỵ","Mão","Sửu","Hợi","Dậu","Mùi","Tỵ","Mão","Sửu","Hợi"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:28, name:"U Vi tinh", info:null, byMonth:["Hợi","Thìn","Sửu","Ngọ","Mão","Thân","Tỵ","Tuất","Mùi","Tý","Dậu","Dần"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:29, name:"Mãn Đức tinh", info:null, byMonth:["Dần","Mùi","Thìn","Dậu","Ngọ","Hợi","Thân","Sửu","Tuất","Mão","Tý","Tỵ"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:30, name:"Kính Tâm", info:"Tốt đối với tang lễ", byMonth:["Mùi","Sửu","Thân","Dần","Dậu","Mão","Tuất","Thìn","Hợi","Tỵ","Tý","Ngọ"], xayDung:2, kinhDoanh:2, cuoiHoi:2, anTang:5 },
  { id:31, name:"Tuế hợp", info:null, byMonth:["Sửu","Tý","Hợi","Tuất","Dậu","Thân","Mùi","Ngọ","Tỵ","Thìn","Mão","Dần"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:32, name:"Nguyệt giải", info:null, byMonth:["Thân","Thân","Dậu","Dậu","Tuất","Tuất","Hợi","Hợi","Ngọ","Ngọ","Mùi","Mùi"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:33, name:"Quan nhật", info:null, byMonth:[null,"Mão",null,null,"Ngọ",null,null,"Dậu",null,null,"Tý",null], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:34, name:"Hoạt điệu", info:"Tốt, nhưng gặp thụ tử thì xấu", byMonth:["Tỵ","Tuất","Mùi","Tý","Dậu","Dần","Hợi","Thìn","Sửu","Ngọ","Mão","Thân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:35, name:"Giải thần", info:"Tốt cho việc tế tự, tố tụng, gải oan. Trừ được các sao xấu", byMonth:["Thân","Thân","Tuất","Tuất","Tý","Tý","Dần","Dần","Thìn","Thìn","Ngọ","Ngọ"], xayDung:10, kinhDoanh:10, cuoiHoi:10, anTang:10 },
  { id:36, name:"Phổ hộ (Hội hộ)", info:"Tốt mọi việc, làm phúc, cưới hỏi, xuất hành", byMonth:["Thân","Dần","Dậu","Mão","Tuất","Thìn","Hợi","Tỵ","Tý","Ngọ","Sửu","Mùi"], xayDung:4, kinhDoanh:5, cuoiHoi:5, anTang:4 },
  { id:37, name:"Ích Hậu", info:"Tốt mọi việc, nhất là cưới hỏi", byMonth:["Tý","Ngọ","Sửu","Mùi","Dần","Thân","Mão","Dậu","Thìn","Tuất","Tỵ","Hợi"], xayDung:4, kinhDoanh:4, cuoiHoi:7, anTang:4 },
  { id:38, name:"Tục Thế", info:"Tốt mọi việc, nhất là cưới hỏi", byMonth:["Sửu","Mùi","Dần","Thân","Mão","Dậu","Thìn","Tuất","Tỵ","Hợi","Ngọ","Tý"], xayDung:4, kinhDoanh:4, cuoiHoi:7, anTang:4 },
  { id:39, name:"Yếu yên (thiên quý)", info:"Tốt mọi việc, nhất là cưới hỏi", byMonth:["Dần","Thân","Mão","Dậu","Thìn","Tuất","Tỵ","Hợi","Ngọ","Tý","Mùi","Sửu"], xayDung:4, kinhDoanh:4, cuoiHoi:7, anTang:4 },
  { id:40, name:"Dịch Mã", info:"Tốt mọi việc, nhất là xuất hành", byMonth:["Thân","Tỵ","Dần","Hợi","Thân","Tỵ","Dần","Hợi","Thân","Tỵ","Dần","Hợi"], xayDung:4, kinhDoanh:6, cuoiHoi:4, anTang:4 },
  { id:41, name:"Tam Hợp", info:null, byMonth:["Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:42, name:"Tam Hợp", info:null, byMonth:["Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:43, name:"Lục Hợp", info:null, byMonth:["Hợi","Tuất","Dậu","Thân","Mùi","Ngọ","Tỵ","Thìn","Mão","Dần","Sửu","Tý"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:44, name:"Mẫu Thương", info:"Tốt về cầu tài lộc, khai trương", byMonth:["Hợi","Hợi","Hợi","Dần","Dần","Dần","Thìn","Thìn","Thìn","Thân","Thân","Thân"], xayDung:2, kinhDoanh:5, cuoiHoi:2, anTang:2 },
  { id:45, name:"Mẫu Thương", info:"Tốt về cầu tài lộc, khai trương", byMonth:["Tý","Tý","Tý","Mão","Mão","Mão","Sửu","Sửu","Sửu","Dậu","Dậu","Dậu"], xayDung:2, kinhDoanh:5, cuoiHoi:2, anTang:2 },
  { id:46, name:"Phúc hậu", info:"Tốt về cầu tài lộc, khai trương", byMonth:["Dần","Dần","Dần","Tỵ","Tỵ","Tỵ","Thân","Thân","Thân","Hợi","Hợi","Hợi"], xayDung:2, kinhDoanh:5, cuoiHoi:2, anTang:2 },
  { id:47, name:"Đại Hồng Sa", info:null, byMonth:["Tý","Tý","Tý","Thìn","Thìn","Thìn","Ngọ","Ngọ","Ngọ","Thân","Thân","Thân"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:48, name:"Đại Hồng Sa", info:null, byMonth:["Sửu","Sửu","Sửu","Tỵ","Tỵ","Tỵ","Mùi","Mùi","Mùi","Tuất","Tuất","Tuất"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:49, name:"Dân nhật, thời đức", info:null, byMonth:["Ngọ","Ngọ","Ngọ","Dậu","Dậu","Dậu","Tý","Tý","Tý","Mão","Mão","Mão"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:50, name:"Hoàng Ân", info:null, byMonth:["Tuất","Sửu","Dần","Tỵ","Dậu","Mão","Tý","Ngọ","Hợi","Thìn","Thân","Mùi"], xayDung:4, kinhDoanh:4, cuoiHoi:4, anTang:4 },
  { id:51, name:"Thanh Long", info:"Hoàng Đạo - Tốt mọi việc", byMonth:["Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất"], xayDung:8, kinhDoanh:8, cuoiHoi:8, anTang:8 },
  { id:52, name:"Minh đường", info:"Hoàng Đạo - Tốt mọi việc", byMonth:["Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi"], xayDung:8, kinhDoanh:8, cuoiHoi:8, anTang:8 },
  { id:53, name:"Kim đường", info:"Hoàng Đạo - Tốt mọi việc", byMonth:["Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão"], xayDung:8, kinhDoanh:8, cuoiHoi:8, anTang:8 },
  { id:54, name:"Ngọc đường", info:"Hoàng Đạo - Tốt mọi việc", byMonth:["Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ"], xayDung:8, kinhDoanh:8, cuoiHoi:8, anTang:8 },
  { id:55, name:"Thiên Cương (hay Diệt Môn)", info:null, byMonth:["Tỵ","Tý","Mùi","Dần","Dậu","Thìn","Hợi","Ngọ","Sửu","Thân","Mão","Tuất"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:56, name:"Thiên Lại", info:null, byMonth:["Dậu","Ngọ","Mão","Tý","Dậu","Ngọ","Mão","Tý","Dậu","Ngọ","Mão","Tý"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:57, name:"Thiên Ngục, Thiên Hoả", info:"Xấu mọi việc, Xấu về lợp nhà", byMonth:["Tý","Mão","Ngọ","Dậu","Tý","Mão","Ngọ","Dậu","Tý","Mão","Ngọ","Dậu"], xayDung:-5, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:58, name:"Tiểu Hồng Sa", info:null, byMonth:["Tỵ","Dậu","Sửu","Tỵ","Dậu","Sửu","Tỵ","Dậu","Sửu","Tỵ","Dậu","Sửu"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:59, name:"Đại Hao (Tử khí, quan phú)", info:null, byMonth:["Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:60, name:"Tiểu Hao", info:"Xấu về kinh doanh, cầu tài", byMonth:["Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn"], xayDung:-1, kinhDoanh:-5, cuoiHoi:-1, anTang:-1 },
  { id:61, name:"Nguyệt phá", info:"Xấu về xây dựng nhà cửa", byMonth:["Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:62, name:"Nguyệt phá", info:"Xấu về xây dựng nhà cửa", byMonth:[null,"Tuất",null,null,"Sửu",null,null,"Thìn",null,null,"Mùi",null], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:63, name:"Kiếp sát", info:"Kỵ xuất hành, cưới hỏi, an táng, xây dựng", byMonth:["Hợi","Thân","Tỵ","Dần","Hợi","Thân","Tỵ","Dần","Hợi","Thân","Tỵ","Dần"], xayDung:-5, kinhDoanh:-5, cuoiHoi:-5, anTang:-5 },
  { id:64, name:"Địa phá", info:"Kỵ xây dựng", byMonth:["Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:65, name:"Thổ phủ", info:"Kỵ xây dựng, động thổ", byMonth:["Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:66, name:"Thổ ôn (thiên cẩu)", info:"Kỵ xây dựng, đào ao, đào giếng, xấu về tế tự", byMonth:["Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:67, name:"Thiên ôn", info:"Kỵ xây dựng", byMonth:["Mùi","Tuất","Thìn","Dần","Ngọ","Tý","Dậu","Thân","Tỵ","Hợi","Tý","Mão"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:68, name:"Thụ tử", info:"Xấu mọi việc (trừ săn bắn tốt)", byMonth:["Tuất","Thìn","Hợi","Tỵ","Tý","Ngọ","Sửu","Mùi","Dần","Thân","Mão","Dậu"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:69, name:"Hoang vu", info:null, byMonth:["Tỵ","Tỵ","Tỵ","Thân","Thân","Thân","Hợi","Hợi","Hợi","Dần","Dần","Dần"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:70, name:"Hoang vu", info:null, byMonth:["Dậu","Dậu","Dậu","Tý","Tý","Tý","Mão","Mão","Mão","Ngọ","Ngọ","Ngọ"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:71, name:"Hoang vu", info:null, byMonth:["Sửu","Sửu","Sửu","Thìn","Thìn","Thìn","Mùi","Mùi","Mùi","Tuất","Tuất","Tuất"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:72, name:"Thiên tặc", info:"Xấu đối với khởi tạo, động thổ, nhập trạch, khai trương", byMonth:["Thìn","Dậu","Dần","Mùi","Tý","Tỵ","Tuất","Mão","Thân","Sửu","Ngọ","Hợi"], xayDung:-5, kinhDoanh:-5, cuoiHoi:-1, anTang:-1 },
  { id:73, name:"Địa Tặc", info:"Xấu đối với khởi tạo, an táng, động thổ, xuất hành", byMonth:["Sửu","Tý","Hợi","Tuất","Dậu","Thân","Mùi","Ngọ","Tỵ","Thìn","Mão","Dần"], xayDung:-5, kinhDoanh:-5, cuoiHoi:-1, anTang:-5 },
  { id:74, name:"Hoả tai", info:"Xấu đối với làm nhà, lợp nhà", byMonth:["Sửu","Mùi","Dần","Thân","Mão","Dậu","Thìn","Tuất","Tỵ","Hợi","Ngọ","Tý"], xayDung:-5, kinhDoanh:-2, cuoiHoi:-2, anTang:-1 },
  { id:75, name:"Nguyệt Hoả, Độc Hoả", info:"Xấu đối với lợp nhà, làm bếp", byMonth:["Tỵ","Thìn","Mão","Dần","Sửu","Tý","Hợi","Tuất","Dậu","Thân","Mùi","Ngọ"], xayDung:-5, kinhDoanh:-2, cuoiHoi:-2, anTang:-1 },
  { id:76, name:"Nguyệt Yếm đại hoạ", info:"Xấu đối với xuất hành, cưới hỏi", byMonth:["Tuất","Dậu","Thân","Mùi","Ngọ","Tỵ","Thìn","Mão","Dần","Sửu","Tý","Hợi"], xayDung:-3, kinhDoanh:-5, cuoiHoi:-5, anTang:-3 },
  { id:77, name:"Nguyệt Hư (Nguyệt Sát)", info:"Xấu đối với việc cưới hỏi, mở cửa, mở hàng", byMonth:["Sửu","Tuất","Mùi","Thìn","Sửu","Tuất","Mùi","Thìn","Sửu","Tuất","Mùi","Thìn"], xayDung:-2, kinhDoanh:-5, cuoiHoi:-5, anTang:-2 },
  { id:78, name:"Hoàng Sa", info:"Xấu đối với xuất hành", byMonth:["Ngọ","Dần","Tý","Ngọ","Dần","Tý","Ngọ","Dần","Tý","Ngọ","Dần","Tý"], xayDung:-1, kinhDoanh:-4, cuoiHoi:-2, anTang:-1 },
  { id:79, name:"Lục Bất thành", info:"Xấu đối với xây dựng", byMonth:["Dần","Ngọ","Tuất","Tỵ","Dậu","Sửu","Thân","Tý","Thìn","Hợi","Mão","Mùi"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:80, name:"Nhân Cách", info:"Xấu đối với cưới hỏi, khởi tạo", byMonth:["Dậu","Mùi","Tỵ","Mão","Sửu","Hợi","Dậu","Mùi","Tỵ","Mão","Sửu","Hợi"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:81, name:"Thần cách", info:"Kỵ tế tự", byMonth:["Tỵ","Mão","Sửu","Hợi","Dậu","Mùi","Tỵ","Mão","Sửu","Hợi","Dậu","Mùi"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-1, anTang:-3 },
  { id:82, name:"Phi Ma sát (Tai sát)", info:"Kỵ cưới hỏi nhập trạch", byMonth:["Tý","Dậu","Ngọ","Mão","Tý","Dậu","Ngọ","Mão","Tý","Dậu","Ngọ","Mão"], xayDung:-4, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:83, name:"Ngũ Quỹ", info:"Kỵ xuất hành", byMonth:["Ngọ","Dần","Thìn","Dậu","Mão","Thân","Sửu","Tỵ","Tý","Hợi","Mùi","Tuất"], xayDung:-1, kinhDoanh:-4, cuoiHoi:-1, anTang:-1 },
  { id:84, name:"Băng tiêu ngoạ hãm", info:null, byMonth:["Tỵ","Tý","Sửu","Dần","Mão","Tuất","Hợi","Ngọ","Mùi","Thân","Dậu","Thìn"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:85, name:"Hà khôi, Cẩu Giảo", info:"Kỵ khởi công xây nhà cửa, xấu mọi việc", byMonth:["Hợi","Ngọ","Sửu","Thân","Mão","Tuất","Tỵ","Tý","Mùi","Dần","Dậu","Thìn"], xayDung:-5, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:86, name:"Vãng vong (Thổ kỵ)", info:"Kỵ xuất hành, cưới hỏi, cầu tài lộc, động thổ", byMonth:["Dần","Tỵ","Thân","Hợi","Mão","Ngọ","Dậu","Tý","Thìn","Mùi","Tuất","Sửu"], xayDung:-5, kinhDoanh:-5, cuoiHoi:-5, anTang:-1 },
  { id:87, name:"Cửu không", info:"Kỵ xuất hành, cầu tài, khai trương", byMonth:["Thìn","Sửu","Tuất","Mùi","Mão","Tý","Dậu","Ngọ","Dần","Hợi","Thân","Tỵ"], xayDung:-2, kinhDoanh:-5, cuoiHoi:-1, anTang:-1 },
  { id:88, name:"Trùng Tang", info:"Kỵ cưới hỏi, an táng, khởi công xây nhà", byMonth:["Giáp","Ất","Kỷ","Bính","Đinh","Kỷ","Canh","Tân","Kỷ","Nhâm","Quý","Kỷ"], xayDung:-5, kinhDoanh:-3, cuoiHoi:-5, anTang:-5 },
  { id:89, name:"Trùng phục", info:"Kỵ cưới hỏi, an táng", byMonth:["Canh","Tân","Kỷ","Nhâm","Quý","Mậu","Giáp","Ất","Kỷ","Nhâm","Quý","Kỷ"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-5 },
  { id:90, name:"Chu tước hắc đạo", info:"Kỵ nhập trạch, khai trương", byMonth:["Mão","Tỵ","Mùi","Dậu","Hợi","Sửu","Mão","Tỵ","Mùi","Dậu","Hợi","Sửu"], xayDung:-5, kinhDoanh:-5, cuoiHoi:-1, anTang:-1 },
  { id:91, name:"Bạch hổ", info:"Kỵ mai táng", byMonth:["Ngọ","Thân","Tuất","Tý","Dần","Thìn","Ngọ","Thân","Tuất","Tý","Dần","Thìn"], xayDung:-3, kinhDoanh:-3, cuoiHoi:-3, anTang:-5 },
  { id:92, name:"Huyền Vũ", info:"Kỵ mai táng", byMonth:["Dậu","Hợi","Tỵ","Mão","Sửu","Mùi","Dậu","Hợi","Tỵ","Mão","Sửu","Mùi"], xayDung:-2, kinhDoanh:-2, cuoiHoi:-2, anTang:-5 },
  { id:93, name:"Câu Trận", info:"Kỵ mai táng", byMonth:["Hợi","Tỵ","Mão","Sửu","Mùi","Dậu","Hợi","Tỵ","Mão","Sửu","Mùi","Dậu"], xayDung:-2, kinhDoanh:-2, cuoiHoi:-2, anTang:-5 },
  { id:94, name:"Lôi công", info:"Xấu với xây dựng nhà cửa", byMonth:["Dần","Hợi","Tỵ","Thân","Dần","Hợi","Tỵ","Thân","Dần","Hợi","Tỵ","Thân"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:95, name:"Cô thần", info:"Xấu với cưới hỏi", byMonth:["Tuất","Hợi","Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:96, name:"Quả tú", info:"Xấu với cưới hỏi", byMonth:["Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi","Tý","Sửu","Dần","Mão"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:97, name:"Sát chủ", info:null, byMonth:["Tỵ","Tý","Mùi","Mão","Thân","Tuất","Sửu","Hợi","Ngọ","Dậu","Dần","Thìn"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:98, name:"Nguyệt Hình", info:null, byMonth:["Tỵ","Tý","Thìn","Thân","Ngọ","Sửu","Dần","Dậu","Mùi","Hợi","Mão","Tuất"], xayDung:-4, kinhDoanh:-4, cuoiHoi:-4, anTang:-4 },
  { id:99, name:"Tội chỉ", info:"Xấu với tế tự, kiện cáo", byMonth:["Ngọ","Tý","Mùi","Sửu","Thân","Dần","Dậu","Mão","Tuất","Thìn","Hợi","Tỵ"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-1, anTang:-4 },
  { id:100, name:"Nguyệt Kiến chuyển sát", info:"Kỵ động thổ", byMonth:["Mão","Mão","Mão","Ngọ","Ngọ","Ngọ","Dậu","Dậu","Dậu","Tý","Tý","Tý"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:101, name:"Thiên địa  chính chuyển", info:"Kỵ động thổ", byMonth:["Quý_Mão","Quý_Mão","Quý_Mão","Bính_Ngọ","Bính_Ngọ","Bính_Ngọ","Đinh_Dậu","Đinh_Dậu","Đinh_Dậu","Canh_Tý","Canh_Tý","Canh_Tý"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:102, name:"Thiên địa chuyển sát", info:"Kỵ động thổ", byMonth:["Ất_Mão","Ất_Mão","Ất_Mão","Bính_Ngọ","Bính_Ngọ","Bính_Ngọ","Tân_Dậu","Tân_Dậu","Tân_Dậu","Nhâm_Tý","Nhâm_Tý","Nhâm_Tý"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:103, name:"Lỗ ban sát", info:"Kỵ khởi tạo", byMonth:["Tý","Tý","Tý","Mão","Mão","Mão","Ngọ","Ngọ","Ngọ","Dậu","Dậu","Dậu"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:104, name:"Phủ đầu dát", info:"Kỵ khởi tạo", byMonth:["Thìn","Thìn","Thìn","Mùi","Mùi","Mùi","Dậu","Dậu","Dậu","Tý","Tý","Tý"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-1 },
  { id:105, name:"Tam tang", info:"Kỵ khởi tạo, cưới hỏi, an táng", byMonth:["Thìn","Thìn","Thìn","Mùi","Mùi","Mùi","Tuất","Tuất","Tuất","Sửu","Sửu","Sửu"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-5, anTang:-5 },
  { id:106, name:"Ngũ hư", info:"Kỵ khởi tạo, cưới hỏi, an táng", byMonth:["Tỵ","Dậu","Sửu","Thân","Tý","Thìn","Hợi","Mão","Mùi","Dần","Ngọ","Tuất"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-5, anTang:-5 },
  { id:107, name:"Tứ thời đại mộ", info:"Kỵ an táng", byMonth:["Ất_Mùi","Ất_Mùi","Ất_Mùi","Bính_Tuất","Bính_Tuất","Bính_Tuất","Tân_Sửu","Tân_Sửu","Tân_Sửu","Nhâm_Thìn","Nhâm_Thìn","Nhâm_Thìn"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-1, anTang:-5 },
  { id:108, name:"Thổ cẩm", info:"Kỵ xây dựng, an táng", byMonth:["Hợi","Hợi","Hợi","Dần","Dần","Dần","Tỵ","Tỵ","Tỵ","Thân","Thân","Thân"], xayDung:-5, kinhDoanh:-1, cuoiHoi:-1, anTang:-5 },
  { id:109, name:"Ly sàng", info:"Kỵ cưới hỏi", byMonth:["Dậu","Dậu","Dậu","Dần Ngọ","Dần Ngọ","Dần Ngọ","Tuất","Tuất","Tuất","Tỵ","Tỵ","Tỵ"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:110, name:"Tứ thời cô quả", info:"Kỵ cưới hỏi", byMonth:["Sửu","Sửu","Sửu","Thìn","Thìn","Thìn","Mùi","Mùi","Mùi","Tuất","Tuất","Tuất"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:111, name:"Không phòng", info:"Kỵ cưới hỏi", byMonth:["Thìn","Tỵ","Tý","Tuất","Hợi","Mùi","Dần","Mão","Ngọ","Thân","Dậu","Sửu"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-5, anTang:-1 },
  { id:112, name:"Âm thác", info:"Kỵ xuất hành, cưới hỏi, an táng", byMonth:["Canh_Tuất","Tân_Dậu","Canh_Thân","Đinh_Mùi","Bính_Ngọ","Đinh_Tỵ","Giáp_Thìn","Ất_Mão","Giáp_Dần","Quý_Sửu","Nhâm_Tý","Quý_Hợi"], xayDung:-1, kinhDoanh:-5, cuoiHoi:-5, anTang:-5 },
  { id:113, name:"Dương thác", info:"Kỵ xuất hành, cưới hỏi, an táng", byMonth:["Giáp_Dần","Ất_Mão","Giáp_Thìn","Đinh_Tỵ","Bính_Ngọ","Đinh_Mùi","Canh_Thân","Tân_Dậu","Canh_Tuất","Quý_Hợi","Nhâm_Tý","Quý_Sửu"], xayDung:-1, kinhDoanh:-5, cuoiHoi:-5, anTang:-5 },
  { id:114, name:"Quỷ khốc", info:"Xấu với tế tự, mai táng", byMonth:["Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất","Tuất"], xayDung:-1, kinhDoanh:-1, cuoiHoi:-1, anTang:-5 },
];

// ─── 28 Sao Nhị Thập Bát Tú ─────────────────────────────────────────────────
export interface NhiThapBatTuInfo {
  id: number; sao: string; tot: string | null; xau: string | null;
  xayDung: number; kinhDoanh: number; cuoiHoi: number; anTang: number;
}

export const NHI_THAP_BAT_TU: NhiThapBatTuInfo[] = [
  { id:1, sao:"Sao Giác - Giác mộc Giao", tot:"Dần", xau:"Ngọ", xayDung:3, kinhDoanh:3, cuoiHoi:3, anTang:0 },
  { id:2, sao:"Sao Cang - Cang kim Long", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:3, sao:"Sao Đê - Đê thổ Lạc", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:4, sao:"Sao Phòng - Phòng nhật Thố", tot:null, xau:"Tỵ", xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:5, sao:"Sao Tâm - Tâm nguyệt Hồ", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:6, sao:"Sao Vĩ - Vĩ hỏa Hổ", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:7, sao:"Sao Cơ - Cơ thủy Báo", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:8, sao:"Sao Đẩu - Đẩu mộc Giải", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:9, sao:"Sao Ngưu - Ngưu kim Ngưu", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:10, sao:"Sao Nữ - Nữ thổ Bức", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:11, sao:"Sao Hư - Hư nhật Thử", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:12, sao:"Sao Nguy - Nguy nguyệt Yến", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:4 },
  { id:13, sao:"Sao Thất - Thất hỏa Trư", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:14, sao:"Sao Bích - Bích thủy Du", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:15, sao:"Sao Khuê - Khuê mộc Lang", tot:null, xau:null, xayDung:2, kinhDoanh:2, cuoiHoi:0, anTang:0 },
  { id:16, sao:"Sao Lâu - Lâu kim Cẩu", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:17, sao:"Sao Vị - Vị thổ Trĩ", tot:null, xau:"Dần", xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:18, sao:"Sao Mão - Mão nhật Kê", tot:null, xau:null, xayDung:1, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:19, sao:"Sao Tất - Tất nguyệt Ô", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:20, sao:"Sao Chuỷ - Chuỷ hỏa Hầu", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:21, sao:"Sao Sâm - Sâm thủy Viên", tot:null, xau:null, xayDung:4, kinhDoanh:4, cuoiHoi:0, anTang:0 },
  { id:22, sao:"Sao Tỉnh - Tỉnh mộc Hãn", tot:null, xau:null, xayDung:4, kinhDoanh:4, cuoiHoi:2, anTang:0 },
  { id:23, sao:"Sao Quỷ - Quỷ kim Dương", tot:null, xau:"Thân", xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:24, sao:"Sao Liễu - Liễu thổ Chương", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:25, sao:"Sao Tinh - Tinh nhật Mã", tot:null, xau:null, xayDung:2, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:26, sao:"Sao Trương - Trương nguyệt Lộc", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
  { id:27, sao:"Sao Dực - Dực hỏa Xà", tot:null, xau:null, xayDung:0, kinhDoanh:0, cuoiHoi:0, anTang:0 },
  { id:28, sao:"Sao Chẩn - Chẩn thủy Dẫn", tot:null, xau:null, xayDung:5, kinhDoanh:5, cuoiHoi:5, anTang:5 },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Lấy Trực từ JDN + tháng âm lịch */
export function getTrucByJDN(jdn: number, lunarMonth: number): TrucInfo {
  const idx = ((jdn + lunarMonth) % 12 + 12) % 12;
  return NGAY_TRUC[idx];
}

/** Kiểm tra ngày âm lịch có phải Nguyệt Kỵ không (5,14,23 mọi tháng) */
export function isNguyetKy(lunarDay: number): boolean {
  return [5,14,23].includes(lunarDay);
}

/** Kiểm tra ngày âm lịch có phải Tam Nương không (3,7,13,18,22,27 mọi tháng) */
export function isTamNuong(lunarDay: number): boolean {
  return [3,7,13,18,22,27].includes(lunarDay);
}

/** Kiểm tra Vãng Vong: CHI ngày trùng với chi xấu của tháng âm lịch đó */
export function isVangVong(chiDay: number, lunarMonth: number): boolean {
  // byMonth[0..11] = chi xấu của tháng 1..12
  const vv = NGAY_XAU[0]; // Vãng Vong
  const chiXau = vv.byMonth[lunarMonth - 1];
  if (!chiXau) return false;
  const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  return CHI[chiDay] === chiXau;
}

/** Tìm các sao tốt xuất hiện trong ngày (theo Can Chi ngày + tháng âm lịch) */
export function getSaosForDay(canChiDay: string, lunarMonth: number): SaoInfo[] {
  const result: SaoInfo[] = [];
  const can = canChiDay.split(' ')[0];
  const chi = canChiDay.split(' ')[1] ?? '';
  for (const sao of SAO_TOT_XAU) {
    const v = sao.byMonth[lunarMonth - 1];
    if (!v) continue;
    // Match Can hoặc Chi hoặc CanChi
    if (v === can || v === chi || v === canChiDay.replace(' ','_')) {
      result.push(sao);
    }
  }
  return result;
}