import { prisma, getImageUrl } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { AvisClient } from './AvisClient'

export default async function AvisPage() {
  const avis = await prisma.avis.findMany({ orderBy: { dateAvis: 'desc' } })
  const withUrls = avis.map((a) => ({
    ...a,
    avatarUrl: a.cloudinaryPublicId
      ? getImageUrl(a.cloudinaryPublicId, { width: 80, height: 80, crop: 'fill' })
      : null,
  }))

  return (
    <AdminShell title="Avis Clients">
      <AvisClient avis={withUrls} />
    </AdminShell>
  )
}
