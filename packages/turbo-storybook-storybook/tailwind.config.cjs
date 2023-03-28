/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // All the packages that might include stories
    './node_modules/@vercel/examples-ui/**/*.js',
    './node_modules/@turbo-storybook/design-system/**/*.js',
    './node_modules/@turbo-storybook/pages/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
