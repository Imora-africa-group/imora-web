import { AdminShell } from '@/components/layout/AdminShell'
import { RealisationForm } from '../RealisationForm'
import { createRealisation } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewRealisationPage() {
  return (
    <AdminShell title="Nouvelle réalisation">
      <div className="mb-6">
        <Link href="/realisations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour
        </Link>
      </div>
      <RealisationForm action={createRealisation as never} actionLabel="Publier" />
    </AdminShell>
  )
}
