/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  reactStrictMode : false,
  outputFileTracingRoot: path.resolve(__dirname) // experimental 제거
};

module.exports = nextConfig;
