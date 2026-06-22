// Données administratives du Bénin pour les formulaires IMORA.
// Villes : principales communes opérationnelles.
// Arrondissements : noms de zones courants en immobilier (pas les numéros officiels).

export interface BéninVille {
  ville: string
  departement: string
  arrondissements: string[]
}

export const BENIN_VILLES: BéninVille[] = [
  {
    ville: 'Cotonou',
    departement: 'Littoral',
    arrondissements: [
      'Aidjèdo',
      'Akpakpa',
      'Akpakpa Nord',
      'Cadjèhoun',
      'Dantokpa',
      'Fidjrossè',
      'Gbégamey',
      'Houéyiho',
      'Jéricho',
      'Missèbo',
      'Sainte-Rita',
      'Tokplégbé',
      'Vossa',
      'Zogbo',
    ],
  },
  {
    ville: 'Abomey-Calavi',
    departement: 'Atlantique',
    arrondissements: [
      'Akassato',
      'Calavi Centre',
      'Glo-Djigbé',
      'Godomey',
      'Hêvié',
      'Kpanroun',
      'Ouèdo',
      'Togba',
      'Zinvié',
    ],
  },
  {
    ville: 'Porto-Novo',
    departement: 'Ouémé',
    arrondissements: [
      'Avoti',
      'Ekpè',
      'Gbeto',
      'Hounkpoto',
      'Ouando',
      'Saint-Gilles',
      'Tokpanou',
    ],
  },
  {
    ville: 'Ouidah',
    departement: 'Atlantique',
    arrondissements: [
      'Avlékété',
      'Gakpè',
      'Kpomassè',
      'Ouidah Centre',
      'Pahou',
    ],
  },
  {
    ville: 'Parakou',
    departement: 'Borgou',
    arrondissements: [
      'Banikanni',
      'Gbéri',
      'Madina',
      'Parakou Centre',
      'Tourou',
      'Zongo',
    ],
  },
  {
    ville: 'Bohicon',
    departement: 'Zou',
    arrondissements: [
      'Avogbanna',
      'Bohicon Centre',
      'Gnidjazoun',
      'Lissègazoun',
      'Saclo',
    ],
  },
  {
    ville: 'Abomey',
    departement: 'Zou',
    arrondissements: [
      'Abomey Centre',
      'Djidja',
      'Zogbanou',
    ],
  },
  {
    ville: 'Lokossa',
    departement: 'Mono',
    arrondissements: [
      'Agamè',
      'Koudo',
      'Lokossa Centre',
    ],
  },
  {
    ville: 'Natitingou',
    departement: 'Atakora',
    arrondissements: [
      'Kouandata',
      'Natitingou Centre',
      'Perma',
    ],
  },
  {
    ville: 'Djougou',
    departement: 'Donga',
    arrondissements: [
      'Bariénou',
      'Djougou Centre',
      'Kolokondé',
      'Sérou',
    ],
  },
]

export const BENIN_VILLE_NOMS = BENIN_VILLES.map((v) => v.ville)

export function getArrondissements(ville: string): string[] {
  return BENIN_VILLES.find((v) => v.ville === ville)?.arrondissements ?? []
}
