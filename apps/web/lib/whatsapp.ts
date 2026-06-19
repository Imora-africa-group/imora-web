export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export const WA_MESSAGES = {
  general: 'Bonjour IMORA AFRICA, je souhaite avoir des informations sur vos services.',
  parcelle: (ref: string) =>
    `Bonjour IMORA AFRICA, je suis intéressé(e) par la parcelle réf. ${ref}.`,
  construction: (standing: string) =>
    `Bonjour IMORA AFRICA, je souhaite démarrer un projet de construction ${standing}.`,
  simulation: (zone: string, standing: string) =>
    `Bonjour IMORA AFRICA, j'ai complété une simulation pour ${standing} à ${zone}. Je souhaite en savoir plus.`,
}
