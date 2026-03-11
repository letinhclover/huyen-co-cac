// Xem Tuổi Hợp Nhau + Làm Ăn — data từ app Lịch VN

// ─── Ngũ Hành ─────────────────────────────────────────────
export const NGU_HANH_CAN: Record<string, string> = {
  'Giáp':'moc','Ất':'moc','Bính':'hoa','Đinh':'hoa','Mậu':'tho','Kỷ':'tho','Canh':'kim','Tân':'kim','Nhâm':'thuy','Quý':'thuy'
};
export const NGU_HANH_CHI: Record<string, string> = {
  'Tý':'thuy','Sửu':'tho','Dần':'moc','Mão':'moc','Thìn':'tho','Tỵ':'hoa','Ngọ':'hoa','Mùi':'tho','Thân':'kim','Dậu':'kim','Tuất':'tho','Hợi':'thuy'
};
// Tương sinh: moc→hoa→tho→kim→thuy→moc
export const TUONG_SINH: Record<string,string> = {'moc':'hoa','hoa':'tho','tho':'kim','kim':'thuy','thuy':'moc'};
// Tương khắc: moc←kim, hoa←thuy, tho←moc, kim←hoa, thuy←tho
export const TUONG_KHAC: Record<string,string> = {'kim':'moc','thuy':'hoa','moc':'tho','hoa':'kim','tho':'thuy'};

// Nạp âm theo Can Chi
export const NAP_AM: Record<string,string> = {
  "Giáp Tý":"kim","Ất Sửu":"kim",
  "Bính Dần":"hoa","Đinh Mão":"hoa",
  "Mậu Thìn":"moc","Kỷ Tỵ":"moc",
  "Canh Ngọ":"tho","Tân Mùi":"tho",
  "Nhâm Thân":"kim","Quý Dậu":"kim",
  "Giáp Tuất":"hoa","Ất Hợi":"hoa",
  "Bính Tý":"thuy","Đinh Sửu":"thuy",
  "Mậu Dần":"tho","Kỷ Mão":"tho",
  "Canh Thìn":"kim","Tân Tỵ":"kim",
  "Nhâm Ngọ":"moc","Quý Mùi":"moc",
  "Giáp Thân":"thuy","Ất Dậu":"thuy",
  "Bính Tuất":"tho","Đinh Hợi":"tho",
  "Mậu Tý":"hoa","Kỷ Sửu":"hoa",
  "Canh Dần":"moc","Tân Mão":"moc",
  "Nhâm Thìn":"thuy","Quý Tỵ":"thuy",
  "Giáp Ngọ":"kim","Ất Mùi":"kim",
  "Bính Thân":"hoa","Đinh Dậu":"hoa",
  "Mậu Tuất":"moc","Kỷ Hợi":"moc",
  "Canh Tý":"tho","Tân Sửu":"tho",
  "Nhâm Dần":"kim","Quý Mão":"kim",
  "Giáp Thìn":"hoa","Ất Tỵ":"hoa",
  "Bính Ngọ":"thuy","Đinh Mùi":"thuy",
  "Mậu Thân":"tho","Kỷ Dậu":"tho",
  "Canh Tuất":"kim","Tân Hợi":"kim",
  "Nhâm Tý":"moc","Quý Sửu":"moc",
  "Giáp Dần":"thuy","Ất Mão":"thuy",
  "Bính Thìn":"tho","Đinh Tỵ":"tho",
  "Mậu Ngọ":"hoa","Kỷ Mùi":"hoa",
  "Canh Thân":"moc","Tân Dậu":"moc",
  "Nhâm Tuất":"thuy","Quý Hợi":"thuy"
};

// Tứ trụ xung hợp
// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
export const LUC_HOP: [string,string][] = [
  ['Tý','Sửu'],['Dần','Hợi'],['Mão','Tuất'],['Thìn','Dậu'],['Tỵ','Thân'],['Ngọ','Mùi']
];
// Lục xung: Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
export const LUC_XUNG: [string,string][] = [
  ['Tý','Ngọ'],['Sửu','Mùi'],['Dần','Thân'],['Mão','Dậu'],['Thìn','Tuất'],['Tỵ','Hợi']
];
// Tam hợp: Thân-Tý-Thìn, Dần-Ngọ-Tuất, Hợi-Mão-Mùi, Tỵ-Dậu-Sửu
export const TAM_HOP: string[][] = [
  ['Thân','Tý','Thìn'],['Dần','Ngọ','Tuất'],['Hợi','Mão','Mùi'],['Tỵ','Dậu','Sửu']
];

export interface TuoiHopResult {
  diem: number;
  xepLoai: string;
  danhGia: string;
  chi_tiet: string[];
  khuyen_nghi: string;
  mau: string;
}

export interface KetLuanEntry {
  diem: string; danh_gia: string; tong_quan: string;
  giai_phap: string[];
  ket_luan: string;
}

