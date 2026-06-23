'use client'

import { useState, useTransition, useRef } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { createAvis, updateAvis, toggleAvis, deleteAvis } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Avis } from '@imora/db'

type AvisProps = Avis & { avatarUrl: string | null }

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={cn('text-2xl transition-colors', n <= value ? 'text-amber-400' : 'text-gray-200')}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function AvisForm({ avis, onDone }: { avis?: AvisProps; onDone: () => void }) {
  const [nom, setNom] = useState(avis?.nomClient ?? '')
  const [note, setNote] = useState(avis?.note ?? 5)
  const [texte, setTexte] = useState(avis?.texte ?? '')
  const [date, setDate] = useState(avis ? new Date(avis.dateAvis).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [published, setPublished] = useState(avis?.isPublished ?? false)
  const [preview, setPreview] = useState<string | null>(avis?.avatarUrl ?? null)
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function submit() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('nomClient', nom)
      fd.set('note', String(note))
      fd.set('texte', texte)
      fd.set('dateAvis', date)
      fd.set('isPublished', String(published))
      if (file) fd.set('avatar', file)

      const res = avis ? await updateAvis(avis.id, fd) : await createAvis(fd)
      if (res.success) {
        toast.success(avis ? 'Avis mis à jour' : 'Avis ajouté')
        onDone()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Nom du client</Label>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Note</Label>
        <div className="mt-1"><StarRating value={note} onChange={setNote} /></div>
      </div>
      <div>
        <Label>Témoignage</Label>
        <Textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={3} className="mt-1 resize-none" />
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Photo (optionnelle)</Label>
        <div className="mt-1 flex items-center gap-3">
          {preview && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              <Image src={preview} alt="" fill className="object-cover" />
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Choisir
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)) }
          }} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={published} onCheckedChange={setPublished} />
        <Label>Publié</Label>
      </div>
      <Button onClick={submit} disabled={isPending} className="w-full text-white" style={{ backgroundColor: '#B8860B' }}>
        {isPending ? 'Enregistrement...' : avis ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </div>
  )
}

export function AvisClient({ avis }: { avis: AvisProps[] }) {
  const [openModal, setOpenModal] = useState<string | 'new' | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleAvis(id, !current)
      if (!res.success) toast.error(res.error)
      else toast.success(!current ? 'Avis publié' : 'Avis masqué')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteAvis(id)
      if (res.success) toast.success('Avis supprimé')
      else toast.error(res.error)
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={openModal === 'new'} onOpenChange={(o) => setOpenModal(o ? 'new' : null)}>
          <DialogTrigger className="inline-flex items-center gap-2 rounded-lg px-2.5 h-8 text-sm font-medium text-white transition-all" style={{ backgroundColor: '#B8860B' }}>
            <Plus size={16} /> Ajouter un avis
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nouvel avis</DialogTitle></DialogHeader>
            <AvisForm onDone={() => setOpenModal(null)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {avis.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            {a.avatarUrl ? (
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image src={a.avatarUrl} alt={a.nomClient} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold shrink-0">
                {a.nomClient[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900">{a.nomClient}</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} size={12} fill={n <= a.note ? '#F59E0B' : 'none'} className={n <= a.note ? 'text-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(a.dateAvis).toLocaleDateString('fr-FR')}
                </span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', a.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {a.isPublished ? 'Publié' : 'Masqué'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.texte}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={a.isPublished} onCheckedChange={() => handleToggle(a.id, a.isPublished)} disabled={isPending} />

              <Dialog open={openModal === a.id} onOpenChange={(o) => setOpenModal(o ? a.id : null)}>
                <DialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors">
                  <Edit size={14} />
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Modifier l&apos;avis</DialogTitle></DialogHeader>
                  <AvisForm avis={a} onDone={() => setOpenModal(null)} />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-400 hover:text-red-600 hover:bg-accent transition-colors">
                  <Trash2 size={14} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                    <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {avis.length === 0 && <div className="text-center py-16 text-gray-400">Aucun avis</div>}
      </div>
    </div>
  )
}
