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
        bg: {
          primary: "#030712",
          secondary: "#0a0f1e",
          card: "rgba(10, 15, 30, 0.7)",
        },
        accent: {
          cyan: "#00f0ff",
          blue: "#0066ff",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        text: {
          primary: "#ffffff",
          secondary: "#94a3b8",
        },
        border: {
          glow: "rgba(0, 240, 255, 0.25)",
        },
        status: {
          success: "#10b981",
          danger: "#ef4444",
          warning: "#f59e0b",
        }
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-orbitron)", "monospace"],
      },
      boxShadow: {
        cyanGlow: "0 0 30px rgba(0, 240, 255, 0.3)",
        cyanGlowHover: "0 5px 40px rgba(0, 240, 255, 0.5)",
        dangerGlow: "0 0 30px rgba(239, 68, 68, 0.3)",
        purpleGlow: "0 0 30px rgba(139, 92, 246, 0.3)",
        cardGlow: "0 0 25px rgba(0, 240, 255, 0.12)",
      },
      animation: {
        'grid-drift': 'gridDrift 20s linear infinite',
        'pulse-radial': 'pulseRadial 4s ease-in-out infinite',
        'particle-float': 'particleFloat 12s ease-in-out infinite',
        'node-pulse': 'nodePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        gridDrift: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        pulseRadial: {
          '0%, 100%': { opacity: '0.06', transform: 'scale(1)' },
          '50%': { opacity: '0.12', transform: 'scale(1.15)' },
        },
        particleFloat: {
          '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) scale(1.2)', opacity: '0' },
        },
        nodePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 8px #00f0ff)' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6', filter: 'drop-shadow(0 0 16px #ec4899)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
