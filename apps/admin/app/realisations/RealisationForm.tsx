'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Image from 'next/image'
import { getImageUrl } from '@/lib/cloudinary'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Realisation, RealisationImage } from '@imora/db'

const schema = z.object({
  titre: z.string().min(1, 'Titre requis'),
  description: z.string().optional(),
  zone: z.string().min(1, 'Zone requise'),
  annee: z.coerce.number().int().min(1990).max(2100),
})
type FormData = z.infer<typeof schema>

const STANDINGS = [
  { value: 'BASIQUE', label: 'Basique' },
  { value: 'MOYEN', label: 'Moyen' },
  { value: 'HAUT_STANDING', label: 'Haut Standing' },
  { value: 'LUXE', label: 'Luxe' },
]

interface Props {
  realisation?: Realisation & { images: RealisationImage[] }
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  actionLabel: string
}

export function RealisationForm({ realisation, action, actionLabel }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [standing, setStanding] = useState(realisation?.standing ?? 'HAUT_STANDING')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState(
    realisation?.images.map((i) => ({ cloudinaryPublicId: i.cloudinaryPublicId, isMain: i.isMain, ordre: i.ordre })) ?? []
  )
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [mainNewIdx, setMainNewIdx] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      titre: realisation?.titre ?? '',
      description: realisation?.description ?? '',
      zone: realisation?.zone ?? '',
      annee: realisation?.annee ?? new Date().getFullYear(),
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
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)) })
      fd.set('status', status)
      fd.set('standing', standing)
      fd.set('deletedImageIds', deletedIds.join(','))
      fd.set('mainImagePublicId', existingImages.find((i) => i.isMain)?.cloudinaryPublicId ?? '')
      fd.set('mainImageIdx', String(mainNewIdx))
      newFiles.forEach((f) => fd.append(realisation ? 'newImages' : 'images', f))

      const res = await action(fd as unknown as FormData)
      if (res.success) {
        toast.success(status === 'PUBLISHED' ? 'Réalisation publiée avec succès' : 'Brouillon enregistré')
        router.push('/realisations')
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
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-300 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        >
          <Upload className="mx-auto mb-2 text-gray-300" size={32} />
          <p className="text-sm text-gray-400">Glissez des photos ou cliquez</p>
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

        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Zone *</Label>
          <Input {...register('zone')} placeholder="Ex: Calavi, Cotonou..." />
        </div>

        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Standing</Label>
          <Select value={standing} onValueChange={(v) => { if (v) setStanding(v as typeof standing) }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STANDINGS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Année *</Label>
          <Input {...register('annee')} type="number" placeholder={String(new Date().getFullYear())} />
        </div>

        <div>
          <Label className="text-sm text-gray-700 mb-1.5 block">Description</Label>
          <Textarea {...register('description')} rows={4} className="resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d, 'DRAFT'))} className="flex-1">
            Brouillon
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d, 'PUBLISHED'))} className="flex-1 text-white" style={{ backgroundColor: '#B8860B' }}>
            {isPending ? 'Enregistrement...' : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
