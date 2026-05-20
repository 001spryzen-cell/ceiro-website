import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bluewash: "#e1f6ff",
        cream: "#f7f6ee",
        lavender: {
          100: "#eee7ff",
          200: "#ddd0ff",
          300: "#cbb6ff",
        },
        mint: {
          100: "#dcf9ee",
          200: "#baf3dd",
          300: "#82dfbf",
        },
        peach: {
          100: "#fff0e7",
          200: "#ffd8c4",
        },
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
