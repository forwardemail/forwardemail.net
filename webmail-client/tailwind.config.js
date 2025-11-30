export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00aff8',
          secondary: '#002a90',
          surface: '#0f172a',
          text: '#e5e7eb',
          muted: '#9ca3af',
          accent: '#00aff8',
          accentStrong: '#22c55e',
          error: '#ef4444',
          success: '#22c55e'
        }
      },
      fontFamily: {
        brand: ['system-ui', '-apple-system', 'sans-serif'],
        heading: ['Georgia', 'serif']
      },
      boxShadow: {
        card: '0 30px 80px rgba(15, 23, 42, 0.35)',
        cardLight: '0 30px 80px rgba(0, 0, 0, 0.08)',
        buttonPrimary: '0 12px 30px rgba(0, 175, 248, 0.35)',
        toast: '0 12px 30px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: []
};
