import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5',
          dark: '#6366F1',
        },
        background: {
          light: '#F3F4F6',
          dark: '#1F2937',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'fade-in-delay': 'fade-in 0.8s ease-out 0.5s',
      },
    },
  },
  plugins: [],
};

export default config;
