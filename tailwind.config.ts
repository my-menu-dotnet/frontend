import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      dark: true,
      icons: true,
      themes: {
        light: {
          colors: {
            background: "#f9f9f9",
            foreground: "#171717",
            primary: "#FFC303",
          },
        },
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: "#ededed",
            primary: "#FFC303",
          },
        },
      },
    }),
  ],
} satisfies Config;