export const KET_LUAN_CAP_DOI: KetLuanEntry[] = [
  { diem:"0-3", danh_gia:"KHÔNG HỢP VỀ MỆNH LÝ", tong_quan:"Cặp đôi này có mức độ tương hợp về tử vi – phong thủy khá thấp, thể hiện sự bất đồng rõ rệt về nhiều mặt, từ ngũ hành, can chi đến cung phi và mệnh khí tổng thể.", giai_phap:["Chọn ngày cưới/phối kết cát nhật để hóa giải.", "Sinh con hợp tuổi bố mẹ để cân bằng khí cục.", "Bài trí phong thủy cá nhân hoặc nơi ở theo nguyên lý bù trừ hành khí."], ket_luan:"Mối quan hệ này không thuận theo mệnh lý, nhưng điều đó không có nghĩa là không có tương lai. Nếu có đủ tình cảm, sự tôn trọng và nỗ lực cùng nhau vượt qua khó khăn, thì hoàn toàn có thể biến trở ngại thành động lực phát triển." },
  { diem:"4-5", danh_gia:"HỢP VỪA PHẢI, CẦN NỖ LỰC HÒA HỢP", tong_quan:"Cặp đôi này có mức hợp tuổi trung bình, mối quan hệ vừa có duyên vừa kèm theo thử thách, tồn tại một số yếu tố tương hợp nhưng cũng ẩn chứa nhiều mâu thuẫn về mặt tử vi – phong thủy.", giai_phap:["Không nên quyết định vội vàng khi có mâu thuẫn – nên lùi lại một bước để nhìn nhận tổng thể.", "Nếu định tiến tới hôn nhân hoặc làm ăn chung, nên chọn ngày – giờ hợp mệnh, tránh đại kỵ.", "Có thể dùng phong thủy cá nhân, màu sắc, hướng hợp mệnh để bổ trợ (ví dụ: trang phục, trang sức, vật phẩm...)."], ket_luan:"Mối quan hệ ở mức “vừa phải”, không xung phá nghiêm trọng nhưng cũng không phải lý tưởng tuyệt đối. Nếu cả hai có đủ hiểu biết, thiện chí và cùng nhau vun đắp, vẫn hoàn toàn có thể tiến xa và tạo dựng nền tảng bền vững." },
  { diem:"6-7", danh_gia:"TƯƠNG HỢP, CÓ NỀN TẢNG VỮNG CHẮC", tong_quan:"Cặp đôi này có sự hòa hợp khá tốt về mặt mệnh lý – phong thủy, đủ nền tảng để xây dựng một mối quan hệ ổn định, thuận chiều và có khả năng phát triển bền vững.", giai_phap:["Chọn thời điểm cưới hỏi, xây nhà, sinh con... theo hướng cát lợi.", "Cùng nhau làm những việc thiện, tích đức giúp nâng khí vận cho cả hai.", "Nếu có điểm nào chưa lý tưởng có thể dùng phương pháp “lấy vượng hóa xung” để hóa giải."], ket_luan:"Mối quan hệ này có nhiều điểm tương hợp, là nền móng vững vàng để cùng nhau xây dựng tương lai. Nếu duy trì được sự tin tưởng, sẻ chia và điều chỉnh linh hoạt, hai người hoàn toàn có thể đạt được hạnh phúc dài lâu và phát triển thịnh vượng trong cả đời sống lẫn công việc." },
  { diem:"8-10", danh_gia:"RẤT HỢP – DUYÊN LÀNH ĐẦY ĐỦ", tong_quan:"Cặp đôi này có sự hòa hợp sâu sắc cả về mệnh lý, khí cục và nhân duyên, được xem là tổ hợp lý tưởng mà nhiều người mong cầu khi xem tuổi, biểu hiện cho duyên lành – khí thuận – vận cát.", giai_phap:["Chọn ngày giờ đại cát để khởi sự, nâng thêm khí vượng.", "Sinh con trong năm/tháng hợp mệnh để gia đạo càng thêm vượng phát.", "Tham gia các hoạt động thiện nguyện, phát tâm giúp đời – tích thêm phúc đức, nâng tầm phúc khí chung."], ket_luan:"Đây là một cặp đôi có đủ phúc duyên – căn khí để đồng hành lâu dài và thịnh vượng. Nếu nuôi dưỡng được tình cảm và cùng nhau vun bồi đạo đức – trí tuệ – công đức, thì không chỉ cuộc sống viên mãn mà còn lan tỏa cát khí đến thế hệ sau." },
];

