'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Image from 'next/image'
import { getImageUrl } from '@/lib/cloudinary'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, X, Star, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ModeleConstruction, ModeleImage } from '@imora/db'

const schema = z.object({
  titre: z.string().min(1, 'Titre requis'),
  prixFCFA: z.coerce.number().int().positive(),
  superficie: z.coerce.number().int().positive(),
  nbPieces: z.coerce.number().int().positive(),
  niveaux: z.string().min(1),
})
type FormData = z.infer<typeof schema>

const STANDINGS = [
  { value: 'BASIQUE', label: 'Basique' },
  { value: 'MOYEN', label: 'Moyen' },
  { value: 'HAUT_STANDING', label: 'Haut Standing' },
  { value: 'LUXE', label: 'Luxe' },
] as const

interface ModeleFormProps {
  modele?: ModeleConstruction & { images: ModeleImage[] }
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  actionLabel: string
}

export function ModeleForm({ modele, action, actionLabel }: ModeleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [standing, setStanding] = useState<string>(modele?.standing ?? 'BASIQUE')
  const [inclus, setInclus] = useState<string[]>(
    Array.isArray(modele?.inclus) ? modele.inclus as string[] : []
  )
  const [options, setOptions] = useState<string[]>(
    Array.isArray(modele?.optionsNonIncluses) ? modele.optionsNonIncluses as string[] : []
  )
  const [newInclusItem, setNewInclusItem] = useState('')
  const [newOptionItem, setNewOptionItem] = useState('')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState(
    modele?.images.map((i) => ({ cloudinaryPublicId: i.cloudinaryPublicId, isMain: i.isMain, ordre: i.ordre })) ?? []
  )
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [mainNewIdx, setMainNewIdx] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      titre: modele?.titre ?? '',
      prixFCFA: modele?.prixFCFA ?? undefined,
      superficie: modele?.superficie ?? undefined,
      nbPieces: modele?.nbPieces ?? undefined,
      niveaux: modele?.niveaux ?? 'R+0',
    },
  })

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((f) => {
      setNewFiles((p) => [...p, f])
      setNewPreviews((p) => [...p, URL.createObjectURL(f)])
    })
  }

  function onSubmit(data: FormData, status: 'DRAFT' | 'PUBLISHED') {
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)))
      fd.set('status', status)
      fd.set('standing', standing)
      fd.set('inclus', JSON.stringify(inclus))
      fd.set('optionsNonIncluses', JSON.stringify(options))
      fd.set('composition', JSON.stringify({}))
      fd.set('deletedImageIds', deletedIds.join(','))
      fd.set('mainImagePublicId', existingImages.find((i) => i.isMain)?.cloudinaryPublicId ?? '')
      fd.set('mainImageIdx', String(mainNewIdx))
      newFiles.forEach((f) => fd.append(modele ? 'newImages' : 'images', f))

      const res = await action(fd as unknown as FormData)
      if (res.success) {
        toast.success(status === 'PUBLISHED' ? 'Modèle publié avec succès' : 'Brouillon enregistré')
        router.push('/construction')
      } else {
        toast.error(res.error ?? 'Erreur lors de l\'enregistrement')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Photos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Photos</h2>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        >
          <Upload className="mx-auto mb-2 text-gray-300" size={28} />
          <p className="text-sm text-gray-400">Ajouter des photos</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((img) => {
            const url = getImageUrl(img.cloudinaryPublicId, { width: 150, height: 150, crop: 'fill' })
            return (
              <div key={img.cloudinaryPublicId} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image src={url} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button type="button" onClick={() => setExistingImages((p) => p.map((i) => ({ ...i, isMain: i.cloudinaryPublicId === img.cloudinaryPublicId })))} className={cn('p-1 rounded-full', img.isMain ? 'text-yellow-400' : 'text-white')}>
                    <Star size={14} fill={img.isMain ? 'currentColor' : 'none'} />
                  </button>
                  <button type="button" onClick={() => { setDeletedIds((p) => [...p, img.cloudinaryPublicId]); setExistingImages((p) => p.filter((i) => i.cloudinaryPublicId !== img.cloudinaryPublicId)) }} className="p-1 rounded-full text-red-400">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })}
          {newPreviews.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button type="button" onClick={() => setMainNewIdx(i)} className={cn('p-1 rounded-full', mainNewIdx === i ? 'text-yellow-400' : 'text-white')}>
                  <Star size={14} fill={mainNewIdx === i ? 'currentColor' : 'none'} />
                </button>
                <button type="button" onClick={() => { setNewFiles((p) => p.filter((_, j) => j !== i)); setNewPreviews((p) => p.filter((_, j) => j !== i)) }} className="p-1 rounded-full text-red-400">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Informations</h2>

        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Titre *</Label>
          <Input {...register('titre')} />
          {errors.titre && <p className="text-xs text-red-500 mt-0.5">{errors.titre.message}</p>}
        </div>

        {/* Standing tabs */}
        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Standing</Label>
          <div className="grid grid-cols-4 gap-2">
            {STANDINGS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStanding(s.value)}
                className={cn(
                  'py-2 px-3 rounded-lg text-xs font-medium border transition-colors',
                  standing === s.value
                    ? 'text-white border-transparent'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300'
                )}
                style={standing === s.value ? { backgroundColor: '#B8860B' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Prix FCFA *</Label>
            <Input {...register('prixFCFA')} type="number" />
          </div>
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Superficie (m²) *</Label>
            <Input {...register('superficie')} type="number" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Nb pièces *</Label>
            <Input {...register('nbPieces')} type="number" />
          </div>
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">Niveaux</Label>
            <Input {...register('niveaux')} placeholder="R+0" />
          </div>
        </div>

        {/* Inclus */}
        <ListEditor label="Inclus" items={inclus} newItem={newInclusItem} onNewItemChange={setNewInclusItem}
          onAdd={() => { if (newInclusItem.trim()) { setInclus((p) => [...p, newInclusItem.trim()]); setNewInclusItem('') } }}
          onRemove={(i) => setInclus((p) => p.filter((_, j) => j !== i))} />

        {/* Options non incluses */}
        <ListEditor label="Options non incluses" items={options} newItem={newOptionItem} onNewItemChange={setNewOptionItem}
          onAdd={() => { if (newOptionItem.trim()) { setOptions((p) => [...p, newOptionItem.trim()]); setNewOptionItem('') } }}
          onRemove={(i) => setOptions((p) => p.filter((_, j) => j !== i))} />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d as FormData, 'DRAFT'))} className="flex-1">
            Brouillon
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d as FormData, 'PUBLISHED'))} className="flex-1 text-white" style={{ backgroundColor: '#B8860B' }}>
            {isPending ? 'Enregistrement...' : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ListEditor({ label, items, newItem, onNewItemChange, onAdd, onRemove }: {
  label: string; items: string[]; newItem: string; onNewItemChange: (v: string) => void;
  onAdd: () => void; onRemove: (i: number) => void
}) {
  return (
    <div>
      <Label className="text-sm text-gray-700 mb-1.5 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {item}
            <button type="button" onClick={() => onRemove(i)} className="text-gray-400 hover:text-red-500">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => onNewItemChange(e.target.value)} placeholder="Ajouter..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }} className="text-sm h-8" />
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="h-8 w-8 p-0">
          <Plus size={14} />
        </Button>
      </div>
    </div>
  )
}
