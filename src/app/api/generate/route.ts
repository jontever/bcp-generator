import { NextRequest, NextResponse } from 'next/server'
import { getBCP, saveBCPContent, setBCPStatus } from '@/lib/db'
import { generateBCPContent } from '@/lib/claude'
import { BCPData } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { bcpId } = await req.json()

  if (!bcpId) {
    return NextResponse.json({ error: 'bcpId is required' }, { status: 400 })
  }

  const bcp = await getBCP(bcpId)
  if (!bcp) {
    return NextResponse.json({ error: 'BCP not found' }, { status: 404 })
  }

  // Mark as generating to prevent duplicate requests
  await setBCPStatus(bcpId, 'generating')

  try {
    const content = await generateBCPContent(bcp.data as BCPData)
    await saveBCPContent(bcpId, content)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Generation error:', err)
    await setBCPStatus(bcpId, 'draft')
    return NextResponse.json(
      { error: 'Failed to generate BCP content. Please try again.' },
      { status: 500 }
    )
  }
}

// Allow up to 5 minutes for generation (Vercel Pro/Enterprise)
export const maxDuration = 300
