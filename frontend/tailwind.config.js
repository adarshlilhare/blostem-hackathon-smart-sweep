/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#151c2f',
        primary: '#3b82f6',
        accent: '#10b981',
        alert: '#ef4444'
      }
    },
  },
  plugins: [],
}
