# 🗓️ Lịch Vạn Niên AI 2026 — Lịch Âm PWA

> **Ứng dụng lịch âm dương, phong thủy, và hỏi thầy AI** — Progressive Web App (PWA) dành cho người Việt Nam, tối ưu cho điện thoại, có thể cài offline như ứng dụng thật.

**🌐 Demo:** [lich-van-nien.pages.dev](https://lich-van-nien.pages.dev)  
**📦 Repo:** `letinhclover/lich-van-nien` (Cloudflare Pages)

---

## ✨ Tính năng chính

| Tab | Tính năng |
|-----|-----------|
| 📅 **Lịch** | Tờ lịch số to (8.5rem), CN đỏ, T7 vàng. Lịch tháng grid, quy đổi âm/dương lịch. Can Chi ngày/tháng/năm. |
| 🔮 **Hỏi Thầy** | Gieo 64 quẻ Kinh Dịch ngẫu nhiên + AI Groq luận giải. Xử lý câu hỏi troll thông minh. |
| 🎉 **Sự Kiện** | 18 ngày lễ Việt Nam (tính cả âm lịch), thêm sự kiện cá nhân (giỗ, sinh nhật). Đếm ngược "còn X ngày". |
| 🧭 **Tiện Ích** | La bàn phong thủy SVG thực tế (deviceorientationabsolute), Bát Trạch cung phi, Xem tuổi hợp, Văn khấn. |
| 👤 **Bản Mệnh** | Quản lý gia đình (dropdown chọn thành viên), tử vi trọn đời AI, card Shopee affiliate. |

---

## 🛠️ Tech Stack

```
React 18 + TypeScript + Vite
Tailwind CSS (utility-first)
Framer Motion (animations + spring)
Groq API — llama-3.1-8b-instant (AI, miễn phí)
vite-plugin-pwa (Service Worker, manifest)
Cloudflare Pages (deploy tự động từ GitHub)
```

---

## 📁 Cấu trúc thư mục

```
src/
├── App.tsx                  # Router chính, 5 tab, onboarding toast
├── components/
│   ├── CalendarBoard.tsx    # Tờ lịch + month grid picker
│   ├── DayDetailPanel.tsx   # Chi tiết ngày: sao, trực, ngũ hành
│   ├── FengShuiCompass.tsx  # La bàn SVG + DeviceOrientation
│   ├── FortuneCard.tsx      # AI luận giải ngày (4 chủ đề)
│   ├── PersonalEnergy.tsx   # Năng lượng cá nhân theo tuổi
│   ├── PWAInstallPrompt.tsx # Hướng dẫn cài PWA (iOS/Android)
│   └── SmartPrayer.tsx      # Thư viện văn khấn 25 bài
├── tabs/
│   ├── ThayTab.tsx          # Hỏi thầy Kinh Dịch
│   ├── EventsTab.tsx        # Sự kiện + đếm ngược
│   ├── UtilityTab.tsx       # La bàn, xem tuổi, văn khấn
│   ├── ProfileTab.tsx       # Bản mệnh + quản lý gia đình
│   ├── TuviTab.tsx          # Tử vi AI
│   └── AiTab.tsx            # AI luận giải theo ngày
├── data/
│   ├── divinations.ts       # 64 quẻ Kinh Dịch
│   ├── horoscopes.ts        # 120 tử vi (60 can chi × 2 giới)
│   ├── prayers.ts           # 25 bài văn khấn
│   └── dayInfo.ts           # Sao tốt/xấu, trực, ngũ hành
└── utils/
    ├── astrology.ts         # Đổi lịch âm/dương, can chi, JDN
    ├── gemini.ts            # Groq API wrapper (FortuneCard)
    └── sounds.ts            # Web Audio API sounds
public/
├── favicon.svg
├── pwa-192x192.png
├── pwa-512x512.png
├── apple-touch-icon*.png
├── robots.txt
└── sitemap.xml
```

---

## 🚀 Deploy

### Yêu cầu
- Node.js 18+
- Tài khoản Cloudflare Pages
- API key Groq (miễn phí tại [console.groq.com](https://console.groq.com))

### Biến môi trường (Cloudflare Pages → Settings → Environment variables)
```
VITE_GROQ_API_KEY=gsk_xxxxxxxx
```

### Build local
```bash
npm install
npm run build      # tsc && vite build
npm run preview    # xem trước build
```

### Deploy
Push lên `main` branch → Cloudflare Pages tự build và deploy.

---

## 🔑 localStorage Keys

| Key | Mô tả |
|-----|-------|
| `huyen_co_cac_birth_year` | Năm sinh (legacy, tương thích) |
| `huyen_co_cac_dob` | `{day,month,year}` ngày sinh đầy đủ |
| `hcc_family_members` | Mảng thành viên gia đình |
| `hcc_active_member` | ID thành viên đang xem |
| `hcc_personal_events` | Sự kiện cá nhân |
| `hcc_theme` | `"dark"` \| `"light"` |
| `hcc_pwa_dismissed_v2` | Timestamp đóng PWA prompt |
| `hcc_onboarding_toast_seen` | Toast onboarding đã xem |
| `hcc_tuvi_[year]_[gender]` | Cache tử vi AI (không TTL) |
| `hcc_v4_[date]_[topic]_[year]` | Cache AI luận giải ngày (24h) |
| `hcc_ten_tin_chu` | Tên tín chủ cho văn khấn |
| `hcc_dia_chi` | Địa chỉ cho văn khấn |

---

## 📐 Design System

**Fonts:** Be Vietnam Pro (body) + Playfair Display (heading)  
**Base font:** 17px, line-height 1.6  
**Color tokens:** CSS custom properties (`--bg-base`, `--gold`, `--text-primary`...)  
**Dark mode:** class-based (`html.dark`) + localStorage  

| Token | Light | Dark |
|-------|-------|------|
| `--bg-base` | `#F5EDD8` | `#070B17` |
| `--gold` | `#B8720A` | `#F5A623` |
| `--text-primary` | `#0F0C0A` | `#F8F4ED` |

---

## ⚖️ Giấy phép

MIT License — Tự do sử dụng, sửa đổi, phân phối.  
Affiliate links Shopee thuộc trách nhiệm người dùng.

---

*Made with ❤️ cho người Việt Nam. Phát triển bởi [@letinhclover](https://github.com/letinhclover)*
