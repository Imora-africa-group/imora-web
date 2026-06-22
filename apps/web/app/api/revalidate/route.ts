import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { paths } = (await request.json()) as { paths: string[] }
    for (const path of paths) {
      revalidatePath(path)
    }
    return NextResponse.json({ revalidated: true, paths })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
