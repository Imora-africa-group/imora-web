'use client'

import { useState, useRef, useTransition } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Upload, X, Star } from 'lucide-react'
import type { Parcelle, ParcelleImage } from '@imora/db'

const schema = z.object({
  titre: z.string().min(1, 'Titre requis'),
  pays: z.string().min(1, 'Pays requis'),
  ville: z.string().min(1, 'Ville requise'),
  arrondissement: z.string().min(1),
  quartier: z.string().min(1),
  prixFCFA: z.coerce.number().int().positive('Prix requis'),
  superficie: z.coerce.number().int().positive('Superficie requise'),
  distanceGoudron: z.coerce.number().int().optional(),
  distanceCentreVille: z.coerce.number().optional(),
  tempsCotonou: z.coerce.number().int().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ExistingImage {
  cloudinaryPublicId: string
  isMain: boolean
  ordre: number
}

interface ParcelleFormProps {
  parcelle?: Parcelle & { images: ParcelleImage[] }
  action: (formData: FormData) => Promise<void>
  actionLabel: string
}

export function ParcelleForm({ parcelle, action, actionLabel }: ParcelleFormProps) {
  const [isPending, startTransition] = useTransition()
  const [titreFoncier, setTitreFoncier] = useState(parcelle?.titreFoncier ?? false)
  const [venteNotariee, setVenteNotariee] = useState(parcelle?.venteNotariee ?? false)
  const [viabilisation, setViabilisation] = useState(parcelle?.viabilisation ?? false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    parcelle?.images.map((i) => ({
      cloudinaryPublicId: i.cloudinaryPublicId,
      isMain: i.isMain,
      ordre: i.ordre,
    })) ?? []
  )
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [mainNewIdx, setMainNewIdx] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      titre: parcelle?.titre ?? '',
      pays: parcelle?.pays ?? 'Bénin',
      ville: parcelle?.ville ?? '',
      arrondissement: parcelle?.arrondissement ?? '',
      quartier: parcelle?.quartier ?? '',
      prixFCFA: parcelle?.prixFCFA ?? undefined,
      superficie: parcelle?.superficie ?? undefined,
      distanceGoudron: parcelle?.distanceGoudron ?? undefined,
      distanceCentreVille: parcelle?.distanceCentreVille ?? undefined,
      tempsCotonou: parcelle?.tempsCotonou ?? undefined,
      description: parcelle?.description ?? '',
    },
  })

  function handleFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files)
    setNewFiles((prev) => [...prev, ...arr])
    arr.forEach((f) => {
      const url = URL.createObjectURL(f)
      setNewPreviews((prev) => [...prev, url])
    })
  }

  function removeNewFile(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  function removeExisting(publicId: string) {
    setDeletedIds((prev) => [...prev, publicId])
    setExistingImages((prev) => prev.filter((i) => i.cloudinaryPublicId !== publicId))
  }

  function setMainExisting(publicId: string) {
    setExistingImages((prev) =>
      prev.map((i) => ({ ...i, isMain: i.cloudinaryPublicId === publicId }))
    )
  }

  function onSubmit(data: FormData, status: 'DRAFT' | 'PUBLISHED') {
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)) })
      fd.set('status', status)
      fd.set('titreFoncier', String(titreFoncier))
      fd.set('venteNotariee', String(venteNotariee))
      fd.set('viabilisation', String(viabilisation))
      fd.set('deletedImageIds', deletedIds.join(','))
      fd.set('mainImagePublicId', existingImages.find((i) => i.isMain)?.cloudinaryPublicId ?? '')
      fd.set('mainImageIdx', String(mainNewIdx))
      newFiles.forEach((f) => fd.append(parcelle ? 'newImages' : 'images', f))

      try {
        await action(fd as unknown as FormData)
        toast.success('Enregistré avec succès')
      } catch {
        toast.error('Erreur lors de l\'enregistrement')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Photos</h2>

          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-300 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          >
            <Upload className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="text-sm text-gray-400">Glissez des photos ou cliquez pour sélectionner</p>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Photos existantes</p>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((img) => {
                  const url = getImageUrl(img.cloudinaryPublicId, { width: 150, height: 150, crop: 'fill' })
                  return (
                    <div key={img.cloudinaryPublicId} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={url} alt="" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setMainExisting(img.cloudinaryPublicId)}
                          className={`p-1 rounded-full ${img.isMain ? 'text-yellow-400' : 'text-white'}`}
                          title="Définir comme principale"
                        >
                          <Star size={14} fill={img.isMain ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExisting(img.cloudinaryPublicId)}
                          className="p-1 rounded-full text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {img.isMain && (
                        <span className="absolute bottom-1 left-1 text-xs bg-amber-500 text-white px-1.5 rounded">
                          Principale
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* New images */}
          {newPreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Nouvelles photos</p>
              <div className="grid grid-cols-3 gap-2">
                {newPreviews.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMainNewIdx(i)}
                        className={`p-1 rounded-full ${mainNewIdx === i ? 'text-yellow-400' : 'text-white'}`}
                      >
                        <Star size={14} fill={mainNewIdx === i ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="p-1 rounded-full text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {mainNewIdx === i && existingImages.every((i) => !i.isMain) && (
                      <span className="absolute bottom-1 left-1 text-xs bg-amber-500 text-white px-1.5 rounded">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form fields */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Informations</h2>

        <Field label="Titre *" error={errors.titre?.message}>
          <Input {...register('titre')} placeholder="Ex: Parcelle viabilisée Calavi" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Pays *" error={errors.pays?.message}>
            <Input {...register('pays')} />
          </Field>
          <Field label="Ville *" error={errors.ville?.message}>
            <Input {...register('ville')} placeholder="Ex: Cotonou" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Arrondissement *" error={errors.arrondissement?.message}>
            <Input {...register('arrondissement')} />
          </Field>
          <Field label="Quartier *" error={errors.quartier?.message}>
            <Input {...register('quartier')} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prix FCFA *" error={errors.prixFCFA?.message}>
            <Input {...register('prixFCFA')} type="number" placeholder="Ex: 5000000" />
          </Field>
          <Field label="Superficie (m²) *" error={errors.superficie?.message}>
            <Input {...register('superficie')} type="number" placeholder="Ex: 200" />
          </Field>
        </div>

        <div className="space-y-3 pt-2">
          <Toggle label="Titre Foncier" value={titreFoncier} onChange={setTitreFoncier} />
          <Toggle label="Vente Notariée" value={venteNotariee} onChange={setVenteNotariee} />
          <Toggle label="Viabilisation" value={viabilisation} onChange={setViabilisation} />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Field label="Distance goudron (m)">
            <Input {...register('distanceGoudron')} type="number" placeholder="Ex: 100" />
          </Field>
          <Field label="Distance centre-ville (km)">
            <Input {...register('distanceCentreVille')} type="number" step="0.1" placeholder="Ex: 5.5" />
          </Field>
          <Field label="Temps Cotonou (min)">
            <Input {...register('tempsCotonou')} type="number" placeholder="Ex: 30" />
          </Field>
        </div>

        <Field label="Description">
          <Textarea {...register('description')} rows={4} placeholder="Description de la parcelle..." className="resize-none" />
        </Field>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleSubmit((d) => onSubmit(d as FormData, 'DRAFT'))}
            className="flex-1"
          >
            Enregistrer brouillon
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit((d) => onSubmit(d as FormData, 'PUBLISHED'))}
            className="flex-1 text-white"
            style={{ backgroundColor: '#B8860B' }}
          >
            {isPending ? 'Enregistrement...' : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-gray-700">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm text-gray-700">{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
}
