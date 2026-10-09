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
        signova: {
          bg: "#08090A",
          surface: "#0E1114",
          elevated: "#14181D",
          border: "#1F242A",
          accent: "#2EE6A6",
          accentMuted: "#165B44",
          text: "#FFFFFF",
          muted: "#6B7280",
          dim: "#404650",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
