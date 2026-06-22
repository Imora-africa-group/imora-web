export async function revalidateWebApp(paths: string[]): Promise<void> {
  const webUrl = process.env.WEB_APP_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!webUrl || !secret) return

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    })
  } catch {
    // Non-blocking — le cache sera invalidé à la prochaine expiration ISR
  }
}
