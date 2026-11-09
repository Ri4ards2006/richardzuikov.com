/** @type {import('tailwindcss').Config} */
const channel = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ['Anton', 'Impact', 'sans-serif'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      colors: {
        ash: Object.fromEntries(steps.map((step) => [step, channel(`ash-${step}`)])),
        accent: { DEFAULT: channel('accent'), dim: channel('accent-dim') },
      },
    },
  },
  plugins: [],
}
