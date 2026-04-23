import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        spearfish: "#12879f", // the teal active color
        risk: {
          low: "#10b981",
          medium: "#f59e0b",
          high: "#ef4444",
          critical: "#000000"
        }
      },
    },
  },
  plugins: [],
};
export default config;
