'use client'
import { useState } from 'react'
import { BCPData } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

const SECTIONS: { label: string; field: keyof BCPData }[] = [
  { label: 'Company profile', field: 'company' },
  { label: 'Key people', field: 'people' },
  { label: 'Critical functions', field: 'functions' },
  { label: 'Threat assessment', field: 'threats' },
  { label: 'Recovery strategies', field: 'strategies' },
  { label: 'IT & data recovery', field: 'itRecovery' },
  { label: 'Communications plan', field: 'communications' },
  { label: 'Maintenance & testing', field: 'maintenance' },
]

export default function Step9Generate({ data, onBack, bcpId }: Props) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completedSections = SECTIONS.filter(s => {
    const val = data[s.field]
    if (!val) return false
    if (Array.isArray(val)) return val.length > 0
    return Object.keys(val).length > 0
  })

  const allComplete = completedSections.length === SECTIONS.length

  async function generate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch(`/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bcpId }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push(`/bcp/${bcpId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.')
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-title mb-3">Sections completed</p>
        <div className="space-y-2">
          {SECTIONS.map(s => {
            const done = completedSections.find(c => c.field === s.field)
            return (
              <div key={s.field} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? '✓' : '·'}
                </span>
                <span className={`text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {!allComplete && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
          <strong>Some sections are incomplete.</strong> You can still generate your BCP, but the document will have gaps where information is missing. Go back to complete the missing sections for a better result.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-sm text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        Claude will now analyse your answers and write a complete, professional Business Continuity Plan. This typically takes 30–60 seconds.
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button
          onClick={generate}
          disabled={generating}
          className="rounded-lg bg-gov-yellow px-8 py-3 font-bold text-gov-blue hover:bg-yellow-300 transition-colors disabled:opacity-60"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gov-blue border-t-transparent" />
              Generating your BCP…
            </span>
          ) : 'Generate my Business Continuity Plan'}
        </button>
      </div>
    </div>
  )
}
