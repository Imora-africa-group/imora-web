'use server'

import { prisma, uploadImage, deleteImage } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { revalidateWebApp } from '@/lib/revalidate'

export async function createPartenaire(formData: FormData) {
  try {
    const nom = formData.get('nom') as string
    const ordre = Number(formData.get('ordre') ?? 0)
    const file = formData.get('logo') as File
    if (!file || file.size === 0) return { success: false, error: 'Logo requis' }

    const buffer = Buffer.from(await file.arrayBuffer())
    const publicId = await uploadImage(buffer, 'partenaires')

    await prisma.partenaire.create({ data: { nom, cloudinaryPublicId: publicId, ordre } })
    revalidatePath('/', 'layout')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[createPartenaire]', error)
    return { success: false, error: 'Erreur lors de la création du partenaire' }
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
    revalidatePath('/', 'layout')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[updatePartenaire]', error)
    return { success: false, error: 'Erreur lors de la mise à jour du partenaire' }
  }
}

export async function togglePartenaire(id: string, isActive: boolean) {
  try {
    await prisma.partenaire.update({ where: { id }, data: { isActive } })
    revalidatePath('/', 'layout')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[togglePartenaire]', error)
    return { success: false, error: 'Erreur lors du changement de statut' }
  }
}

export async function deletePartenaire(id: string) {
  try {
    const p = await prisma.partenaire.findUnique({ where: { id } })
    if (p) await deleteImage(p.cloudinaryPublicId)
    await prisma.partenaire.delete({ where: { id } })
    revalidatePath('/', 'layout')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[deletePartenaire]', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
