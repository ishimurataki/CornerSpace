import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "sea-green": "#a8e6cf",
        "pastel-green": "#dcedc1",
        "pastel-orange": "#ffd3b6",
        "pastel-pink": "#ffaaa5",
        "pastel-red": "#ff8b94"
      }
    },
  },
  plugins: [],
};
export default config;
