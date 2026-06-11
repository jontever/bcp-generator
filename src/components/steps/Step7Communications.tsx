'use client'
import { useState } from 'react'
import { BCPData, CommunicationsPlan } from '@/lib/types'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

const fields: { key: keyof CommunicationsPlan; label: string; placeholder: string; hint?: string }[] = [
  { key: 'staffNotificationMethod', label: 'How will you notify staff? *', placeholder: 'e.g. WhatsApp group, call tree starting with deputies, email all-staff', hint: 'Include the order of escalation if primary method fails.' },
  { key: 'customerNotificationMethod', label: 'How will you notify customers? *', placeholder: 'e.g. Email via Mailchimp, website banner, direct account manager calls for key clients' },
  { key: 'supplierNotificationMethod', label: 'How will you notify key suppliers?', placeholder: 'e.g. Account manager direct call, email to procurement contacts' },
  { key: 'mediaPolicy', label: 'Media / social media policy', placeholder: 'e.g. All media enquiries directed to MD only. No staff to comment publicly. Social media paused during incident.' },
  { key: 'regulatoryNotifications', label: 'Regulatory / statutory notifications', placeholder: 'e.g. ICO notification within 72 hours for data breaches. FCA notification if applicable. Notify insurer immediately.' },
  { key: 'internalEscalationPath', label: 'Internal escalation path *', placeholder: 'e.g. Incident reported to BCP owner → deputies activated → Board notified if major incident' },
]

export default function Step7Communications({ data, onNext, onBack, saving }: Props) {
  const [form, setForm] = useState<Partial<CommunicationsPlan>>(data.communications || {})
  const u = (k: keyof CommunicationsPlan, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ communications: form as CommunicationsPlan })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
        Good communications during an incident protect your reputation and legal standing. For data breaches, the ICO must be notified within <strong>72 hours</strong>.
      </div>
      {fields.map(({ key, label, placeholder, hint }) => (
        <div key={key}>
          <label className="label">{label}</label>
          <textarea className="input mt-1" rows={2} value={(form[key] as string) || ''} onChange={e => u(key, e.target.value)} placeholder={placeholder} required={label.endsWith('*')} />
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
      ))}
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Maintenance & Testing →'}</button>
      </div>
    </form>
  )
}
