'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { revalidateWebApp } from '@/lib/revalidate'

const modeleSchema = z.object({
  titre: z.string().min(1),
  standing: z.enum(['BASIQUE', 'MOYEN', 'HAUT_STANDING', 'LUXE']),
  prixFCFA: z.coerce.number().int().positive(),
  superficie: z.coerce.number().int().positive(),
  nbPieces: z.coerce.number().int().positive(),
  niveaux: z.string().min(1),
  inclus: z.string().default('[]'),
  optionsNonIncluses: z.string().default('[]'),
  composition: z.string().default('{}'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export async function createModele(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = modeleSchema.parse(raw)

    const modele = await prisma.modeleConstruction.create({
      data: {
        ...data,
        inclus: JSON.parse(data.inclus),
        optionsNonIncluses: JSON.parse(data.optionsNonIncluses),
        composition: JSON.parse(data.composition),
      },
    })

    const imageFiles = formData.getAll('images') as File[]
    const mainIdx = Number(formData.get('mainImageIdx') ?? 0)
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'construction')
      await prisma.modeleImage.create({
        data: { modeleId: modele.id, cloudinaryPublicId: publicId, ordre: i, isMain: i === mainIdx },
      })
    }

    revalidatePath('/construction')
    revalidateWebApp(['/construction', '/']).catch((e) =>
      console.warn('[revalidate] web sync failed:', e)
    )
    return { success: true }
  } catch (error) {
    console.error('[createModele]', error)
    return { success: false, error: 'Erreur lors de la création du modèle' }
  }
}

export async function updateModele(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = modeleSchema.parse(raw)

    await prisma.modeleConstruction.update({
      where: { id },
      data: {
        ...data,
        inclus: JSON.parse(data.inclus),
        optionsNonIncluses: JSON.parse(data.optionsNonIncluses),
        composition: JSON.parse(data.composition),
      },
    })

    const deletedIds = (formData.get('deletedImageIds') as string ?? '').split(',').filter(Boolean)
    for (const pid of deletedIds) {
      await deleteImage(pid)
      await prisma.modeleImage.deleteMany({ where: { cloudinaryPublicId: pid } })
    }

    const imageFiles = formData.getAll('newImages') as File[]
    const existing = await prisma.modeleImage.findMany({ where: { modeleId: id } })
    const nextOrdre = (existing[existing.length - 1]?.ordre ?? -1) + 1
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (!file || file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = await uploadImage(buffer, 'construction')
      await prisma.modeleImage.create({
        data: { modeleId: id, cloudinaryPublicId: publicId, ordre: nextOrdre + i, isMain: false },
      })
    }

    const mainPid = formData.get('mainImagePublicId') as string | null
    if (mainPid) {
      await prisma.modeleImage.updateMany({ where: { modeleId: id }, data: { isMain: false } })
      await prisma.modeleImage.updateMany({ where: { modeleId: id, cloudinaryPublicId: mainPid }, data: { isMain: true } })
    }

    revalidatePath('/construction')
    revalidateWebApp(['/construction', '/']).catch((e) =>
      console.warn('[revalidate] web sync failed:', e)
    )
    return { success: true }
  } catch (error) {
    console.error('[updateModele]', error)
    return { success: false, error: 'Erreur lors de la mise à jour du modèle' }
  }
}

export async function updateModeleStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
  try {
    await prisma.modeleConstruction.update({ where: { id }, data: { status } })
    revalidatePath('/construction')
    revalidateWebApp(['/construction', '/']).catch((e) =>
      console.warn('[revalidate] web sync failed:', e)
    )
    return { success: true }
  } catch (error) {
    console.error('[updateModeleStatus]', error)
    return { success: false, error: 'Erreur lors du changement de statut' }
  }
}

export async function deleteModele(id: string) {
  try {
    const images = await prisma.modeleImage.findMany({ where: { modeleId: id } })
    await Promise.all(images.map((img) => deleteImage(img.cloudinaryPublicId)))
    await prisma.modeleConstruction.delete({ where: { id } })
    revalidatePath('/construction')
    revalidateWebApp(['/construction', '/']).catch((e) =>
      console.warn('[revalidate] web sync failed:', e)
    )
    return { success: true }
  } catch (error) {
    console.error('[deleteModele]', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
