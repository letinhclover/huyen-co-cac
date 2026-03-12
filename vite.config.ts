import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "favicon.svg"],
      manifest: {
        name: "Lịch Vạn Niên AI 2026 - Lịch Âm",
        short_name: "Lịch VN AI",
        description: "Lịch vạn niên, âm lịch 2026, xem ngày tốt xấu, phong thủy, văn khấn, hỏi thầy AI",
        theme_color: "#080C18",
        background_color: "#080C18",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        orientation: "portrait",
        scope: "/",
        start_url: "/?source=pwa",
        lang: "vi",
        categories: ["lifestyle", "utilities"],
        dir: "ltr",
        icons: [
          { src:"pwa-192x192.png", sizes:"192x192", type:"image/png", purpose:"any" },
          { src:"pwa-512x512.png", sizes:"512x512", type:"image/png", purpose:"any" },
          { src:"pwa-512x512.png", sizes:"512x512", type:"image/png", purpose:"maskable" },
        ],
        screenshots: [
          { src:"splash-390.png", sizes:"390x844", type:"image/png", form_factor:"narrow" },
        ],
        shortcuts: [
          { name:"Xem Ngày Hôm Nay", short_name:"Lịch", url:"/?source=shortcut", icons:[{ src:"pwa-192x192.png", sizes:"192x192" }] },
          { name:"Hỏi Thầy Lão Đại", short_name:"Hỏi Thầy", url:"/?tab=thay&source=shortcut", icons:[{ src:"pwa-192x192.png", sizes:"192x192" }] },
        ],
        related_applications: [],
        prefer_related_applications: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName:"google-fonts-cache", expiration:{ maxEntries:10, maxAgeSeconds:60*60*24*365 } },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
