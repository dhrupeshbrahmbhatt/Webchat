// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.3 },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}