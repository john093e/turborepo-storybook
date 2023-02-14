// module.exports = {
//   presets: [
//     require('@vercel/examples-ui/tailwind'),
//     require('@twol/design-system/tailwind'),
//   ],
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//     // Add the external packages that are using Tailwind CSS
//     './node_modules/@vercel/examples-ui/**/*.js',
//     './node_modules/@twol/design-system/**/*.js',
//     './node_modules/@twol/pages/**/*.js',
//   ],
// }



const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // presets: [
  //   require('@vercel/examples-ui/tailwind'),
  //   require('@twol/design-system/tailwind'),
  // ],
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    // Add the external packages that are using Tailwind CSS
    './node_modules/@vercel/examples-ui/**/*.js',
    './node_modules/@twol/design-system/**/*.js',
    './node_modules/@twol/pages/**/*.js',
  ],
  darkMode: "class",
  theme: {
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      dark: '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
      none: 'none',
    },
    extend:{
      screens: {
        'xs': '520px',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['dark']
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("flowbite/plugin"),
  ],
};
