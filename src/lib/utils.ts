import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { randomBytes } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAccessToken(): string {
  return randomBytes(24).toString('base64url')
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getRiskRating(
  likelihood: 'low' | 'medium' | 'high',
  impact: 'low' | 'medium' | 'high'
): 'low' | 'medium' | 'high' | 'critical' {
  const score = { low: 1, medium: 2, high: 3 }
  const total = score[likelihood] * score[impact]
  if (total >= 9) return 'critical'
  if (total >= 4) return 'high'
  if (total >= 2) return 'medium'
  return 'low'
}

export const RISK_COLOURS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}
