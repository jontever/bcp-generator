'use client'
import { useState } from 'react'
import { BCPData, RecoveryStrategy } from '@/lib/types'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

export default function Step5Strategies({ data, onNext, onBack, saving }: Props) {
  const threats = data.threats || []
  const [strategies, setStrategies] = useState<RecoveryStrategy[]>(
    data.strategies?.length ? data.strategies :
    threats.map(t => ({ threat: t.threat, immediateActions: '', shortTermActions: '', resources: '', responsiblePerson: '' }))
  )

  const update = (i: number, k: keyof RecoveryStrategy, v: string) =>
    setStrategies(arr => arr.map((s, j) => j === i ? { ...s, [k]: v } : s))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ strategies })
  }

  if (!threats.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No threats found. Please go back and complete Step 4 first.</p>
        <button type="button" onClick={onBack} className="btn-secondary mt-4">← Back to Threats</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        For each threat, describe what you would do <strong>immediately</strong> (within the first hour) and <strong>short-term</strong> (within the first week) to recover.
      </div>
      {strategies.map((s, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
          <p className="section-title">{s.threat}</p>
          <div className="space-y-3">
            <div>
              <label className="label text-xs">Immediate actions (first hour) *</label>
              <textarea required className="input mt-1" rows={2} value={s.immediateActions} onChange={e => update(i, 'immediateActions', e.target.value)} placeholder="e.g. Isolate affected systems, call IT support, notify senior management" />
            </div>
            <div>
              <label className="label text-xs">Short-term recovery actions (first week) *</label>
              <textarea required className="input mt-1" rows={2} value={s.shortTermActions} onChange={e => update(i, 'shortTermActions', e.target.value)} placeholder="e.g. Restore from backup, engage cyber incident response team, communicate with customers" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Resources needed</label>
                <input className="input mt-1" value={s.resources} onChange={e => update(i, 'resources', e.target.value)} placeholder="e.g. Cyber insurance, backup hardware" />
              </div>
              <div>
                <label className="label text-xs">Lead person responsible *</label>
                <input required className="input mt-1" value={s.responsiblePerson} onChange={e => update(i, 'responsiblePerson', e.target.value)} placeholder="e.g. Jane Smith (MD)" />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: IT & Data →'}</button>
      </div>
    </form>
  )
}
