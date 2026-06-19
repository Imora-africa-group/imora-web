'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateLeadSchema = z.object({
  id: z.string(),
  statut: z.enum(['NOUVEAU', 'EN_COURS', 'TRAITE', 'ARCHIVE']),
  notes: z.string().optional(),
})

export async function updateLead(data: z.infer<typeof updateLeadSchema>) {
  try {
    const parsed = updateLeadSchema.parse(data)
    await prisma.lead.update({
      where: { id: parsed.id },
      data: { statut: parsed.statut, notes: parsed.notes },
    })
    revalidatePath('/leads')
    revalidatePath(`/leads/${parsed.id}`)
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({ where: { id } })
    revalidatePath('/leads')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
