/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#4CAF50',
          medium: '#FF9800',
          high: '#F44336',
          critical: '#D32F2F'
        }
      }
    },
  },
  plugins: [],
};