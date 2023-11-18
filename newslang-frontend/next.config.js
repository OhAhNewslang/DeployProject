/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    // reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/:path*',
            destination: `http://localhost:8080/:path*`,
        },
      ];
    },
  };

module.exports = nextConfig;