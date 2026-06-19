'use server'

import { prisma, sendLeadNotification } from '@imora/db'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(fd: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const nom = String(fd.get('nom') ?? '').trim()
    const prenom = String(fd.get('prenom') ?? '').trim()
    const telephone = String(fd.get('telephone') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const sujet = String(fd.get('sujet') ?? '').trim()

    if (!nom || !prenom || !telephone || !email) {
      return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' }
    }

    const lead = await prisma.lead.create({
      data: {
        nom,
        prenom,
        telephone,
        indicatif: '+229',
        email,
        pays: 'Non précisé',
        message: sujet ? `[${sujet}] ${message}` : message,
        serviceType: 'LOCATIVE',
      },
    })

    await sendLeadNotification(lead).catch(() => {})

    revalidatePath('/contact')
    return { success: true }
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }
}
