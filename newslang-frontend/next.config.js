/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    // reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/:path*',
            destination: `http://10.178.0.9:8080/:path*`,
        },
      ];
    },
  };

module.exports = nextConfig;