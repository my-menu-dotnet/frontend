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
            foreground: {
              DEFAULT: "#171717",
              400: "#4a4a4a",
            },
            primary: "#ffcf00",
            "primary-foreground": {
              DEFAULT: "white",
            },
            "success-foreground": {
              DEFAULT: "white",
            },
            "warning-foreground": {
              DEFAULT: "white",
            },
          },
        },
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: {
              DEFAULT: "#ededed",
            },
            primary: "#FFC303",
            "primary-foreground": {
              DEFAULT: "white",
            },
            "success-foreground": {
              DEFAULT: "white",
            },
            "warning-foreground": {
              DEFAULT: "white",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
