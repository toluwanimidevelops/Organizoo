/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f9fd",
        surface: "#ffffff",
        midnight: "#0c0b2b",
        "midnight-muted": "#525078",
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        "accent-light": "#e0e7ff",
        border: "#e2e8f0",
      },
      fontFamily: {
        // DM Sans
        main: ["DMSans_400Regular"],
        "main-medium": ["DMSans_500Medium"],
        "main-bold": ["DMSans_700Bold"],

        // Lato
        primary: ["Lato_400Regular"],
        "primary-bold": ["Lato_700Bold"],

        // Montserrat
        secondary: ["Montserrat_400Regular"],
        "secondary-medium": ["Montserrat_500Medium"],
        "secondary-semibold": ["Montserrat_600SemiBold"],
        "secondary-bold": ["Montserrat_700Bold"],
      },
    },
  },
  plugins: [],
};
