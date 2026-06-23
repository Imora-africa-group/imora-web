import { prisma, getImageUrl } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { PartenairesClient } from './PartenairesClient'

export default async function PartenairesPage() {
  const partenaires = await prisma.partenaire.findMany({ orderBy: { ordre: 'asc' } })
  const withUrls = partenaires.map((p) => ({
    ...p,
    logoUrl: getImageUrl(p.cloudinaryPublicId, { width: 200, height: 120, crop: 'fit' }),
  }))

  return (
    <AdminShell title="Partenaires">
      <PartenairesClient partenaires={withUrls} />
    </AdminShell>
  )
}
