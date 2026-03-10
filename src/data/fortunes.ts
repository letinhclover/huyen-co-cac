// ============================================================
// fortunes.ts — Huyền Cơ Các: Data Kho Thông Điệp
// Tone: Hiện đại, Gen Z, chữa lành, như người bạn thân
// ============================================================

export interface OracleMessage {
  id: number;
  category: "love" | "work" | "healing" | "motivation" | "money" | "friendship";
  categoryLabel: string;
  emoji: string;
  title: string;
  message: string;
  action: string;
}

export interface EnergyAdvice {
  id: number;
  level: "high" | "medium" | "low";
  energyRange: [number, number];
  emoji: string;
  headline: string;
  advice: string;
  tip: string;
}

// ─── 30 Oracle Messages ───────────────────────────────────────

export const ORACLE_MESSAGES: OracleMessage[] = [
  {
    id: 1,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "🌸",
    title: "Trái tim đang mở ra",
    message:
      "Có một người đang để ý bạn nhiều hơn bạn nghĩ đấy. Đừng vội vàng, cứ là phiên bản tốt nhất của mình và để mọi thứ tự nhiên diễn ra nhé. Tình yêu đẹp nhất là tình yêu không cần cố gắng quá mức.",
    action: "Hôm nay hãy mỉm cười nhiều hơn",
  },
  {
    id: 2,
    category: "work",
    categoryLabel: "Công Việc",
    emoji: "⚡",
    title: "Ngày của sự bứt phá",
    message:
      "Tuyệt vời! Hôm nay là một ngày siêu hợp để bạn chốt sale, thuyết phục đối tác, hoặc đề xuất ý tưởng mới. Năng lượng của bạn đang ở đỉnh cao — sếp sẽ dễ tính hơn bình thường, hãy tận dụng thôi!",
    action: "Gửi email/tin nhắn quan trọng sáng nay",
  },
  {
    id: 3,
    category: "healing",
    categoryLabel: "Chữa Lành",
    emoji: "🌙",
    title: "Ổn với việc không ổn",
    message:
      "Bạn không cần phải mạnh mẽ mọi lúc đâu nha. Nếu hôm nay bạn cảm thấy mệt mỏi hay buồn — đó là hoàn toàn bình thường. Hãy cho phép bản thân được nghỉ ngơi, xem một bộ phim yêu thích, và đừng áp lực thêm gì nữa.",
    action: "Tắt thông báo 2 tiếng và nạp lại năng lượng",
  },
  {
    id: 4,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "🔥",
    title: "Đây chính là thời điểm của bạn",
    message:
      "Cái khoảnh khắc bạn đang chờ đợi — nó đang đến gần hơn bạn tưởng. Đừng bỏ cuộc chỉ vì chưa thấy kết quả ngay. Hạt giống bạn gieo hôm nay sẽ nở hoa vào đúng thời điểm của nó.",
    action: "Làm một việc nhỏ hướng tới mục tiêu lớn",
  },
  {
    id: 5,
    category: "money",
    categoryLabel: "Tài Chính",
    emoji: "💰",
    title: "Tiền bạc & Sự khôn ngoan",
    message:
      "Hôm nay không hẳn là ngày để chi tiêu lớn, nhưng rất hợp để lên kế hoạch tài chính. Ngồi lại review thu chi tháng này xem — bạn có thể tìm ra một khoản 'rò rỉ' mà bạn chưa để ý đó.",
    action: "Check app ví điện tử và lên budget tuần tới",
  },
  {
    id: 6,
    category: "friendship",
    categoryLabel: "Bạn Bè",
    emoji: "🫂",
    title: "Kết nối lại đi",
    message:
      "Có một người bạn cũ mà bạn lâu rồi chưa liên lạc — họ đang nhớ bạn đấy! Đừng đợi dịp đặc biệt, một tin nhắn ngắn 'Dạo này mày có khỏe không?' là đủ để thắp lại một tình bạn đẹp.",
    action: "Nhắn tin cho 1 người bạn cũ hôm nay",
  },
  {
    id: 7,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "💝",
    title: "Bắt đầu từ chính mình",
    message:
      "Bạn không thể yêu ai đó tốt hơn mức bạn yêu bản thân mình. Hôm nay hãy làm gì đó thật sự vì bản thân — không phải để chứng tỏ, không phải vì ai — chỉ đơn giản là vì bạn xứng đáng được đối xử tốt.",
    action: "Tự thưởng cho mình một điều gì đó nhỏ nhoi",
  },
  {
    id: 8,
    category: "work",
    categoryLabel: "Công Việc",
    emoji: "🎯",
    title: "Focus và Go",
    message:
      "Hôm nay bạn có khả năng tập trung siêu cao — đừng để những cuộc hội thoại vô bổ hay mạng xã hội cướp đi điều đó. Khóa điện thoại 2 tiếng, đeo tai nghe và vào guồng. Bạn sẽ ngạc nhiên với những gì mình làm được.",
    action: "Thử Pomodoro: 25 phút làm việc - 5 phút nghỉ",
  },
  {
    id: 9,
    category: "healing",
    categoryLabel: "Chữa Lành",
    emoji: "🍵",
    title: "Trở về với hiện tại",
    message:
      "Tâm trí bạn đang lang thang về quá khứ hoặc lo lắng về tương lai phải không? Hãy thở sâu 3 lần. Nhìn xung quanh và tìm 5 thứ bạn thấy ngay lúc này. Hiện tại mới là nơi thực sự của bạn.",
    action: "Thử thiền 5 phút hoặc đi bộ không nhìn điện thoại",
  },
  {
    id: 10,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "🌅",
    title: "Mỗi ngày là một tờ giấy trắng",
    message:
      "Hôm qua có tệ đến đâu thì cũng qua rồi. Hôm nay là một cơ hội hoàn toàn mới. Bạn không cần phải hoàn hảo — bạn chỉ cần tiến về phía trước dù chỉ một bước nhỏ thôi.",
    action: "Viết ra 3 điều bạn biết ơn sáng hôm nay",
  },
  {
    id: 11,
    category: "money",
    categoryLabel: "Tài Chính",
    emoji: "📈",
    title: "Đầu tư vào bản thân",
    message:
      "Khoản đầu tư sinh lời nhất không phải cổ phiếu hay bất động sản — đó là kỹ năng của chính bạn. Hôm nay có phải thời điểm tốt để đăng ký một khóa học hoặc đọc một cuốn sách mà bạn đang trì hoãn không?",
    action: "Dành 30 phút học điều gì đó mới hôm nay",
  },
  {
    id: 12,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "🌺",
    title: "Đừng vội kết luận",
    message:
      "Trong chuyện tình cảm hôm nay, đừng vội diễn giải hành động của đối phương theo hướng tiêu cực. Họ có thể chỉ đang bận hoặc không biết cách thể hiện. Một cuộc trò chuyện thẳng thắn sẽ tốt hơn ngàn lần giả định.",
    action: "Nói thẳng điều bạn muốn, đừng hint vòng vèo",
  },
  {
    id: 13,
    category: "friendship",
    categoryLabel: "Bạn Bè",
    emoji: "🥂",
    title: "Năng lượng cộng hưởng",
    message:
      "Bạn trở thành phiên bản trung bình của 5 người bạn dành nhiều thời gian nhất. Hôm nay hãy nhìn lại — ai đang truyền cho bạn năng lượng tích cực và ai đang hút cạn nó? Đây là thông tin quan trọng để bạn quyết định.",
    action: "Lên lịch gặp người bạn truyền cảm hứng nhất",
  },
  {
    id: 14,
    category: "work",
    categoryLabel: "Công Việc",
    emoji: "🤝",
    title: "Collaboration beats Competition",
    message:
      "Hôm nay đừng cố gắng làm anh hùng một mình. Hãy hỏi đồng nghiệp giỏi hơn bạn, lắng nghe ý kiến khác, hoặc hợp tác thay vì cạnh tranh. Thành công đến từ tập thể thường bền vững hơn nhiều.",
    action: "Nhờ ai đó giỏi hơn bạn review một việc hôm nay",
  },
  {
    id: 15,
    category: "healing",
    categoryLabel: "Chữa Lành",
    emoji: "🌊",
    title: "Cảm xúc cũng cần được thở",
    message:
      "Bạn đang kìm nén điều gì đó từ lâu rồi phải không? Cảm xúc không được thể hiện không biến mất — chúng chỉ chìm xuống và tích tụ. Hôm nay hãy tìm một không gian an toàn để giải phóng nó — viết nhật ký, tâm sự với bạn thân, hoặc đơn giản là khóc một chút.",
    action: "Viết ra cảm xúc thật của bạn hôm nay, không filter",
  },
  {
    id: 16,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "⭐",
    title: "Nhỏ nhưng chắc",
    message:
      "Đừng so sánh chương 1 của mình với chương 20 của người khác. Bạn đang ở đúng nơi bạn cần ở — và mỗi ngày bạn cố gắng dù nhỏ thôi, nó vẫn đang tích lũy và dẫn bạn đến nơi bạn muốn.",
    action: "Chụp lại một khoảnh khắc bạn tự hào hôm nay",
  },
  {
    id: 17,
    category: "money",
    categoryLabel: "Tài Chính",
    emoji: "🛡️",
    title: "Quỹ dự phòng là bạn thân",
    message:
      "Bình yên tài chính không phải về việc kiếm nhiều tiền — đó là về việc không hoảng loạn khi có sự cố bất ngờ. Nếu bạn chưa có quỹ khẩn cấp, hôm nay là ngày tốt để bắt đầu, dù chỉ 100k một tuần.",
    action: "Chuyển một khoản nhỏ vào tài khoản tiết kiệm riêng",
  },
  {
    id: 18,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "🕊️",
    title: "Buông bỏ để đón nhận",
    message:
      "Có những thứ bạn đang giữ chặt quá — một mối quan hệ không còn phù hợp, một kỳ vọng không thực tế, hoặc một người không đáp lại. Buông không phải là thua cuộc. Buông là để tay bạn rảnh ra đón điều tốt hơn đang đến.",
    action: "Hít thở và thực hành buông bỏ một điều nhỏ hôm nay",
  },
  {
    id: 19,
    category: "work",
    categoryLabel: "Công Việc",
    emoji: "🌱",
    title: "Sáng tạo từ sự tĩnh lặng",
    message:
      "Ý tưởng hay nhất thường đến khi bạn không chủ động tìm nó — khi đi tắm, khi đi bộ, khi nằm nhìn trần nhà. Hôm nay đừng force ý tưởng. Hãy để não bạn thở, và chú ý những gì bỗng nhiên xuất hiện.",
    action: "Đi dạo 15 phút không nghe podcast/nhạc, chỉ suy nghĩ",
  },
  {
    id: 20,
    category: "healing",
    categoryLabel: "Chữa Lành",
    emoji: "🌿",
    title: "Cơ thể cũng cần được nghe",
    message:
      "Khi nào lần cuối cùng bạn thực sự lắng nghe cơ thể mình? Nó đang mệt mỏi? Đói? Căng thẳng? Hôm nay hãy check in với bản thân vật lý: uống đủ nước, ăn gì đó dinh dưỡng, và ngủ đủ giấc tối nay.",
    action: "Đặt alarm nhắc uống nước mỗi 2 tiếng",
  },
  {
    id: 21,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "🦋",
    title: "Giai đoạn nhộng",
    message:
      "Nếu bạn đang cảm thấy lạc lối hoặc trì trệ, đây có thể là giai đoạn 'nhộng' của bạn — giai đoạn biến đổi trước khi bứt phá. Bướm không bay từ kén ra ngay. Hãy tin vào quá trình của mình.",
    action: "Nhìn lại bạn đã thay đổi bao nhiêu trong 1 năm qua",
  },
  {
    id: 22,
    category: "friendship",
    categoryLabel: "Bạn Bè",
    emoji: "🎉",
    title: "Đừng chúc mừng sau lưng",
    message:
      "Người bạn tốt không chỉ ở bên khi bạn khó khăn mà còn vui thật lòng cho thành công của bạn. Và ngược lại — bạn đang cổ vũ bạn bè mình chưa? Hôm nay hãy hỏi thăm và thực sự quan tâm đến điều họ đang làm.",
    action: "Gọi điện (không phải nhắn tin) cho một người bạn thân",
  },
  {
    id: 23,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "✨",
    title: "Hấp dẫn từ sự tự tin",
    message:
      "Điều hấp dẫn nhất ở một người không phải ngoại hình hay tiền bạc — đó là khi họ biết mình là ai và thoải mái với điều đó. Hôm nay hãy làm gì đó khiến bạn cảm thấy tự hào về bản thân mình.",
    action: "Mặc bộ đồ khiến bạn cảm thấy tự tin nhất",
  },
  {
    id: 24,
    category: "money",
    categoryLabel: "Tài Chính",
    emoji: "🎰",
    title: "Cơ hội hay rủi ro?",
    message:
      "Hôm nay có thể bạn nghe thấy một cơ hội 'hot' nào đó — đầu tư, hùn hạp, hoặc kinh doanh cùng ai đó. Hãy dùng quy tắc 24 giờ: đừng quyết định ngay. Ngủ một đêm, hỏi người bạn tin tưởng, rồi mới quyết.",
    action: "Nghiên cứu kỹ trước khi rút ví bất kỳ lúc nào",
  },
  {
    id: 25,
    category: "work",
    categoryLabel: "Công Việc",
    emoji: "📝",
    title: "Nói không cũng là một kỹ năng",
    message:
      "Bạn có đang bị quá tải vì nhận quá nhiều việc không? Học cách từ chối một cách lịch sự nhưng kiên định là siêu kỹ năng trong công việc. 'Tôi rất muốn giúp, nhưng hiện tại mình không có khả năng làm tốt việc này' — hoàn toàn ổn để nói.",
    action: "Xem lại to-do list và xóa bớt những gì không cần thiết",
  },
  {
    id: 26,
    category: "healing",
    categoryLabel: "Chữa Lành",
    emoji: "🕯️",
    title: "Không gian của riêng bạn",
    message:
      "Mọi người đều cần một góc riêng để tái tạo năng lượng — một góc yêu thích trong nhà, một quán cafe quen, hay chỉ là 30 phút trong phòng tắm. Hôm nay hãy tìm và giữ lấy không gian đó cho bản thân.",
    action: "Dọn góc nhỏ yêu thích của bạn, thêm cây/nến/sách",
  },
  {
    id: 27,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "💫",
    title: "Bắt đầu đủ rồi",
    message:
      "Bạn không cần phải sẵn sàng 100% mới bắt đầu. Bắt đầu khi bạn 60% sẵn sàng rồi học thêm dần dần — đó là cách những người thành công thực sự làm. Hành động tạo ra động lực, không phải ngược lại.",
    action: "Bắt đầu một việc bạn đang trì hoãn ngay hôm nay, dù nhỏ",
  },
  {
    id: 28,
    category: "love",
    categoryLabel: "Tình Cảm",
    emoji: "🌹",
    title: "Quan tâm trong những việc nhỏ",
    message:
      "Tình yêu không sống bằng những cử chỉ lãng mạn lớn lao — nó sống trong những điều nhỏ hàng ngày: nhắn tin hỏi ăn chưa, nhớ đồ uống yêu thích của nhau, hoặc chỉ lắng nghe khi đối phương cần nói.",
    action: "Làm một điều nhỏ quan tâm đến người bạn yêu thương hôm nay",
  },
  {
    id: 29,
    category: "friendship",
    categoryLabel: "Bạn Bè",
    emoji: "🌻",
    title: "Ranh giới lành mạnh",
    message:
      "Bạn tốt không có nghĩa là phải có mặt 24/7 cho tất cả mọi người. Ranh giới lành mạnh trong tình bạn giúp cả hai phát triển bền hơn. Ổn để không có mặt đôi khi, miễn là bạn chân thành khi có mặt.",
    action: "Kiểm tra xem mình đang cho đi hay bị rút cạn năng lượng",
  },
  {
    id: 30,
    category: "motivation",
    categoryLabel: "Tinh Thần",
    emoji: "🌟",
    title: "Bạn đang làm tốt hơn bạn nghĩ",
    message:
      "Đôi khi chúng ta quá khắt khe với bản thân và quên nhìn lại mình đã đi được bao xa. Hôm nay hãy dành 5 phút liệt kê 5 điều bạn đã làm được trong tháng qua — bạn sẽ ngạc nhiên đấy. Bạn đang làm tốt lắm rồi.",
    action: "Viết ra 5 thành tựu dù nhỏ của mình trong tháng này",
  },
];

