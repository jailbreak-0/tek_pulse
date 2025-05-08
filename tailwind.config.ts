import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  
  theme: {
    extend: {
      screens: {
        xsm:"400px",
        sm:"500px",
        md:"690px",
        lg:"988px",
        xl:"1078px",
        xxl:"1265px",
      },
      colors: {
        textGray: "#71767b",
        textGrayLight: "#e7e9ea",
        borderGray: "#2f3336",
        inputGray: "#818181",
        tekGreenLight: "#AEE6B9",
        tekGreen: "#22AB39",
        iconPink: "#f91880",
      },
    },
  },
  plugins: [],
} satisfies Config;