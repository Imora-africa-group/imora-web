import { prisma } from './client'

const API_URL = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/XOF`

export async function fetchAndStoreRates(): Promise<void> {
  if (!process.env.EXCHANGE_RATE_API_KEY) {
    console.warn('EXCHANGE_RATE_API_KEY not set — skipping rate fetch')
    return
  }
  try {
    const res = await fetch(API_URL, { cache: 'no-store' })
    const data = await res.json()

    if (data.result !== 'success') throw new Error('API error')

    await prisma.settings.update({
      where: { id: 'singleton' },
      data: {
        exchangeRateUSD: data.conversion_rates.USD,
        exchangeRateEUR: data.conversion_rates.EUR,
        exchangeRateUpdatedAt: new Date(),
      },
    })
  } catch (error) {
    // Fallback rates remain unchanged in DB — no action needed
    console.error('Exchange rate fetch failed, keeping fallback rates:', error)
  }
}

export async function getCurrentRates(): Promise<{ usd: number; eur: number }> {
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  return {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }
}

export function convertPrice(
  fcfa: number,
  rates: { usd: number; eur: number }
): { fcfa: number; usd: number; eur: number } {
  return {
    fcfa,
    usd: Math.round(fcfa * rates.usd),
    eur: Math.round(fcfa * rates.eur),
  }
}
