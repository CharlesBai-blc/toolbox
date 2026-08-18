/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      colors: {
        background: '#08090a',
        surface: '#0f1113',
        'surface-soft': '#15181b',
        'surface-raised': '#1b1f23',
        'text-primary': '#f2f3ef',
        'text-secondary': '#a8adb2',
        'text-tertiary': '#6f767d',
        border: '#292e33',
        'border-bright': '#41484f',
        accent: '#f5b63f',
        'accent-hover': '#ffd16f',
        'accent-muted': '#3b2d14',
        'accent-blue': '#7aa7ff',
        success: '#8bcf8f',
        warning: '#f5b63f',
        error: '#ff6b61',
        'error-hover': '#ff8a82',
        'code-bg': '#090b0d',
        'code-text': '#d7dadc',
        'dark-surface': '#15181b',
        'dark-border': '#292e33',
      },
      boxShadow: {
        card: '0 24px 80px rgba(0, 0, 0, 0.22)',
        'card-hover': '0 28px 90px rgba(0, 0, 0, 0.35)',
        modal: '0 40px 140px rgba(0, 0, 0, 0.72)',
      },
    },
  },
  plugins: [],
}
