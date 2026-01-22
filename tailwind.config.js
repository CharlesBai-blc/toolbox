/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
        orbitron: ['Orbitron', 'Roboto', 'sans-serif'],
      },
      colors: {
        background: '#202124',
        surface: '#303134',
        'text-primary': '#e8eaed',
        'text-secondary': '#bdc1c6',
        'text-tertiary': '#9aa0a6',
        border: '#5f6368',
        accent: '#8ab4f8',
        'accent-hover': '#aecbfa',
        'accent-blue': '#6BB6FF',
        success: '#3eb870',
        warning: '#c99a1c',
        error: '#ea4335',
        'error-hover': '#c5221f',
        'code-bg': '#1e1e1e',
        'code-text': '#d4d4d4',
        'dark-surface': '#2a2a2a',
        'dark-border': '#3a3a3a',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 2px 6px 0 rgba(0, 0, 0, 0.4), 0 8px 16px 4px rgba(0, 0, 0, 0.2)',
        'modal': '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
