import { NextRequest, NextResponse } from 'next/server'
import { searchPexelsImage } from '@/lib/pexels'

export async function POST(req: NextRequest) {
  const pexelsKey = req.headers.get('x-pexels-key')
  if (!pexelsKey) return NextResponse.json({ image_url: null })

  const { word } = await req.json()
  if (!word) return NextResponse.json({ image_url: null })

  const image_url = await searchPexelsImage(word, pexelsKey)
  return NextResponse.json({ image_url })
}
