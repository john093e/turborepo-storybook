const { DOCS_URL } = process.env

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@twol/api", "@twol/auth", "@twol/database"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
  async rewrites() {
    return [
      /**
       * Rewrites for Multi Zones
       */
      {
        source: '/docs',
        destination: `${DOCS_URL}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${DOCS_URL}/docs/:path*`,
      },
    ]
  },
};

export default config;
// const { DOCS_URL } = process.env

// module.exports = {
//   async rewrites() {
//     return [
//       /**
//        * Rewrites for Multi Zones
//        */
//       {
//         source: '/docs',
//         destination: `${DOCS_URL}/docs`,
//       },
//       {
//         source: '/docs/:path*',
//         destination: `${DOCS_URL}/docs/:path*`,
//       },
//     ]
//   },
// }
