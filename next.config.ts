/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'survey-vonway.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**', // Allow all paths under the bucket
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**', // Allow all image sizes and formats
      },
    ],
  },
};

module.exports = nextConfig;