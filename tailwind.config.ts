import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: {
          DEFAULT: "#141414",
          hover: "#191919",
          muted: "#111111",
        },
        border: {
          DEFAULT: "#232323",
          light: "#333333",
          hover: "#404040",
        },
        text: {
          primary: "#f0f0f0",
          muted: "#9a9a9a",
          dim: "#666666",
        },
        accent: {
          DEFAULT: "#e0a03c",
          muted: "rgba(224, 160, 60, 0.12)",
          hover: "#f0b04a",
          border: "rgba(224, 160, 60, 0.3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
