'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const features = [
  {
    icon: '🧭',
    title: '9-step guided wizard',
    desc: 'Step-by-step questions covering every area of business continuity — no prior experience needed.',
  },
  {
    icon: '🤖',
    title: 'AI-generated narrative',
    desc: 'Claude writes a professional, tailored BCP document from your answers — ready to adopt or adapt.',
  },
  {
    icon: '📄',
    title: 'Download as Word document',
    desc: 'Export your completed plan as a .docx file to share, store or update whenever you need.',
  },
  {
    icon: '🔒',
    title: 'Private by design',
    desc: 'Your plan is stored privately and accessed via a unique link — no account or password required.',
  },
  {
    icon: '🇬🇧',
    title: 'UK-specific guidance',
    desc: 'Aligned to Cabinet Office, NCSC and BSI BS 65000 best practice for UK businesses.',
  },
  {
    icon: '🆓',
    title: 'Free and open source',
    desc: 'No fees, no subscriptions. The code is on GitHub so you can self-host or contribute.',
  },
]

const threats = [
  'Cyber attack', 'Key staff loss', 'IT failure', 'Supply chain disruption',
  'Premises unavailable', 'Severe weather', 'Power outage', 'Pandemic',
]

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function startBCP() {
    setLoading(true)
    try {
      const res = await fetch('/api/bcp', { method: 'POST' })
      const { id, accessToken } = await res.json()
      // Store access token in sessionStorage so the user can return
      sessionStorage.setItem(`bcp_token_${id}`, accessToken)
      router.push(`/wizard/${id}/1`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gov-blue py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-gov-yellow"></span>
            Free for UK SMBs
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Create your Business<br />Continuity Plan in minutes
          </h1>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Answer a few guided questions about your business. Our AI generates a
            professional, UK-compliant BCP document — tailored to your risks and ready to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startBCP}
              disabled={loading}
              className="rounded-lg bg-gov-yellow px-8 py-3.5 text-base font-bold text-gov-blue hover:bg-yellow-300 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating your plan…' : 'Start my BCP — it\'s free'}
            </button>
            <a
              href="https://www.gov.uk/guidance/resilience-in-society-infrastructure-communities-and-businesses"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Gov.uk BCP Toolkit
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-300">
            Takes about 20–30 minutes. Save and return anytime via your unique link.
          </p>
        </div>
      </section>

      {/* Threat chips */}
      <section className="bg-gray-100 py-6 border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm text-gray-500 mb-3 font-medium">Covers threats including:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {threats.map(t => (
              <span key={t} className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need in one place</h2>
            <p className="mt-3 text-gray-500 text-lg">No consultants. No PDFs to fill in by hand. Just a smart, guided process.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NCSC callout */}
      <section className="bg-blue-50 border-y border-blue-100 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0 text-4xl">🛡️</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Aligned to UK guidance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This tool aligns with the <strong>Cabinet Office Business Continuity Management Toolkit</strong>,{' '}
                <strong>NCSC guidance for small organisations</strong>, and{' '}
                <strong>BSI BS 65000:2022</strong> (Guidance on Organizational Resilience).
                The generated plan follows the structure recommended by the UK government for SMBs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to protect your business?</h2>
          <p className="text-gray-500 mb-8">Most businesses don't have a BCP. In 20 minutes, yours will.</p>
          <button
            onClick={startBCP}
            disabled={loading}
            className="rounded-lg bg-gov-blue px-8 py-3.5 text-base font-bold text-white hover:bg-blue-900 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating your plan…' : 'Start my Business Continuity Plan'}
          </button>
        </div>
      </section>
    </div>
  )
}
