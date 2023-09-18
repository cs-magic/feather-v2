/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  distDir: process.env.DIST ?? ".next",

  experimental: {
    appDir: true,
  },
}

export default nextConfig
