import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { LocativeTable } from './LocativeTable'

export default async function LocativePage() {
  const loyers = await prisma.loyer.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <AdminShell title="Gestion Locative">
      <LocativeTable initialLoyers={loyers} />
    </AdminShell>
  )
}
