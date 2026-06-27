import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['@imora/ui', '@imora/db', '@imora/types'],
  serverExternalPackages: ['cloudinary', '@prisma/client', 'bcryptjs'],
  outputFileTracingIncludes: {
    '**': [
      '../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/*.node',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
