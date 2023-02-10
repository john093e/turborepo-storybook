module.exports = {
  presets: [
    require('@vercel/examples-ui/tailwind'),
    require('@twol/design-system/tailwind'),
  ],
  content: [
    // All the packages that might include stories
    './node_modules/@vercel/examples-ui/**/*.js',
    './node_modules/@twol/design-system/**/*.js',
    './node_modules/@twol/pages/**/*.js',
  ],
}
