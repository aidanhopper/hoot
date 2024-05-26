import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-down': {
          '0%': {
            transform: 'translateY(-100px)',
            opacity: '0%',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '100%',
          },
        },
      },
      animation :{
        'fade-down': 'fade-down 0.1s linear forwards',
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [],
};
export default config;
