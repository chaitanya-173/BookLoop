/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3B82F6",
          dark: "#60A5FA",
        },
        background: {
          light: "#FFFFFF",
          dark: "#121212",
        },
        text: {
          light: "#1F2937",
          dark: "#F9FAFB",
        },
        code: {
          light: "#FFFFFF",
          dark: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
};
