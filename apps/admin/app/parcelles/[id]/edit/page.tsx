import { prisma } from '@imora/db'
import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/layout/AdminShell'
import { ParcelleForm } from '../../ParcelleForm'
import { updateParcelle } from '../../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditParcellePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parcelle = await prisma.parcelle.findUnique({
    where: { id },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })
  if (!parcelle) notFound()

  const boundAction = updateParcelle.bind(null, id)

  return (
    <AdminShell title={`Modifier — ${parcelle.titre}`}>
      <div className="mb-6">
        <Link href="/parcelles" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour aux parcelles
        </Link>
      </div>
      <ParcelleForm parcelle={parcelle} action={boundAction as never} actionLabel="Mettre à jour" />
    </AdminShell>
  )
}
