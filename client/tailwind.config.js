/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        serif: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sidebar: {
          bg: '#1a1a1a',
          hover: '#2a2a2a',
          active: '#333333',
          border: '#2f2f2f',
          text: '#a3a3a3',
          'text-active': '#f5f5f5',
        },
        cream: {
          50: '#fdfaf7',
          100: '#f9f4ed',
          200: '#f0e8da',
        },
        ink: {
          DEFAULT: '#1c1c1e',
          light: '#3a3a3c',
          muted: '#8e8e93',
        },
        // 这里是核心修改点：将 DEFAULT 指向 CSS 变量
        accent: {
          DEFAULT: 'var(--accent-color)',
          light: 'var(--accent-color)',
          dark: 'var(--accent-color)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-right': 'slideRight 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
