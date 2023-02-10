module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-twol`
  extends: ['twol'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
