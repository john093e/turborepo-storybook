module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-turbo-storybook`
  extends: ['turbo-storybook'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
