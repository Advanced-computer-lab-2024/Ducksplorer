/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/src/**/*.{html,js,jsx,ts,tsx}", flowbite.content()], // Include all relevant file types in the frontend/src directory],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
