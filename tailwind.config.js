import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F8F9FA',
          dark: '#0B0F19',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#111827',
        },
        subtle: {
          DEFAULT: '#ECEFF1',
          dark: '#1F2937',
        },
        main: {
          DEFAULT: '#1A1D20',
          dark: '#F9FAFB',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#9CA3AF',
        },
        'brand-primary': '#3B82F6',
        'brand-purple': '#8B5CF6',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
