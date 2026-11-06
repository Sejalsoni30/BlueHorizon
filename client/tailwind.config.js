/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#060606',
        carbon: '#0E0F10',
        graphite: '#1A1C1E',
        bone: '#F4F1EA',
        ash: '#9A9C9F',
        mint: {
          DEFAULT: '#5CFFB1',
          dim: 'rgba(92, 255, 177, 0.12)',
          glow: 'rgba(92, 255, 177, 0.35)',
        },
        ember: {
          DEFAULT: '#FF7A2F',
          dim: 'rgba(255, 122, 47, 0.12)',
          glow: 'rgba(255, 122, 47, 0.35)',
        },
        risk: {
          low: '#5CFFB1',
          watch: '#FFD166',
          elevated: '#FF7A2F',
          high: '#FF4D5E',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter Tight', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'mint-glow': '0 0 25px rgba(92, 255, 177, 0.25)',
        'ember-glow': '0 0 25px rgba(255, 122, 47, 0.25)',
        'carbon-elevation': '0 10px 40px -10px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
    },
  },
  plugins: [],
}
