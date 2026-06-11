'use client'
import { useState } from 'react'
import { BCPData, ThreatAssessment, COMMON_THREATS } from '@/lib/types'
import { getRiskRating, RISK_COLOURS } from '@/lib/utils'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

const empty = (threat = ''): ThreatAssessment => ({ threat, likelihood: 'medium', impact: 'medium', existingControls: '' })

export default function Step4Threats({ data, onNext, onBack, saving }: Props) {
  const [threats, setThreats] = useState<ThreatAssessment[]>(
    data.threats?.length ? data.threats : COMMON_THREATS.slice(0, 5).map(t => empty(t))
  )
  const [custom, setCustom] = useState('')

  const update = (i: number, k: keyof ThreatAssessment, v: string) =>
    setThreats(arr => arr.map((t, j) => j === i ? { ...t, [k]: v } : t))

  const addThreat = (threat: string) => {
    if (!threat.trim()) return
    if (!threats.find(t => t.threat === threat)) setThreats(arr => [...arr, empty(threat)])
    setCustom('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ threats: threats.filter(t => t.threat.trim()) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        For each threat, rate the <strong>likelihood</strong> of it happening and the <strong>impact</strong> it would have on your business. Add any existing controls you already have in place.
      </div>

      {/* Quick-add common threats */}
      <div>
        <p className="label mb-2">Common threats — click to add:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_THREATS.filter(t => !threats.find(x => x.threat === t)).map(t => (
            <button key={t} type="button" onClick={() => addThreat(t)} className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-brand-500 hover:text-brand-700 transition-colors">
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {threats.map((threat, i) => {
          const rating = getRiskRating(threat.likelihood, threat.impact)
          return (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <input required className="input flex-1" value={threat.threat} onChange={e => update(i, 'threat', e.target.value)} placeholder="Threat description" />
                <span className={`${RISK_COLOURS[rating]} flex-shrink-0 mt-1`}>{rating.charAt(0).toUpperCase() + rating.slice(1)} risk</span>
                <button type="button" className="text-xs text-red-500 hover:underline flex-shrink-0 mt-1" onClick={() => setThreats(arr => arr.filter((_, j) => j !== i))}>Remove</button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Likelihood</label>
                  <select className="input mt-1" value={threat.likelihood} onChange={e => update(i, 'likelihood', e.target.value)}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Impact</label>
                  <select className="input mt-1" value={threat.impact} onChange={e => update(i, 'impact', e.target.value)}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="label text-xs">Existing controls</label>
                  <input className="input mt-1" value={threat.existingControls} onChange={e => update(i, 'existingControls', e.target.value)} placeholder="e.g. Antivirus, backups" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <input className="input flex-1" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Add a custom threat…" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addThreat(custom) }}} />
        <button type="button" onClick={() => addThreat(custom)} className="btn-secondary">Add</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Recovery Strategies →'}</button>
      </div>
    </form>
  )
}
