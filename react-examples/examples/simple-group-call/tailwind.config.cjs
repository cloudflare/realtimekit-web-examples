/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.{ts,tsx}', './src/components/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rtk: {
          blue: '#2160FD',
        },
      },
    },
  },
  plugins: [],
};
