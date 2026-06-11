import { sql } from '@vercel/postgres'
import { BCPRecord } from './types'

export async function createBCP(id: string, accessToken: string): Promise<BCPRecord> {
  const result = await sql<BCPRecord>`
    INSERT INTO bcps (id, access_token, data, status, current_step)
    VALUES (${id}, ${accessToken}, ${JSON.stringify({})}::jsonb, 'draft', 1)
    RETURNING id, access_token as "accessToken", created_at as "createdAt",
              updated_at as "updatedAt", data, generated_content as "generatedContent",
              status, current_step as "currentStep"
  `
  return result.rows[0]
}

export async function getBCP(id: string): Promise<BCPRecord | null> {
  const result = await sql<BCPRecord>`
    SELECT id, access_token as "accessToken", created_at as "createdAt",
           updated_at as "updatedAt", data, generated_content as "generatedContent",
           status, current_step as "currentStep"
    FROM bcps WHERE id = ${id}
  `
  return result.rows[0] ?? null
}

export async function getBCPByToken(accessToken: string): Promise<BCPRecord | null> {
  const result = await sql<BCPRecord>`
    SELECT id, access_token as "accessToken", created_at as "createdAt",
           updated_at as "updatedAt", data, generated_content as "generatedContent",
           status, current_step as "currentStep"
    FROM bcps WHERE access_token = ${accessToken}
  `
  return result.rows[0] ?? null
}

export async function updateBCPData(
  id: string,
  data: Record<string, unknown>,
  currentStep: number
): Promise<BCPRecord | null> {
  const result = await sql<BCPRecord>`
    UPDATE bcps
    SET data = ${JSON.stringify(data)}::jsonb,
        current_step = ${currentStep},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, access_token as "accessToken", created_at as "createdAt",
              updated_at as "updatedAt", data, generated_content as "generatedContent",
              status, current_step as "currentStep"
  `
  return result.rows[0] ?? null
}

export async function saveBCPContent(
  id: string,
  generatedContent: string
): Promise<void> {
  await sql`
    UPDATE bcps
    SET generated_content = ${generatedContent},
        status = 'complete',
        updated_at = NOW()
    WHERE id = ${id}
  `
}

export async function setBCPStatus(
  id: string,
  status: 'draft' | 'generating' | 'complete'
): Promise<void> {
  await sql`
    UPDATE bcps SET status = ${status}, updated_at = NOW() WHERE id = ${id}
  `
}
