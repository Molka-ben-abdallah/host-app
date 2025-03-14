/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primaryBold: ["Bold"],
        primaryLight: ["Light"],
        primaryMedium: ["Medium"],
        primaryRegular: ["Regular"],
      },
    },
  },
  plugins: [],
};
