/** @type {import('tailwindcss').Config} */
export default {
  important: "#cloth-editor-app",
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '760px',
      lg: '968px',
      xl: '1280px',
      xxl: '1400px',
    },
  },
  plugins: [],
};
