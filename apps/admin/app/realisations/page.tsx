import { prisma, getImageUrl } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { PublishBadge } from '@/components/StatusBadge'
import { RealisationsActions } from './RealisationsActions'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const STANDING_LABELS: Record<string, string> = {
  BASIQUE: 'Basique', MOYEN: 'Moyen', HAUT_STANDING: 'Haut Standing', LUXE: 'Luxe',
}

export default async function RealisationsPage() {
  const realisations = await prisma.realisation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })

  return (
    <AdminShell title="Réalisations">
      <div className="flex justify-end mb-6">
        <Link href="/realisations/new" className={cn(buttonVariants(), 'text-white gap-2')} style={{ backgroundColor: '#B8860B' }}>
          <Plus size={16} /> Ajouter une réalisation
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {realisations.map((r) => {
          const mainImg = r.images.find((i) => i.isMain) ?? r.images[0]
          const imgUrl = mainImg ? getImageUrl(mainImg.cloudinaryPublicId, { width: 400, height: 250, crop: 'fill' }) : null
          return (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-44 bg-gray-100">
                {imgUrl ? (
                  <Image src={imgUrl} alt={r.titre} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                    Pas d&apos;image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <PublishBadge status={r.status} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 truncate">{r.titre}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {r.zone} · {STANDING_LABELS[r.standing]} · {r.annee}
                </p>
                <div className="mt-3 flex items-center justify-end">
                  <RealisationsActions id={r.id} status={r.status} />
                </div>
              </div>
            </div>
          )
        })}
        {realisations.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">Aucune réalisation</div>
        )}
      </div>
    </AdminShell>
  )
}
