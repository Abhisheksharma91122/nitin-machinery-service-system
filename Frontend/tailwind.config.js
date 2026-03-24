/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A', // Dark blue
          light: '#F3F4F6', // Light gray 
          accent: '#2563EB', // Bright blue for buttons
          white: '#ffffff',
          text: '#1f2937'
        }
      }
    },
  },
  plugins: [],
};
