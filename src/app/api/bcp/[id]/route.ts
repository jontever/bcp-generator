import { NextRequest, NextResponse } from 'next/server'
import { getBCP, updateBCPData } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const bcp = await getBCP(id)
    if (!bcp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(bcp)
  } catch (err) {
    console.error('Error fetching BCP:', err)
    return NextResponse.json({ error: 'Failed to fetch BCP' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const { data, currentStep } = body
    const bcp = await updateBCPData(id, data, currentStep ?? 1)
    if (!bcp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(bcp)
  } catch (err) {
    console.error('Error updating BCP:', err)
    return NextResponse.json({ error: 'Failed to update BCP' }, { status: 500 })
  }
}
