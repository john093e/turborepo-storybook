// @ts-check
/** @type {import("next").NextConfig} */
const config = {
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
  reactStrictMode: true,
}

export default config
