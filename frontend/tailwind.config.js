/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14231E",
        paper: "#F1EFE6",
        moss: {
          DEFAULT: "#3F6C51",
          dark: "#2C4E3A",
          light: "#5C8B6D",
        },
        clay: "#B08D57",
        sage: "#C7CFC3",
        rust: "#C1553D",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};
