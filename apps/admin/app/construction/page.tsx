import { prisma, getImageUrl } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { PublishBadge } from '@/components/StatusBadge'
import { ConstructionActions } from './ConstructionActions'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const STANDING_LABELS: Record<string, string> = {
  BASIQUE: 'Basique',
  MOYEN: 'Moyen',
  HAUT_STANDING: 'Haut Standing',
  LUXE: 'Luxe',
}

export default async function ConstructionPage() {
  const modeles = await prisma.modeleConstruction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })

  return (
    <AdminShell title="Construction">
      <div className="flex justify-end mb-6">
        <Link href="/construction/new" className={cn(buttonVariants(), 'text-white gap-2')} style={{ backgroundColor: '#B8860B' }}>
          <Plus size={16} />
          Ajouter un modèle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-6 py-3 font-medium text-gray-500">PHOTO</th>
                <th className="px-6 py-3 font-medium text-gray-500">TITRE</th>
                <th className="px-6 py-3 font-medium text-gray-500">STANDING</th>
                <th className="px-6 py-3 font-medium text-gray-500">PRIX FCFA</th>
                <th className="px-6 py-3 font-medium text-gray-500">SUPERFICIE</th>
                <th className="px-6 py-3 font-medium text-gray-500">STATUT</th>
                <th className="px-6 py-3 font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modeles.map((m) => {
                const mainImg = m.images.find((i) => i.isMain) ?? m.images[0]
                const thumbUrl = mainImg
                  ? getImageUrl(mainImg.cloudinaryPublicId, { width: 80, height: 80, crop: 'fill' })
                  : null
                return (
                  <tr key={m.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {thumbUrl ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={thumbUrl} alt={m.titre} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{m.titre}</td>
                    <td className="px-6 py-4 text-gray-600">{STANDING_LABELS[m.standing]}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {m.prixFCFA.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 text-gray-600">{m.superficie} m²</td>
                    <td className="px-6 py-4"><PublishBadge status={m.status} /></td>
                    <td className="px-6 py-4">
                      <ConstructionActions id={m.id} status={m.status} />
                    </td>
                  </tr>
                )
              })}
              {modeles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Aucun modèle de construction
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
