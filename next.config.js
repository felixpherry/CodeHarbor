/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['cloudinary', '@prisma/client'],
    serverActionsBodySizeLimit: '5mb',
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'external-content.duckduckgo.com',
      'media.discordapp.net',
      'utfs.io',
      '3dbay.io',
    ],
  },
};

module.exports = nextConfig;
