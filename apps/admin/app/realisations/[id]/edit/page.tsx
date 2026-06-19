import { prisma } from '@imora/db'
import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/layout/AdminShell'
import { RealisationForm } from '../../RealisationForm'
import { updateRealisation } from '../../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditRealisationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const realisation = await prisma.realisation.findUnique({
    where: { id },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })
  if (!realisation) notFound()

  const boundAction = updateRealisation.bind(null, id)

  return (
    <AdminShell title={`Modifier — ${realisation.titre}`}>
      <div className="mb-6">
        <Link href="/realisations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour
        </Link>
      </div>
      <RealisationForm realisation={realisation} action={boundAction as never} actionLabel="Mettre à jour" />
    </AdminShell>
  )
}
