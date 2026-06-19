'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'

export async function createPartenaire(formData: FormData) {
  try {
    const nom = formData.get('nom') as string
    const ordre = Number(formData.get('ordre') ?? 0)
    const file = formData.get('logo') as File
    if (!file || file.size === 0) return { success: false, error: 'Logo requis' }

    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = await uploadImage(buffer, 'partenaires')

    await prisma.partenaire.create({ data: { nom, cloudinaryPublicId: publicId, ordre } })
    revalidatePath('/partenaires')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la création' }
  }
}

export async function updatePartenaire(id: string, formData: FormData) {
  try {
    const nom = formData.get('nom') as string
    const file = formData.get('logo') as File | null

    const data: { nom: string; cloudinaryPublicId?: string } = { nom }

    if (file && file.size > 0) {
      const existing = await prisma.partenaire.findUnique({ where: { id } })
      if (existing) await deleteImage(existing.cloudinaryPublicId)
      const buffer = Buffer.from(await file.arrayBuffer())
      data.cloudinaryPublicId = await uploadImage(buffer, 'partenaires')
    }

    await prisma.partenaire.update({ where: { id }, data })
    revalidatePath('/partenaires')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function togglePartenaire(id: string, isActive: boolean) {
  try {
    await prisma.partenaire.update({ where: { id }, data: { isActive } })
    revalidatePath('/partenaires')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function deletePartenaire(id: string) {
  try {
    const p = await prisma.partenaire.findUnique({ where: { id } })
    if (p) await deleteImage(p.cloudinaryPublicId)
    await prisma.partenaire.delete({ where: { id } })
    revalidatePath('/partenaires')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
