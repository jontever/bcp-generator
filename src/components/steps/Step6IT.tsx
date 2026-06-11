'use client'
import { useState } from 'react'
import { BCPData, ITRecovery } from '@/lib/types'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

export default function Step6IT({ data, onNext, onBack, saving }: Props) {
  const [form, setForm] = useState<Partial<ITRecovery>>(data.itRecovery || {})
  const [systemsInput, setSystemsInput] = useState((data.itRecovery?.criticalSystems || []).join(', '))
  const [cloudInput, setCloudInput] = useState((data.itRecovery?.cloudServices || []).join(', '))

  const u = (k: keyof ITRecovery, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({
      itRecovery: {
        ...form,
        criticalSystems: systemsInput.split(',').map(s => s.trim()).filter(Boolean),
        cloudServices: cloudInput.split(',').map(s => s.trim()).filter(Boolean),
      } as ITRecovery
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Critical IT systems *</label>
        <input className="input mt-1" value={systemsInput} onChange={e => setSystemsInput(e.target.value)} placeholder="e.g. Sage accounts, Shopify, CRM, email server" />
        <p className="mt-1 text-xs text-gray-400">Separate with commas</p>
      </div>
      <div>
        <label className="label">Cloud / SaaS services used</label>
        <input className="input mt-1" value={cloudInput} onChange={e => setCloudInput(e.target.value)} placeholder="e.g. Microsoft 365, Xero, Dropbox, Zoom" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Backup solution *</label>
          <input required className="input mt-1" value={form.backupSolution || ''} onChange={e => u('backupSolution', e.target.value)} placeholder="e.g. Veeam, AWS S3, external hard drives" />
        </div>
        <div>
          <label className="label">Backup frequency *</label>
          <select required className="input mt-1" value={form.backupFrequency || ''} onChange={e => u('backupFrequency', e.target.value)}>
            <option value="">Select…</option>
            {['Real-time', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'No backups currently'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Backup storage location</label>
          <input className="input mt-1" value={form.backupLocation || ''} onChange={e => u('backupLocation', e.target.value)} placeholder="e.g. Offsite cloud, secure external drive" />
        </div>
        <div>
          <label className="label">IT recovery time objective *</label>
          <select required className="input mt-1" value={form.recoveryTimeObjective || ''} onChange={e => u('recoveryTimeObjective', e.target.value)}>
            <option value="">Select…</option>
            {['1 hour', '4 hours', '8 hours', '24 hours', '48 hours', '72 hours', '1 week'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">IT support / recovery contact *</label>
          <input required className="input mt-1" value={form.dataRecoveryContact || ''} onChange={e => u('dataRecoveryContact', e.target.value)} placeholder="e.g. IT support provider name and number" />
        </div>
        <div>
          <label className="label">Alternative work location</label>
          <input className="input mt-1" value={form.alternativeWorkLocation || ''} onChange={e => u('alternativeWorkLocation', e.target.value)} placeholder="e.g. Staff work from home, hot-desk at partner office" />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Communications →'}</button>
      </div>
    </form>
  )
}
