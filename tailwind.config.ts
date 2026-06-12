import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f0a1a",
        surface: "#1a1228",
        accent: "#d4a574",
        muted: "#8a7a9a",
      },
      fontFamily: {
        serif: ["Georgia", "Fraunces", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
