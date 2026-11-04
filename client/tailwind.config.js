/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: '#04101F',
        deep: '#071B34',
        ocean: '#0A4D8C',
        cyan: {
          DEFAULT: '#22D3EE',
          glow: '#22D3EE',
          dim: 'rgba(34, 211, 238, 0.15)',
        },
        teal: {
          DEFAULT: '#14B8A6',
          glow: '#14B8A6',
        },
        offwhite: '#F5FAFF',
        risk: {
          low: '#10B981',
          watch: '#F59E0B',
          elevated: '#F97316',
          high: '#EF4444',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

