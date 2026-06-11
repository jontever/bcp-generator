'use client'
import { useState } from 'react'
import { BCPData, KeyPeople, Contact } from '@/lib/types'

interface Props { data: Partial<BCPData>; onNext: (d: Partial<BCPData>) => void; onBack?: () => void; saving: boolean; bcpId: string }

const emptyContact = (): Contact => ({ name: '', role: '', phone: '', email: '', mobilePhone: '' })

function ContactFields({ label, value, onChange }: { label: string; value: Contact; onChange: (c: Contact) => void }) {
  const u = (k: keyof Contact, v: string) => onChange({ ...value, [k]: v })
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <p className="section-title">{label}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="label text-xs">Full name *</label><input required className="input mt-1" value={value.name} onChange={e => u('name', e.target.value)} /></div>
        <div><label className="label text-xs">Job title / role *</label><input required className="input mt-1" value={value.role} onChange={e => u('role', e.target.value)} /></div>
        <div><label className="label text-xs">Phone *</label><input required className="input mt-1" value={value.phone} onChange={e => u('phone', e.target.value)} /></div>
        <div><label className="label text-xs">Mobile</label><input className="input mt-1" value={value.mobilePhone || ''} onChange={e => u('mobilePhone', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="label text-xs">Email *</label><input required type="email" className="input mt-1" value={value.email} onChange={e => u('email', e.target.value)} /></div>
      </div>
    </div>
  )
}

export default function Step2People({ data, onNext, onBack, saving }: Props) {
  const init = data.people || { bcpOwner: emptyContact(), deputies: [emptyContact()], emergencyContacts: [emptyContact()] }
  const [owner, setOwner] = useState<Contact>(init.bcpOwner)
  const [deputies, setDeputies] = useState<Contact[]>(init.deputies.length ? init.deputies : [emptyContact()])
  const [emergency, setEmergency] = useState<Contact[]>(init.emergencyContacts.length ? init.emergencyContacts : [emptyContact()])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ people: { bcpOwner: owner, deputies, emergencyContacts: emergency } as KeyPeople })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContactFields label="BCP Owner (primary responsible person)" value={owner} onChange={setOwner} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Deputies</p>
          <button type="button" className="text-sm text-brand-600 hover:underline" onClick={() => setDeputies(d => [...d, emptyContact()])}>+ Add deputy</button>
        </div>
        <div className="space-y-3">
          {deputies.map((d, i) => (
            <div key={i} className="relative">
              <ContactFields label={`Deputy ${i + 1}`} value={d} onChange={v => setDeputies(arr => arr.map((x, j) => j === i ? v : x))} />
              {deputies.length > 1 && <button type="button" className="absolute top-3 right-3 text-xs text-red-500 hover:underline" onClick={() => setDeputies(arr => arr.filter((_, j) => j !== i))}>Remove</button>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Emergency contacts (e.g. IT support, landlord, insurer)</p>
          <button type="button" className="text-sm text-brand-600 hover:underline" onClick={() => setEmergency(e => [...e, emptyContact()])}>+ Add contact</button>
        </div>
        <div className="space-y-3">
          {emergency.map((c, i) => (
            <div key={i} className="relative">
              <ContactFields label={`Emergency contact ${i + 1}`} value={c} onChange={v => setEmergency(arr => arr.map((x, j) => j === i ? v : x))} />
              {emergency.length > 1 && <button type="button" className="absolute top-3 right-3 text-xs text-red-500 hover:underline" onClick={() => setEmergency(arr => arr.filter((_, j) => j !== i))}>Remove</button>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Next: Critical Functions →'}</button>
      </div>
    </form>
  )
}
