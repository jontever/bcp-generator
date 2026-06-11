'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BCPRecord } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function BCPViewPage() {
  const params = useParams()
  const id = params.id as string

  const [bcp, setBcp] = useState<BCPRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetch(`/api/bcp/${id}`)
      .then(r => r.json())
      .then(data => { setBcp(data); setLoading(false) })
      .catch(() => { setError('Could not load your BCP.'); setLoading(false) })
  }, [id])

  async function downloadWord() {
    if (!bcp?.generatedContent) return
    setDownloading(true)
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bcpId: id }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `BCP-${bcp.data?.company?.name || 'document'}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gov-blue border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Loading your Business Continuity Plan...</p>
        </div>
      </div>
    )
  }

  if (error || !bcp) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-red-600">{error || 'Plan not found.'}</p>
        <a href="/" className="mt-4 inline-block text-brand-600 underline">Back to home</a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Business Continuity Plan
          </h1>
          <p className="text-gray-500 mt-1">
            {bcp.data?.company?.name} · Generated {formatDate(bcp.updatedAt)}
          </p>
        </div>
        <div className="flex gap-3">
          <a href={`/wizard/${id}/1`} className="btn-secondary text-sm">
            Edit plan
          </a>
          <button onClick={downloadWord} disabled={downloading || !bcp.generatedContent} className="btn-primary text-sm">
            {downloading ? 'Downloading…' : 'Download .docx'}
          </button>
        </div>
      </div>

      {/* Share link */}
      <div className="mb-8 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        <strong>Save this link</strong> to return to your plan at any time:
        <div className="mt-1 font-mono text-xs text-blue-600 break-all">
          {typeof window !== 'undefined' ? `${window.location.origin}/bcp/${id}` : `/bcp/${id}`}
        </div>
      </div>

      {/* Generated content */}
      {bcp.status === 'generating' && (
        <div className="card text-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gov-blue border-t-transparent mx-auto mb-4" />
          <p className="font-medium text-gray-900">Generating your Business Continuity Plan…</p>
          <p className="text-sm text-gray-500 mt-2">This usually takes 30–60 seconds. You can leave this page — the plan will be ready when you return.</p>
        </div>
      )}

      {bcp.status === 'complete' && bcp.generatedContent && (
        <div className="card">
          <div
            className="prose prose-sm sm:prose max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2"
            dangerouslySetInnerHTML={{
              __html: bcp.generatedContent
                .split('\n')
                .map(line => {
                  if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
                  if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
                  if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
                  if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
                  if (line.trim() === '') return '<br/>'
                  return `<p>${line}</p>`
                })
                .join('')
            }}
          />
        </div>
      )}

      {bcp.status === 'draft' && (
        <div className="card text-center py-12">
          <p className="font-medium text-gray-900 mb-4">Your plan has not been generated yet.</p>
          <a href={`/wizard/${id}/9`} className="btn-primary">Generate BCP now</a>
        </div>
      )}
    </div>
  )
}
