import { prisma } from '@imora/db'
import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/layout/AdminShell'
import { ModeleForm } from '../../ModeleForm'
import { updateModele } from '../../actions'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function EditModelePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const modele = await prisma.modeleConstruction.findUnique({
    where: { id },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })
  if (!modele) notFound()

  const boundAction = updateModele.bind(null, id)

  return (
    <AdminShell title={`Modifier — ${modele.titre}`}>
      <div className="mb-6">
        <Link href="/construction" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour
        </Link>
      </div>
      <ModeleForm modele={modele} action={boundAction as never} actionLabel="Mettre à jour" />
    </AdminShell>
  )
}
