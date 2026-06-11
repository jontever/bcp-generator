'use client'
import { useState } from 'react'
import { BCPData, CriticalFunction } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

const empty = (): CriticalFunction => ({ id: uuidv4(), name: '', description: '', priority: 'essential', rto: '', rpo: '', dependencies: [], staffRequired: 1 })

const PRIORITY_LABELS: Record<string, string> = { critical: 'Critical (must resume within hours)', essential: 'Essential (must resume within 1–3 days)', important: 'Important (can wait up to a week)' }
const RTO_OPTIONS = ['1 hour', '4 hours', '8 hours', '24 hours', '48 hours', '72 hours', '1 week', '2 weeks']

export default function Step3Functions({ data, onNext, onBack, saving }: Props) {
  const [functions, setFunctions] = useState<CriticalFunction[]>(data.functions?.length ? data.functions : [empty()])

  const update = (i: number, k: keyof CriticalFunction, v: unknown) =>
    setFunctions(arr => arr.map((f, j) => j === i ? { ...f, [k]: v } : f))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ functions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        List the functions or activities that your business <strong>must continue</strong> during a disruption. Think about what would cause the most damage if it stopped — revenue, legal obligations, customer commitments.
      </div>
      <div className="space-y-4">
        {functions.map((fn, i) => (
          <div key={fn.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <p className="section-title">Function {i + 1}</p>
              {functions.length > 1 && <button type="button" className="text-xs text-red-500 hover:underline" onClick={() => setFunctions(arr => arr.filter((_, j) => j !== i))}>Remove</button>}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><label className="label text-xs">Function name *</label><input required className="input mt-1" value={fn.name} onChange={e => update(i, 'name', e.target.value)} placeholder="e.g. Processing customer orders" /></div>
              <div className="sm:col-span-2"><label className="label text-xs">Description</label><textarea className="input mt-1" rows={2} value={fn.description} onChange={e => update(i, 'description', e.target.value)} placeholder="What does this function involve and why is it critical?" /></div>
              <div>
                <label className="label text-xs">Priority *</label>
                <select required className="input mt-1" value={fn.priority} onChange={e => update(i, 'priority', e.target.value)}>
                  {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div><label className="label text-xs">Minimum staff needed</label><input type="number" min={0} className="input mt-1" value={fn.staffRequired} onChange={e => update(i, 'staffRequired', parseInt(e.target.value))} /></div>
              <div>
                <label className="label text-xs">Recovery Time Objective (RTO) *<span className="font-normal text-gray-400"> — max downtime</span></label>
                <select required className="input mt-1" value={fn.rto} onChange={e => update(i, 'rto', e.target.value)}>
                  <option value="">Select RTO…</option>
                  {RTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs">Recovery Point Objective (RPO) *<span className="font-normal text-gray-400"> — max data loss</span></label>
                <select required className="input mt-1" value={fn.rpo} onChange={e => update(i, 'rpo', e.target.value)}>
                  <option value="">Select RPO…</option>
                  {RTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2"><label className="label text-xs">Key dependencies (systems, suppliers, staff)</label><input className="input mt-1" value={fn.dependencies.join(', ')} onChange={e => update(i, 'dependencies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="e.g. CRM system, broadband, accounts team" /></div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors" onClick={() => setFunctions(arr => [...arr, empty()])}>
        + Add another critical function
      </button>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Threat Assessment →'}</button>
      </div>
    </form>
  )
}
