/** @type {import('next').NextConfig} */
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: NEXT_PUBLIC_API_BASE_URL
  }
};
module.exports = nextConfig;
