import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { FaqClient } from './FaqClient'

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { ordre: 'asc' } })

  return (
    <AdminShell title="FAQ">
      <FaqClient faqs={faqs} />
    </AdminShell>
  )
}
