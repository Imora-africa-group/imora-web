'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const realisSchema = z.object({
  titre: z.string().min(1),
  description: z.string().optional(),
  zone: z.string().min(1),
  standing: z.enum(['BASIQUE', 'MOYEN', 'HAUT_STANDING', 'LUXE']),
  annee: z.coerce.number().int().min(1990).max(2100),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export async function createRealisation(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = realisSchema.parse(raw)
    const r = await prisma.realisation.create({ data })

    const imageFiles = formData.getAll('images') as File[]
    const mainIdx = Number(formData.get('mainImageIdx') ?? 0)
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'realisations')
      await prisma.realisationImage.create({
        data: { realisationId: r.id, cloudinaryPublicId: publicId, ordre: i, isMain: i === mainIdx },
      })
    }
    revalidatePath('/realisations')
  } catch {
    return { success: false, error: 'Erreur lors de la création' }
  }
  redirect('/realisations')
}

export async function updateRealisation(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = realisSchema.parse(raw)
    await prisma.realisation.update({ where: { id }, data })

    const deletedIds = (formData.get('deletedImageIds') as string ?? '').split(',').filter(Boolean)
    for (const pid of deletedIds) {
      await deleteImage(pid)
      await prisma.realisationImage.deleteMany({ where: { cloudinaryPublicId: pid } })
    }

    const imageFiles = formData.getAll('newImages') as File[]
    const existing = await prisma.realisationImage.findMany({ where: { realisationId: id } })
    const nextOrdre = (existing[existing.length - 1]?.ordre ?? -1) + 1
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'realisations')
      await prisma.realisationImage.create({
        data: { realisationId: id, cloudinaryPublicId: publicId, ordre: nextOrdre + i, isMain: false },
      })
    }

    const mainPid = formData.get('mainImagePublicId') as string | null
    if (mainPid) {
      await prisma.realisationImage.updateMany({ where: { realisationId: id }, data: { isMain: false } })
      await prisma.realisationImage.updateMany({ where: { realisationId: id, cloudinaryPublicId: mainPid }, data: { isMain: true } })
    }

    revalidatePath('/realisations')
  } catch {
    return { success: false, error: 'Erreur' }
  }
  redirect('/realisations')
}

export async function updateRealisationStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
  try {
    await prisma.realisation.update({ where: { id }, data: { status } })
    revalidatePath('/realisations')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function deleteRealisation(id: string) {
  try {
    const images = await prisma.realisationImage.findMany({ where: { realisationId: id } })
    await Promise.all(images.map((img) => deleteImage(img.cloudinaryPublicId)))
    await prisma.realisation.delete({ where: { id } })
    revalidatePath('/realisations')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}
