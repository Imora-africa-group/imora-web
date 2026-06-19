'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const avisSchema = z.object({
  nomClient: z.string().min(1),
  note: z.coerce.number().int().min(1).max(5),
  texte: z.string().min(1),
  dateAvis: z.string(),
  isPublished: z.coerce.boolean().default(false),
})

export async function createAvis(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = avisSchema.parse({ ...raw, isPublished: raw.isPublished === 'true' })
    const file = formData.get('avatar') as File | null

    let cloudinaryPublicId: string | undefined
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      cloudinaryPublicId = await uploadImage(buffer, 'avis')
    }

    await prisma.avis.create({
      data: {
        ...data,
        dateAvis: new Date(data.dateAvis),
        cloudinaryPublicId,
      },
    })
    revalidatePath('/avis')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la création' }
  }
}

export async function updateAvis(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = avisSchema.parse({ ...raw, isPublished: raw.isPublished === 'true' })
    const file = formData.get('avatar') as File | null

    const updateData: {
      nomClient: string; note: number; texte: string; dateAvis: Date; isPublished: boolean;
      cloudinaryPublicId?: string | null
    } = {
      ...data,
      dateAvis: new Date(data.dateAvis),
    }

    if (file && file.size > 0) {
      const existing = await prisma.avis.findUnique({ where: { id } })
      if (existing?.cloudinaryPublicId) await deleteImage(existing.cloudinaryPublicId)
      const buffer = Buffer.from(await file.arrayBuffer())
      updateData.cloudinaryPublicId = await uploadImage(buffer, 'avis')
    }

    await prisma.avis.update({ where: { id }, data: updateData })
    revalidatePath('/avis')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function toggleAvis(id: string, isPublished: boolean) {
  try {
    await prisma.avis.update({ where: { id }, data: { isPublished } })
    revalidatePath('/avis')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function deleteAvis(id: string) {
  try {
    const a = await prisma.avis.findUnique({ where: { id } })
    if (a?.cloudinaryPublicId) await deleteImage(a.cloudinaryPublicId)
    await prisma.avis.delete({ where: { id } })
    revalidatePath('/avis')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}
