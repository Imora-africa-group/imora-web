'use client'

import { useState, useTransition, useRef } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { createPartenaire, updatePartenaire, togglePartenaire, deletePartenaire } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'
import type { Partenaire } from '@imora/db'

type PartenProps = (Partenaire & { logoUrl: string })

interface FormModalProps {
  partenaire?: PartenProps
  onDone: () => void
}

function PartenairModal({ partenaire, onDone }: FormModalProps) {
  const [nom, setNom] = useState(partenaire?.nom ?? '')
  const [preview, setPreview] = useState<string | null>(partenaire?.logoUrl ?? null)
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function submit() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('nom', nom)
      if (file) fd.set('logo', file)

      let res: { success: boolean; error?: string }
      if (partenaire) {
        res = await updatePartenaire(partenaire.id, fd)
      } else {
        if (!file) { toast.error('Logo requis'); return }
        res = await createPartenaire(fd)
      }

      if (res.success) {
        toast.success(partenaire ? 'Partenaire mis à jour' : 'Partenaire ajouté')
        onDone()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Nom</Label>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1" placeholder="Nom du partenaire" />
      </div>
      <div>
        <Label>Logo</Label>
        <div
          className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <div className="relative h-24 w-full">
              <Image src={preview} alt="Logo" fill className="object-contain" />
            </div>
          ) : (
            <div>
              <Upload className="mx-auto mb-2 text-gray-300" size={28} />
              <p className="text-sm text-gray-400">Choisir un logo</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
      </div>
      <Button onClick={submit} disabled={isPending} className="w-full text-white" style={{ backgroundColor: '#B8860B' }}>
        {isPending ? 'Enregistrement...' : partenaire ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </div>
  )
}

export function PartenairesClient({ partenaires }: { partenaires: PartenProps[] }) {
  const [openModal, setOpenModal] = useState<string | 'new' | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await togglePartenaire(id, !current)
      if (!res.success) toast.error(res.error)
      else toast.success(!current ? 'Partenaire activé' : 'Partenaire désactivé')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deletePartenaire(id)
      if (res.success) toast.success('Partenaire supprimé')
      else toast.error(res.error)
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={openModal === 'new'} onOpenChange={(o) => setOpenModal(o ? 'new' : null)}>
          <DialogTrigger className="inline-flex items-center gap-2 rounded-lg px-2.5 h-8 text-sm font-medium text-white transition-all" style={{ backgroundColor: '#B8860B' }}>
            <Plus size={16} /> Ajouter un partenaire
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau partenaire</DialogTitle>
            </DialogHeader>
            <PartenairModal onDone={() => setOpenModal(null)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {partenaires.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="relative h-20 w-full bg-gray-50 rounded-lg overflow-hidden">
              <Image src={p.logoUrl} alt={p.nom} fill className="object-contain p-2" />
            </div>
            <p className="text-sm font-medium text-gray-900 text-center truncate">{p.nom}</p>
            <div className="flex items-center justify-between">
              <Switch checked={p.isActive} onCheckedChange={() => handleToggle(p.id, p.isActive)} disabled={isPending} />
              <span className="text-xs text-gray-400">{p.isActive ? 'Actif' : 'Inactif'}</span>
            </div>
            <div className="flex gap-2">
              <Dialog open={openModal === p.id} onOpenChange={(o) => setOpenModal(o ? p.id : null)}>
                <DialogTrigger className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border px-2 h-7 text-xs font-medium hover:bg-muted transition-colors">
                  <Edit size={12} /> Éditer
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le partenaire</DialogTitle>
                  </DialogHeader>
                  <PartenairModal partenaire={p} onDone={() => setOpenModal(null)} />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger className="inline-flex items-center justify-center h-7 w-8 rounded-md text-red-400 hover:text-red-600 hover:bg-accent transition-colors">
                  <Trash2 size={14} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer {p.nom} ?</AlertDialogTitle>
                    <AlertDialogDescription>Le logo sera supprimé de Cloudinary.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {partenaires.length === 0 && (
          <div className="col-span-4 text-center py-16 text-gray-400">Aucun partenaire</div>
        )}
      </div>
    </div>
  )
}
