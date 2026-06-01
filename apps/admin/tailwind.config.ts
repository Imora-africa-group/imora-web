import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#B8860B",
          light: "#DAA520",
          dark: "#8B6914",
        },
        navy: {
          DEFAULT: "#1B2B4B",
          light: "#2D4270",
          dark: "#0F1A2E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
