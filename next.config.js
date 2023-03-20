/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  // disable: process.env.NODE_ENV === 'development',
  scope: "/",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  // next config
  reactStrictMode: true,
});
module.exports = nextConfig;