// ─── 30 Energy Advices ────────────────────────────────────────

export const ENERGY_ADVICES: EnergyAdvice[] = [
  // HIGH ENERGY (70-100)
  {
    id: 1,
    level: "high",
    energyRange: [85, 100],
    emoji: "🌟",
    headline: "Năng lượng đang ở đỉnh cao!",
    advice:
      "Hôm nay bạn đang tỏa sáng thực sự! Đây là thời điểm hoàn hảo để gặp gỡ người quan trọng, đề xuất ý tưởng táo bạo hoặc bắt đầu một dự án mới. Mọi người xung quanh sẽ bị cuốn hút bởi năng lượng của bạn.",
    tip: "Tận dụng ngày hôm nay — giải quyết những việc khó nhất trước!",
  },
  {
    id: 2,
    level: "high",
    energyRange: [75, 84],
    emoji: "⚡",
    headline: "Ngày rất thuận lợi cho bạn",
    advice:
      "Năng lượng của bạn đang chảy mượt mà hôm nay. Các mối quan hệ và giao tiếp sẽ suôn sẻ hơn bình thường. Đây là lúc tốt để giải quyết những hiểu lầm hoặc kết nối với người mới.",
    tip: "Nhắn tin hoặc gặp người bạn đang muốn xây dựng quan hệ",
  },
  {
    id: 3,
    level: "high",
    energyRange: [70, 74],
    emoji: "🔆",
    headline: "Vibe hôm nay rất good!",
    advice:
      "Bạn đang ở trạng thái tích cực và sáng tạo. Những ý tưởng ngẫu hứng hôm nay thường là những ý tưởng hay nhất — hãy ghi chú lại ngay khi chúng xuất hiện. Tin vào trực giác của bạn.",
    tip: "Mang theo sổ tay hoặc ghi memo trên điện thoại hôm nay",
  },
  {
    id: 4,
    level: "high",
    energyRange: [80, 100],
    emoji: "🎯",
    headline: "Hôm nay bạn như một nam châm",
    advice:
      "Mọi thứ bạn muốn hút đều đang hướng về phía bạn hôm nay — cơ hội, người tốt, tin vui. Hãy ra ngoài, gặp gỡ, kết nối. Đừng ở nhà và bỏ lỡ năng lượng tuyệt vời này nhé!",
    tip: "Hãy để cửa mở — cả nghĩa đen lẫn nghĩa bóng",
  },
  {
    id: 5,
    level: "high",
    energyRange: [72, 88],
    emoji: "🚀",
    headline: "Chế độ siêu năng lực đã kích hoạt!",
    advice:
      "Khả năng tập trung và quyết đoán của bạn hôm nay đang ở mức cao bất thường. Những quyết định quan trọng — công việc, tài chính, kế hoạch — sẽ được xử lý rất tốt nếu bạn thực hiện hôm nay.",
    tip: "Block 2 tiếng vàng sáng sớm cho work deep nhất",
  },
  {
    id: 6,
    level: "high",
    energyRange: [78, 95],
    emoji: "💫",
    headline: "Sức hút cá nhân của bạn đang max",
    advice:
      "Mọi người xung quanh đang cảm nhận được sự ấm áp và tự tin từ bạn. Đây là ngày tuyệt vời để thuyết trình, phỏng vấn, hoặc có một buổi hẹn đầu tiên đáng nhớ.",
    tip: "Mặc bộ đồ yêu thích nhất và ra ngoài với tâm thế tốt nhất",
  },
  {
    id: 7,
    level: "high",
    energyRange: [76, 92],
    emoji: "🌺",
    headline: "Hôm nay vũ trụ đang ủng hộ bạn",
    advice:
      "Cảm giác mọi thứ 'vào guồng' không phải ngẫu nhiên — đó là kết quả của tất cả những nỗ lực bạn đã âm thầm tích lũy. Hôm nay là ngày nhận lại. Hãy đón nhận và cũng chia sẻ năng lượng tốt đó đến người khác.",
    tip: "Trả lời một email/tin nhắn quan trọng bạn đang trì hoãn",
  },

  // MEDIUM ENERGY (40-69)
  {
    id: 8,
    level: "medium",
    energyRange: [55, 69],
    emoji: "☀️",
    headline: "Ngày bình thường nhưng ổn áp",
    advice:
      "Hôm nay không quá thăng hoa nhưng cũng không có gì đáng lo. Đây là ngày lý tưởng để làm những việc cần sự ổn định và kiên nhẫn — review tài liệu, học thêm kỹ năng, hoặc dọn dẹp inbox email.",
    tip: "Hoàn thành những đầu việc nhỏ đang tồn đọng",
  },
  {
    id: 9,
    level: "medium",
    energyRange: [50, 64],
    emoji: "🌤️",
    headline: "Ngày nhịp nhàng và cân bằng",
    advice:
      "Bạn đang ở trạng thái ổn định — không quá hưng phấn, không quá mệt mỏi. Hãy duy trì nhịp đều này. Đây là ngày tốt để xây dựng những thói quen tốt hoặc tiếp tục những dự án dài hạn.",
    tip: "Làm theo kế hoạch — đừng cố improvise hôm nay",
  },
  {
    id: 10,
    level: "medium",
    energyRange: [58, 68],
    emoji: "🌿",
    headline: "Cân bằng là sức mạnh",
    advice:
      "Hôm nay hãy sống chậm lại một chút. Ăn đúng giờ, uống đủ nước, nghỉ ngơi đủ. Những thứ tưởng nhỏ nhặt này mới là nền tảng để bạn bứt phá vào những ngày năng lượng cao hơn sau này.",
    tip: "Tắt điện thoại 30 phút trước khi ngủ tối nay",
  },
  {
    id: 11,
    level: "medium",
    energyRange: [48, 62],
    emoji: "⚖️",
    headline: "Ngày của sự cẩn thận",
    advice:
      "Năng lượng hôm nay hơi trung tính — không hẳn xấu, chỉ là bạn cần thận trọng hơn trong các quyết định và lời nói. Tránh đưa ra cam kết lớn hoặc ký kết hợp đồng nếu chưa xem xét kỹ.",
    tip: "Đọc kỹ trước khi gửi và suy nghĩ trước khi nói",
  },
  {
    id: 12,
    level: "medium",
    energyRange: [52, 66],
    emoji: "🎵",
    headline: "Nhịp điệu vừa phải, đi chắc chắn",
    advice:
      "Như một bài nhạc ở tempo vừa — không quá nhanh để mắc lỗi, không quá chậm để nhàm chán. Hôm nay hãy tận hưởng quá trình làm việc hơn là obsess với kết quả.",
    tip: "Tạo một playlist nhạc phù hợp mood để tăng năng suất",
  },
  {
    id: 13,
    level: "medium",
    energyRange: [45, 60],
    emoji: "🌙",
    headline: "Hôm nay hợp để hướng nội",
    advice:
      "Thay vì ra ngoài gặp gỡ, hôm nay hãy dành thời gian reflect và hoạch định. Viết nhật ký, lên kế hoạch tuần tới, hoặc đọc một cuốn sách hay. Đây là ngày của sự sâu sắc, không phải của sự ồn ào.",
    tip: "Journaling 10 phút trước khi ngủ — rất tốt cho tinh thần",
  },
  {
    id: 14,
    level: "medium",
    energyRange: [55, 65],
    emoji: "🌊",
    headline: "Flow theo dòng chảy hôm nay",
    advice:
      "Đừng chống lại hay force bất cứ điều gì hôm nay. Để mọi thứ chảy tự nhiên. Nếu việc gì không vào thì để đó, chuyển sang việc khác. Sự linh hoạt hôm nay sẽ mang lại kết quả tốt hơn là sự cứng nhắc.",
    tip: "Thử thay đổi thứ tự làm việc thông thường của bạn",
  },
  {
    id: 15,
    level: "medium",
    energyRange: [42, 58],
    emoji: "🍃",
    headline: "Ngày của sự bảo toàn năng lượng",
    advice:
      "Hôm nay không phải lúc để sprint — hãy chạy marathon. Làm ít nhưng làm tốt. Chọn 3 việc quan trọng nhất và hoàn thành chúng thật tốt, hơn là làm 10 việc ở mức 50%.",
    tip: "Áp dụng quy tắc 80/20: 20% công sức cho 80% kết quả",
  },

  // LOW ENERGY (0-39)
  {
    id: 16,
    level: "low",
    energyRange: [25, 39],
    emoji: "🌧️",
    headline: "Năng lượng hơi thấp hôm nay",
    advice:
      "Bạn có thể cảm thấy mệt mỏi, khó tập trung hoặc dễ bực bội hơn bình thường — điều đó hoàn toàn ổn. Hôm nay hãy tự tha thứ cho bản thân và giảm kỳ vọng xuống một chút. Làm được gì thì làm.",
    tip: "Tránh những cuộc tranh luận không cần thiết hôm nay",
  },
  {
    id: 17,
    level: "low",
    energyRange: [20, 34],
    emoji: "☁️",
    headline: "Ngày để nạp lại, không phải tiêu hao",
    advice:
      "Hôm nay năng lượng của bạn cần được bảo vệ, không phải chi tiêu thoải mái. Từ chối những cuộc gặp không cần thiết, đặt giới hạn rõ ràng, và dành thời gian cho những điều nuôi dưỡng bạn thay vì rút cạn bạn.",
    tip: "Nói không ít nhất một lần hôm nay khi cần thiết",
  },
  {
    id: 18,
    level: "low",
    energyRange: [15, 30],
    emoji: "🌫️",
    headline: "Bão đi qua rồi nắng sẽ về",
    advice:
      "Nếu hôm nay cảm thấy nặng nề, đó chỉ là một giai đoạn tạm thời. Đừng đưa ra những quyết định quan trọng khi năng lượng đang thấp. Hãy làm những việc nhỏ, đơn giản và chắc chắn — đó đã là thành công của ngày hôm nay.",
    tip: "Ngủ sớm hơn bình thường 1 tiếng tối nay",
  },
  {
    id: 19,
    level: "low",
    energyRange: [10, 25],
    emoji: "🫧",
    headline: "Cơ thể và tâm trí cần được nghỉ ngơi",
    advice:
      "Hôm nay là tín hiệu để dừng lại và lắng nghe cơ thể. Bạn không cần phải productive mọi lúc. Nghỉ ngơi đúng cách cũng là một dạng sản xuất — nó giúp bạn bứt phá mạnh mẽ hơn vào ngày mai.",
    tip: "Thử ngủ trưa 20 phút hoặc nghỉ giải lao thêm hôm nay",
  },
  {
    id: 20,
    level: "low",
    energyRange: [0, 20],
    emoji: "🌑",
    headline: "Ngày rest hoàn toàn — không có gì sai",
    advice:
      "Một số ngày chúng ta chỉ cần tồn tại và đó là đủ. Pha trà/cà phê, đắp chăn, xem gì đó nhẹ nhàng. Đừng guilt-trip bản thân vì không productive hôm nay. Ngày mai bạn sẽ quay lại với phiên bản tốt hơn.",
    tip: "Gọi điện cho mẹ hoặc người thân yêu thương — sẽ giúp ích",
  },
  {
    id: 21,
    level: "low",
    energyRange: [18, 32],
    emoji: "🌱",
    headline: "Trồng hạt giống trong ngày yên tĩnh",
    advice:
      "Ngày năng lượng thấp không phải ngày xấu — đó là ngày để âm thầm tích lũy. Đọc một bài về lĩnh vực bạn muốn phát triển, lắng nghe một podcast hay, hoặc nhìn lại mục tiêu của mình. Hành động nhỏ, ý nghĩa lớn.",
    tip: "Đọc ít nhất 10 trang sách hoặc nghe 1 podcast hữu ích",
  },
  {
    id: 22,
    level: "low",
    energyRange: [22, 38],
    emoji: "🕯️",
    headline: "Ánh nến nhỏ vẫn sáng trong bóng tối",
    advice:
      "Dù năng lượng hôm nay thấp, vẫn có một điều bạn có thể làm để cảm thấy tốt hơn một chút. Có thể là gọi điện cho bạn thân, làm một món ăn yêu thích, hoặc đơn giản là ra ngồi ngoài ban công hít thở.",
    tip: "Một điều nhỏ khiến bạn smile — hãy làm điều đó ngay hôm nay",
  },
  {
    id: 23,
    level: "low",
    energyRange: [12, 28],
    emoji: "🌛",
    headline: "Hôm nay hợp để chữa lành",
    advice:
      "Khi năng lượng xuống thấp, đó là cách vũ trụ nói với bạn 'Dừng lại và nhìn vào bên trong đi'. Hôm nay dành 15 phút thiền nhẹ hoặc viết ra những gì đang làm phiền bạn — đừng để nó cứ quẩn quanh trong đầu.",
    tip: "Thử app thiền 5 phút: Headspace, Insight Timer, hoặc YouTube",
  },
  {
    id: 24,
    level: "low",
    energyRange: [30, 39],
    emoji: "🍵",
    headline: "Ly trà ấm cũng là liều thuốc",
    advice:
      "Hôm nay năng lượng của bạn hơi thấp và dễ bực mình. Hãy tránh tranh cãi với đồng nghiệp và cẩn thận lời ăn tiếng nói nhé. Tối về nên nghe nhạc nhẹ nhàng, pha một ly trà ấm và để mọi thứ lùi lại.",
    tip: "Nghe playlist nhạc lofi/acoustic tối nay khi về nhà",
  },
  {
    id: 25,
    level: "medium",
    energyRange: [40, 55],
    emoji: "🎨",
    headline: "Ngày phù hợp để sáng tạo",
    advice:
      "Năng lượng ở mức vừa phải hôm nay tạo ra sự cân bằng hoàn hảo giữa logic và cảm xúc — đây là trạng thái lý tưởng nhất cho công việc sáng tạo. Viết lách, thiết kế, vẽ vời, âm nhạc — hãy thử đi.",
    tip: "Dành 30 phút làm điều gì đó creative mà không có deadline",
  },
  {
    id: 26,
    level: "high",
    energyRange: [82, 98],
    emoji: "🏆",
    headline: "Hôm nay là ngày để thắng",
    advice:
      "Không phải ngẫu nhiên bạn cảm thấy mạnh mẽ hôm nay. Hãy dùng năng lượng này một cách có chủ đích — đừng lãng phí vào việc scroll mạng xã hội. Đặt mục tiêu rõ ràng cho ngày hôm nay và go get it!",
    tip: "Viết ra 3 mục tiêu cụ thể cần hoàn thành hôm nay",
  },
  {
    id: 27,
    level: "medium",
    energyRange: [47, 62],
    emoji: "🧩",
    headline: "Xếp mảnh ghép của ngày hôm nay",
    advice:
      "Hôm nay mọi thứ có thể hơi rời rạc — đừng vội vàng ép chúng vào nhau. Hãy xử lý từng việc một, không multitask. Khi bạn hoàn thành từng mảnh một cách cẩn thận, bức tranh tổng thể sẽ đẹp thôi.",
    tip: "Single-tasking là siêu năng lực — thử không làm 2 việc cùng lúc",
  },
  {
    id: 28,
    level: "low",
    energyRange: [5, 22],
    emoji: "🫶",
    headline: "Tự ôm lấy bản thân hôm nay nhé",
    advice:
      "Bạn đang trải qua giai đoạn khó không? Điều đó ổn. Bạn không cần phải giỏi giang, mạnh mẽ hay tích cực mọi lúc. Hôm nay hãy tử tế với chính mình hơn bất kỳ ai khác — bạn xứng đáng được yêu thương đầu tiên.",
    tip: "Đặt tay lên ngực, hít thở sâu và nói 'Mình ổn, mình đang cố gắng'",
  },
  {
    id: 29,
    level: "high",
    energyRange: [71, 86],
    emoji: "🌈",
    headline: "Ngày đẹp — hãy chia sẻ nó",
    advice:
      "Khi bạn đang ở trong vibe tốt, sức mạnh thực sự là lan tỏa nó. Khen ngợi ai đó chân thành, giúp đỡ một người đang cần, hoặc chia sẻ điều gì đó tích cực trên mạng xã hội. Năng lượng tốt khi được cho đi sẽ quay lại gấp đôi.",
    tip: "Làm một điều tốt ngẫu nhiên cho người lạ hôm nay",
  },
  {
    id: 30,
    level: "medium",
    energyRange: [43, 57],
    emoji: "🎭",
    headline: "Đôi khi chỉ cần 'đủ' là đủ",
    advice:
      "Không phải ngày nào cũng cần phải epic. 'Đủ' là một mục tiêu hoàn toàn hợp lệ. Hôm nay hoàn thành đủ việc, ăn đủ dinh dưỡng, ngủ đủ giấc — những điều đủ đó tích lũy lại sẽ tạo nên một cuộc sống thật sự ổn.",
    tip: "Kết thúc ngày bằng 3 điều bạn biết ơn, dù nhỏ",
  },
];
