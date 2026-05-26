import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "border-subtle": "var(--border-subtle)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "brand-primary": "#3B82F6",
        "brand-purple": "#8B5CF6",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "Courier New", "Courier", "monospace"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
