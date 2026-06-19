'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const parcelleSchema = z.object({
  titre: z.string().min(1),
  pays: z.string().min(1),
  ville: z.string().min(1),
  arrondissement: z.string().min(1),
  quartier: z.string().min(1),
  prixFCFA: z.coerce.number().int().positive(),
  superficie: z.coerce.number().int().positive(),
  titreFoncier: z.coerce.boolean().default(false),
  venteNotariee: z.coerce.boolean().default(false),
  viabilisation: z.coerce.boolean().default(false),
  distanceGoudron: z.coerce.number().int().nullable().optional(),
  distanceCentreVille: z.coerce.number().nullable().optional(),
  tempsCotonou: z.coerce.number().int().nullable().optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export async function createParcelle(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = parcelleSchema.parse({
      ...raw,
      titreFoncier: raw.titreFoncier === 'true' || raw.titreFoncier === 'on',
      venteNotariee: raw.venteNotariee === 'true' || raw.venteNotariee === 'on',
      viabilisation: raw.viabilisation === 'true' || raw.viabilisation === 'on',
      distanceGoudron: raw.distanceGoudron || null,
      distanceCentreVille: raw.distanceCentreVille || null,
      tempsCotonou: raw.tempsCotonou || null,
    })

    const parcelle = await prisma.parcelle.create({ data })

    const imageFiles = formData.getAll('images') as File[]
    const mainImageIdx = Number(formData.get('mainImageIdx') ?? 0)

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'parcelles')
      await prisma.parcelleImage.create({
        data: {
          parcelleId: parcelle.id,
          cloudinaryPublicId: publicId,
          ordre: i,
          isMain: i === mainImageIdx,
        },
      })
    }

    revalidatePath('/parcelles')
  } catch {
    return { success: false, error: 'Erreur lors de la création' }
  }
  redirect('/parcelles')
}

export async function updateParcelle(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = parcelleSchema.parse({
      ...raw,
      titreFoncier: raw.titreFoncier === 'true' || raw.titreFoncier === 'on',
      venteNotariee: raw.venteNotariee === 'true' || raw.venteNotariee === 'on',
      viabilisation: raw.viabilisation === 'true' || raw.viabilisation === 'on',
      distanceGoudron: raw.distanceGoudron || null,
      distanceCentreVille: raw.distanceCentreVille || null,
      tempsCotonou: raw.tempsCotonou || null,
    })

    await prisma.parcelle.update({ where: { id }, data })

    const imageFiles = formData.getAll('newImages') as File[]
    const mainImagePublicId = formData.get('mainImagePublicId') as string | null
    const deletedIds = (formData.get('deletedImageIds') as string ?? '').split(',').filter(Boolean)

    for (const publicId of deletedIds) {
      await deleteImage(publicId)
      await prisma.parcelleImage.deleteMany({ where: { cloudinaryPublicId: publicId } })
    }

    const existing = await prisma.parcelleImage.findMany({ where: { parcelleId: id } })
    const nextOrdre = (existing[existing.length - 1]?.ordre ?? -1) + 1

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'parcelles')
      await prisma.parcelleImage.create({
        data: {
          parcelleId: id,
          cloudinaryPublicId: publicId,
          ordre: nextOrdre + i,
          isMain: false,
        },
      })
    }

    if (mainImagePublicId) {
      await prisma.parcelleImage.updateMany({ where: { parcelleId: id }, data: { isMain: false } })
      await prisma.parcelleImage.updateMany({
        where: { parcelleId: id, cloudinaryPublicId: mainImagePublicId },
        data: { isMain: true },
      })
    }

    revalidatePath('/parcelles')
    revalidatePath(`/parcelles/${id}/edit`)
  } catch {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
  redirect('/parcelles')
}

export async function updateParcelleStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
  try {
    await prisma.parcelle.update({ where: { id }, data: { status } })
    revalidatePath('/parcelles')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function deleteParcelle(id: string) {
  try {
    const images = await prisma.parcelleImage.findMany({ where: { parcelleId: id } })
    await Promise.all(images.map((img) => deleteImage(img.cloudinaryPublicId)))
    await prisma.parcelle.delete({ where: { id } })
    revalidatePath('/parcelles')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
