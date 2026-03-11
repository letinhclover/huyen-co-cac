/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",
          400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",
          800:"#92400e",900:"#78350f",
        },
        abyss: {
          50:"#f0f1f7",100:"#dde0ee",200:"#bcc2df",300:"#929bca",
          400:"#6b75b4",500:"#4f5a9c",600:"#3d4780",700:"#2e3561",
          800:"#1e2342",900:"#0f1220",950:"#080C18",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'","Georgia","serif"],
        body:    ["'Be Vietnam Pro'","system-ui","sans-serif"],
      },
      animation: {
        "float-up":   "float-up 4s ease-in-out infinite",
        "twinkle":    "twinkle 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":  "spin 3s linear infinite",
      },
      keyframes: {
        "float-up":   { "0%":{opacity:"0",transform:"translateY(0) scale(0.8)"},"50%":{opacity:"0.6"},"100%":{opacity:"0",transform:"translateY(-80px) scale(0.4)"} },
        "twinkle":    { "0%,100%":{opacity:"0.1"},"50%":{opacity:"0.5"} },
        "fade-in-up": { from:{opacity:"0",transform:"translateY(16px)"},to:{opacity:"1",transform:"translateY(0)"} },
      },
      boxShadow: {
        "glow-gold":    "0 0 30px rgba(251,191,36,0.15), 0 0 60px rgba(251,191,36,0.07)",
        "glow-emerald": "0 0 30px rgba(52,211,153,0.15), 0 0 60px rgba(52,211,153,0.07)",
      },
    },
  },
  plugins: [],
};
