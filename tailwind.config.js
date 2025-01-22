/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,hbs}', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'amiri-colored': ['Amiri Quran Colored', 'serif'],
      },
    },
  },
  plugins: [],
};
