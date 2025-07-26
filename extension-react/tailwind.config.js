/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/**/*.html"],
 theme: {
  extend: {
   colors: {
    secondary: {
     50: "#fdffe8",
     100: "#fbffc4",
     200: "#f7ff90",
     300: "#eaff6b",
     400: "#e3ff3c",
     500: "#d4f020",
     600: "#24996f",
     700: "#b5c912",
     800: "#9ca216",
     900: "#86871a",
    },
    primary: {
     50: "#eff0ff",
     100: "#e2e5ff",
     200: "#c9cfff",
     300: "#a5acff",
     400: "#7f7eff",
     500: "#6b65d3",
     600: "#24996f",
     700: "#3429a3",
     800: "#2a1f8a",
     900: "#251b73",
    },
   },
   width: {
    80: "20rem",
    96: "24rem",
   },
   height: {
    80: "20rem",
    96: "24rem",
   },
  },
 },
 plugins: [],
};
