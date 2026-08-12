import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a", // slate-900
          hover: "#1e293b",   // slate-800
        },
        accent: {
          DEFAULT: "#0ea5e9", // sky-500
          hover: "#0284c7",   // sky-600
        },
        bg: {
          primary: "#ffffff",
          secondary: "#f8fafc", // slate-50
          dark: "#0f172a",
        },
        text: {
          primary: "#0f172a", // slate-900
          secondary: "#475569", // slate-600
          muted: "#94a3b8", // slate-400
          onDark: "#f8fafc",
        },
        border: {
          DEFAULT: "#e2e8f0", // slate-200
          hover: "#cbd5e1", // slate-300
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        xl: "0 20px 25px rgba(0,0,0,0.1)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
