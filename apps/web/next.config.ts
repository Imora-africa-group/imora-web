import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@imora/ui', '@imora/db', '@imora/types'],
  serverExternalPackages: ['cloudinary', '@prisma/client', 'bcryptjs'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
