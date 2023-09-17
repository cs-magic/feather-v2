/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  distDir: process.env.DIST ?? ".next",

  experimental: {
    appDir: true,
  },
}

export default nextConfig
