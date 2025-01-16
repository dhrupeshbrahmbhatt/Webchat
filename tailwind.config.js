// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        secondary: "#6C63FF",
        accent: "#FFC107",
        backgroundLight: "#F8FAFC",
        backgroundDark: "#1E1E2F",
        textLight: "#333333",
        textDark: "#E0E0E0",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}