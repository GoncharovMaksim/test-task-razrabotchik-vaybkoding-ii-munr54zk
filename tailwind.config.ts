import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crm: {
          sidebar: "#18191c",
          panel: "#1e2024",
          card: "#24272c",
          border: "#2e3238",
          accent: "#3072f6",
          accentHover: "#255ecc",
          success: "#22c55e",
          warning: "#eab308",
          danger: "#ef4444",
          textPrimary: "#f3f4f6",
          textMuted: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};

export default config;
