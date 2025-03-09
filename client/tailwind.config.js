/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily : {
        primaryBold : ['Bold'],
        primaryLight : ['Light'],
        primaryMedium : ['Medium'],
        primaryRegular : ['Regular']
      }
    },
  },
  plugins: [],
};
