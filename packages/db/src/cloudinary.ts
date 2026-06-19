import { v2 as cloudinary } from 'cloudinary'

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function uploadImage(file: Buffer, folder: string): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME not configured')
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `imora/${folder}`, resource_type: 'image' },
        (error, result) => {
          if (error || !result) reject(error)
          else resolve(result.public_id)
        }
      )
      .end(file)
  })
}

export function getImageUrl(
  publicId: string,
  opts: {
    width?: number
    height?: number
    crop?: string
    quality?: string
  } = {}
): string {
  return cloudinary.url(publicId, {
    ...opts,
    format: 'webp',
    quality: opts.quality ?? 'auto',
    fetch_format: 'auto',
  })
}

// Crops to fill exactly width×height, returns optimized WebP URL
export function getOptimizedUrl(
  publicId: string,
  width: number,
  height: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    format: 'webp',
    quality: 'auto',
    fetch_format: 'auto',
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
