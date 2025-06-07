/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unimar: {
          azul: "#002F6C",
          gris: "#F5F5F5",
          dorado: "#D4AF37",
        },
      },
    },
  },
  plugins: [],
}