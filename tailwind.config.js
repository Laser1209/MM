/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#070b0a',
        'accent': '#5ed29c',
        'panel-1': '#ECEDEC',
        'panel-2': '#FEFDF9',
        'panel-3': '#000000',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['"DM Sans"', 'sans-serif'],
        'serif': ['"Instrument Serif"', 'serif'],
        'eyebrow': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'word-reveal': 'wordReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
