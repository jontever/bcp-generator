'use client'
import { useState } from 'react'
import { BCPData, MaintenancePlan } from '@/lib/types'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

export default function Step8Maintenance({ data, onNext, onBack, saving }: Props) {
  const [form, setForm] = useState<Partial<MaintenancePlan>>(data.maintenance || {})
  const u = (k: keyof MaintenancePlan, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ maintenance: form as MaintenancePlan })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-sm text-green-800">
        A BCP is only effective if it is <strong>tested and kept up to date</strong>. NCSC recommends reviewing after any significant business change and testing at least annually.
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">How often will you review the BCP? *</label>
          <select required className="input mt-1" value={form.reviewFrequency || ''} onChange={e => u('reviewFrequency', e.target.value)}>
            <option value="">Select…</option>
            {['Monthly', 'Quarterly', 'Every 6 months', 'Annually', 'After any major change'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">How often will you test the BCP? *</label>
          <select required className="input mt-1" value={form.testFrequency || ''} onChange={e => u('testFrequency', e.target.value)}>
            <option value="">Select…</option>
            {['Every 6 months', 'Annually', 'Every 2 years'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Type of test *</label>
          <select required className="input mt-1" value={form.testType || ''} onChange={e => u('testType', e.target.value)}>
            <option value="">Select…</option>
            <option value="Tabletop exercise (discussion-based)">Tabletop exercise (discussion-based)</option>
            <option value="Walkthrough (step-by-step review)">Walkthrough (step-by-step review)</option>
            <option value="Simulation exercise">Simulation exercise</option>
            <option value="Full live test">Full live test</option>
          </select>
        </div>
        <div>
          <label className="label">How often will staff be trained? *</label>
          <select required className="input mt-1" value={form.trainingFrequency || ''} onChange={e => u('trainingFrequency', e.target.value)}>
            <option value="">Select…</option>
            {['On induction only', 'Annually', 'Every 6 months', 'After each test exercise'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Who is responsible for sign-off on the BCP?</label>
          <input className="input mt-1" value={form.bcpOwnerReviewSignoff || ''} onChange={e => u('bcpOwnerReviewSignoff', e.target.value)} placeholder="e.g. Managing Director, signed off at Board level annually" />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Generate BCP →'}</button>
      </div>
    </form>
  )
}
