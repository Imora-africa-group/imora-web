import { MetadataRoute } from 'next'
import { prisma } from '@imora/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imoraafricagroup.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const parcelles = await prisma.parcelle.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, updatedAt: true },
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/parcelles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/construction`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/gestion-locative`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/simulation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const parcellePages: MetadataRoute.Sitemap = parcelles.map((p) => ({
    url: `${BASE}/parcelles/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...parcellePages]
}
