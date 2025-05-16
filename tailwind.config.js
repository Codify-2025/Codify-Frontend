/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
        heading: ['Pretendard', 'Arial', 'sans-serif'],
      },
      fontSize: {
        heading: ['24px', '32px'],
        subtitle: ['20px', '20px'],
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
