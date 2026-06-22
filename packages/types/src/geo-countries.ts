import { Country } from 'country-state-city'

// Pays africains mis en avant (marchés cibles IMORA).
const AFRICA_FIRST = [
  'Bénin',
  "Côte d'Ivoire",
  'Sénégal',
  'Cameroun',
  'Mali',
  'Togo',
  'Burkina Faso',
  'Niger',
  'Guinée',
  'Gabon',
  'Congo',
]

function getCountryName(isoCode: string): string | undefined {
  return Country.getCountryByCode(isoCode)?.name
}

// Résoudre les noms français des pays africains prioritaires via leur code ISO.
const AFRICA_ISO: Record<string, string> = {
  BJ: 'Bénin',
  CI: "Côte d'Ivoire",
  SN: 'Sénégal',
  CM: 'Cameroun',
  ML: 'Mali',
  TG: 'Togo',
  BF: 'Burkina Faso',
  NE: 'Niger',
  GN: 'Guinée',
  GA: 'Gabon',
  CG: 'Congo',
}

const allCountries = Country.getAllCountries().map((c) => c.name)

// Pays diaspora européens / nord-américains souvent représentés.
const DIASPORA_FIRST = [
  'France',
  'Belgium',
  'United States',
  'Canada',
  'Germany',
  'United Kingdom',
  'Spain',
  'Italy',
  'Switzerland',
  'Netherlands',
  'Portugal',
]

const africanNames = Object.values(AFRICA_ISO)
const prioritySet = new Set([...africanNames, ...DIASPORA_FIRST])

const rest = allCountries.filter((name) => !prioritySet.has(name)).sort()

export const WORLD_COUNTRIES: string[] = [
  ...africanNames,
  ...DIASPORA_FIRST.filter((c) => !africanNames.includes(c)),
  ...rest,
]
