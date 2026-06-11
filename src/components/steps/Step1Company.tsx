'use client'
import { useState } from 'react'
import { BCPData, CompanyProfile, UK_SECTORS } from '@/lib/types'

interface Props {
  data: Partial<BCPData>
  onNext: (data: Partial<BCPData>) => void
  onBack?: () => void
  saving: boolean
  bcpId: string
}

export default function Step1Company({ data, onNext, saving }: Props) {
  const [form, setForm] = useState<Partial<CompanyProfile>>(data.company || {})

  const update = (k: keyof CompanyProfile, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ company: form as CompanyProfile })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Business name <span className="text-red-500">*</span></label>
          <input required className="input mt-1" value={form.name || ''} onChange={e => update('name', e.target.value)} placeholder="Acme Ltd" />
        </div>
        <div>
          <label className="label">Companies House number</label>
          <input className="input mt-1" value={form.registrationNumber || ''} onChange={e => update('registrationNumber', e.target.value)} placeholder="12345678" />
        </div>
        <div>
          <label className="label">Sector <span className="text-red-500">*</span></label>
          <select required className="input mt-1" value={form.sector || ''} onChange={e => update('sector', e.target.value)}>
            <option value="">Select sector…</option>
            {UK_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Business size <span className="text-red-500">*</span></label>
          <select required className="input mt-1" value={form.sizeCategory || ''} onChange={e => update('sizeCategory', e.target.value as CompanyProfile['sizeCategory'])}>
            <option value="">Select size…</option>
            <option value="micro">Micro (1–9 employees)</option>
            <option value="small">Small (10–49 employees)</option>
            <option value="medium">Medium (50–249 employees)</option>
          </select>
        </div>
        <div>
          <label className="label">Number of employees <span className="text-red-500">*</span></label>
          <input required type="number" min={1} className="input mt-1" value={form.employeeCount || ''} onChange={e => update('employeeCount', parseInt(e.target.value))} placeholder="12" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Business address <span className="text-red-500">*</span></label>
          <input required className="input mt-1" value={form.address || ''} onChange={e => update('address', e.target.value)} placeholder="123 High Street, Birmingham" />
        </div>
        <div>
          <label className="label">Postcode <span className="text-red-500">*</span></label>
          <input required className="input mt-1" value={form.postcode || ''} onChange={e => update('postcode', e.target.value)} placeholder="B1 1AA" />
        </div>
        <div>
          <label className="label">Website</label>
          <input type="url" className="input mt-1" value={form.website || ''} onChange={e => update('website', e.target.value)} placeholder="https://acme.co.uk" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Brief description of what the business does</label>
          <textarea className="input mt-1" rows={3} value={form.description || ''} onChange={e => update('description', e.target.value)} placeholder="e.g. We provide accountancy services to small businesses in the West Midlands…" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Next: Key People →'}
        </button>
      </div>
    </form>
  )
}
