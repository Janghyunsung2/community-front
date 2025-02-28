/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // SSR 실행을 위한 standalone 모드
  experimental: {
    outputFileTracingRoot: __dirname
  }
};




module.export = nextConfig;
