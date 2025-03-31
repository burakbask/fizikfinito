import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Dark mode'u "class" stratejisiyle etkinleştirir
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        "gray-950": "#171717", // Dark mod arka planı için özel renk
      },
    },
  },
  plugins: [],
} satisfies Config;
