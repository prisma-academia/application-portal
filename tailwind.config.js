/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Env-driven branding (fallbacks for build without .env)
        primary:
          process.env.REACT_APP_THEME_PRIMARY || "#DA0037",
        surface:
          process.env.REACT_APP_THEME_SURFACE || "#EDEDED",
        // Optional legacy / semantic aliases
        blackhunt: "#171717",
        whitehunt:
          process.env.REACT_APP_THEME_SURFACE || "#EDEDED",
        redhunt:
          process.env.REACT_APP_THEME_PRIMARY || "#DA0037",
        grayhunt: "#444444",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
  },
};
