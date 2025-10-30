import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Shadows Into Light", "cursive"],
      },
    },
  },
  plugins: [],
} satisfies Config
