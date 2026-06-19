const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`

export function getImageUrl(
  publicId: string,
  opts: { width?: number; height?: number; crop?: string; quality?: string } = {}
): string {
  const parts: string[] = []
  if (opts.width) parts.push(`w_${opts.width}`)
  if (opts.height) parts.push(`h_${opts.height}`)
  if (opts.crop) parts.push(`c_${opts.crop}`)
  parts.push(`q_${opts.quality ?? 'auto'}`, 'f_webp')
  return `${BASE}/${parts.join(',')}/${publicId}`
}
