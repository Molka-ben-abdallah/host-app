/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
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
