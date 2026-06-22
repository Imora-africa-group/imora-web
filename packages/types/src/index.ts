export { BENIN_VILLES, BENIN_VILLE_NOMS, getArrondissements } from './geo-benin'
export type { BéninVille } from './geo-benin'
export { WORLD_COUNTRIES } from './geo-countries'

// Enums — mirrors Prisma schema exactly (string union types for portability)
export type StandingType = 'BASIQUE' | 'MOYEN' | 'HAUT_STANDING' | 'LUXE'
export type LeadStatus = 'NOUVEAU' | 'EN_COURS' | 'TRAITE' | 'ARCHIVE'
export type ServiceType = 'PARCELLE' | 'CONSTRUCTION' | 'LOCATIVE' | 'SIMULATION'
export type PublishStatus = 'DRAFT' | 'PUBLISHED'
export type AdminRole = 'SUPER_ADMIN' | 'EDITEUR'

export type PriceData = {
  fcfa: number
  usd: number
  eur: number
}

export type SimulationState = {
  step: 1 | 2 | 3
  pays?: string
  ville?: string
  arrondissement?: string
  prixMinFCFA?: number
  prixMaxFCFA?: number
  standing?: StandingType
  modeleId?: string
  modelePrixFCFA?: number
  gestionLocative?: boolean
  loyerMinFCFA?: number
  loyerMaxFCFA?: number
}

export type LeadFormData = {
  nom: string
  prenom: string
  telephone: string
  indicatif: string
  email: string
  pays: string
  message?: string
  serviceType: ServiceType
  simulationData?: SimulationState
  extras?: string[]
}
