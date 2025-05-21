/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        success: '#2ecc71',
        danger: '#e74c3c',
        gray: '#5b5b5b',
        lightGray: '#f0f0f0',
        black: '#000000',
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
        heading: ['Pretendard', 'Arial', 'sans-serif'],
      },
      fontSize: {
        heading: ['24px', '32px'],
        subtitle: ['20px', '28px'],
        body: ['16px', '24px'],
        caption: ['12px', '16px'],
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
  },
  plugins: [],
};
