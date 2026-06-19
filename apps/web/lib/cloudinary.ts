const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`

export function getImageUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: string } = {}
): string {
  const parts: string[] = []
  if (opts.width) parts.push(`w_${opts.width}`)
  if (opts.height) parts.push(`h_${opts.height}`)
  parts.push(`q_${opts.quality ?? 'auto'}`, 'f_webp')
  return `${BASE}/${parts.join(',')}/${publicId}`
}

export function getOptimizedUrl(publicId: string, width: number, height: number): string {
  return `${BASE}/w_${width},h_${height},c_fill,g_auto,q_auto,f_webp/${publicId}`
}
