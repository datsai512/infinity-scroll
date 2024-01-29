/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '350px',
      'md': '760px',
      'lg': '900px',
    },
    extend: {},
  },
  plugins: [],
}
