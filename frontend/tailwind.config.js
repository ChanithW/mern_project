/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js" // Ensure this line is added
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // Ensure Flowbite plugin is required
  ],
};
