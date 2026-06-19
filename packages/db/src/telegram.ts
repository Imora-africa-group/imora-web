import type { Lead } from '@prisma/client'

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

const SERVICE_LABELS: Record<string, string> = {
  PARCELLE: '🏗️ Achat Parcelle',
  CONSTRUCTION: '🏠 Construction',
  LOCATIVE: '🔑 Gestion Locative',
  SIMULATION: '📊 Simulation Complète',
}

export async function sendLeadNotification(lead: Lead): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn('Telegram not configured — skipping notification')
    return
  }
  const message = `
🔔 <b>Nouveau Lead IMORA AFRICA</b>

👤 <b>${lead.prenom} ${lead.nom}</b>
📞 ${lead.indicatif} ${lead.telephone}
📧 ${lead.email}
🌍 ${lead.pays}
🏷️ ${SERVICE_LABELS[lead.serviceType] ?? lead.serviceType}
📅 ${new Date(lead.createdAt).toLocaleString('fr-FR', { timeZone: 'Africa/Porto-Novo' })}

${lead.message ? `💬 <i>${lead.message}</i>` : ''}
${lead.simulationData ? '\n📋 <b>Simulation:</b> Voir le dashboard' : ''}
`.trim()

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  })
}
