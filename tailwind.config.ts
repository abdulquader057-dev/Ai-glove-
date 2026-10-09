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
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        text: "var(--text)",
        "text-2": "var(--text-2)",
        "text-3": "var(--text-3)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        success: "var(--success)",
        "success-light": "var(--success-light)",
        danger: "var(--danger)",
        "danger-light": "var(--danger-light)",
        signova: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          elevated: "var(--surface-2)",
          border: "var(--border)",
          accent: "var(--primary)",
          accentMuted: "var(--primary-light)",
          text: "var(--text)",
          muted: "var(--text-2)",
          dim: "var(--text-3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)",
        "card-hover": "0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)",
        modal: "0 20px 25px -5px rgba(16, 24, 40, 0.1), 0 8px 10px -6px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
