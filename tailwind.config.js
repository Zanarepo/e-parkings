/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",  // Scans all files in src folder and subfolders
    "./index.html",                     // Include your main HTML file if outside src
    "./public/**/*.html",                // If you have HTML in public
    // Add more paths as needed, e.g., "./components/**/*.js"
  ],
  theme: {
    extend: {},  // Your custom themes go here
  },
  plugins: [],   // Add plugins like forms or typography if needed
}