export const KET_LUAN_LAM_AN: KetLuanEntry[] = [
  { diem:"0-3", danh_gia:"CẦN CÂN NHẮC TRONG HỢP TÁC KINH DOANH", tong_quan:"Với tổng điểm 0-3 điểm trên thang điểm 10, đây là mức cho thấy hai người chưa có nhiều sự tương hợp về mặt mệnh lý – phong thủy trong việc kết hợp làm ăn. Các yếu tố như ngũ hành, can chi hoặc cung phi có thể chưa tạo ra được sự hỗ trợ rõ nét cho nhau.", giai_phap:["Phân chia công việc theo sở trường, tránh giẫm chân nhau.", "Chọn thời điểm bắt đầu công việc hợp cát khí để tăng sinh khí chung.", "Có thể dùng vật phẩm phong thủy hoặc hướng không gian làm việc phù hợp để điều tiết luồng khí."], ket_luan:"Mặc dù chưa đạt mức hợp lý tưởng về tuổi mệnh, nhưng nếu cả hai có sự tin tưởng – phối hợp rõ ràng – hướng tới mục tiêu chung, thì vẫn có thể tạo nên một mối quan hệ làm ăn ổn định. Điều quan trọng là cách vận hành – quản lý – và thiện chí của mỗi người trong quá trình hợp tác." },
  { diem:"4-5", danh_gia:"HỢP VỪA PHẢI, CẦN LƯU Ý TRONG PHỐI HỢP", tong_quan:"Tổng điểm 4-5 điểm trên thang điểm 10 phản ánh một mức hợp tuổi ở mức trung bình trong quan hệ hợp tác làm ăn. Có những yếu tố mệnh lý hỗ trợ nhẹ, nhưng đồng thời cũng tồn tại một số xung khắc tiềm ẩn, cần lưu ý trong quá trình phối hợp công việc.", giai_phap:["Phân vai trò rõ ràng, tránh cùng điều hành một việc hoặc can thiệp quá sâu vào phần việc của nhau.", "Tìm kiếm một người trung gian hợp cả hai tuổi để cùng tham gia điều phối hoặc cố vấn.", "Ứng dụng các biện pháp phong thủy cải khí như chọn ngày tốt, bố trí bàn làm việc theo mệnh, dùng biểu tượng chiêu tài – hòa hợp."], ket_luan:"Đây là một sự kết hợp chưa hoàn toàn tương trợ, nhưng không quá xung khắc. Nếu cả hai chân thành – có chung tầm nhìn – và biết tận dụng điểm mạnh mỗi người, vẫn có thể cùng nhau tạo ra kết quả tốt đẹp. Điều quan trọng là sự linh hoạt trong ứng xử và thiết lập cơ chế hợp tác hiệu quả." },
  { diem:"6-7", danh_gia:"TƯƠNG HỢP TỐT, CÓ THỂ PHÁT TRIỂN LÂU DÀI", tong_quan:"Mức điểm 6–7 trên thang 10 cho thấy hai người có nền tảng mệnh lý tương đối hài hòa trong việc kết hợp làm ăn. Đây là mức điểm hợp lý để bắt đầu hoặc duy trì một mối quan hệ hợp tác có định hướng, dễ đạt hiệu quả nếu cả hai biết phối hợp và bổ trợ cho nhau đúng cách.", giai_phap:["Ký kết – mở rộng – phát triển quy mô kinh doanh nếu có kế hoạch cụ thể.", "Xây dựng hệ thống quản lý rõ ràng để tận dụng sức mạnh mỗi người.", "Có thể chọn ngày khởi sự lớn hoặc khai trương dựa trên tuổi cả hai để cộng hưởng sinh khí."], ket_luan:"Mối quan hệ này có tiềm năng tốt để trở thành một cặp đôi cộng sự đáng tin cậy. Nếu duy trì được sự cân bằng giữa tình cảm, trách nhiệm và mục tiêu chung, hai người hoàn toàn có thể đồng hành dài hạn và đạt được thành quả đáng kể trong công việc." },
  { diem:"8-10", danh_gia:"RẤT HỢP – CỘNG HƯỞNG SINH KHÍ, VƯỢNG TÀI LỘC", tong_quan:"Tổng điểm 8-10 điểm phản ánh một mối quan hệ tương hợp mạnh mẽ về mệnh lý, ngũ hành và phong thủy, rất thuận lợi cho việc hợp tác làm ăn. Hai bạn hội tụ nhiều yếu tố “thiên thời – địa lợi – nhân hòa” để xây dựng một quan hệ kinh doanh phát triển bền vững và thịnh vượng.", giai_phap:["Ký kết hợp đồng, mở rộng đầu tư, triển khai kế hoạch lớn.", "Chọn ngày giờ đại cát để khai trương – ra mắt sản phẩm, nhân đôi cát khí.", "Áp dụng phong thủy hợp mệnh cả hai để tối ưu hóa không gian làm việc – bàn thờ Thần Tài – hướng đặt biểu tượng tài lộc."], ket_luan:"Đây là một cặp đôi hợp tác lý tưởng, cộng hưởng mạnh về năng lượng mệnh lý lẫn định hướng phát triển. Nếu kết hợp thêm năng lực thực tế, sự minh bạch và chiến lược rõ ràng, hai người hoàn toàn có thể tạo dựng một hành trình kinh doanh thành công, bền vững và mang lại nhiều giá trị cho cộng đồng." },
];