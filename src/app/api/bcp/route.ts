import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createBCP } from '@/lib/db'
import { generateAccessToken } from '@/lib/utils'

export async function POST() {
  try {
    const id = uuidv4()
    const accessToken = generateAccessToken()
    const bcp = await createBCP(id, accessToken)
    return NextResponse.json({ id: bcp.id, accessToken: bcp.accessToken })
  } catch (err) {
    console.error('Error creating BCP:', err)
    return NextResponse.json({ error: 'Failed to create BCP' }, { status: 500 })
  }
}
