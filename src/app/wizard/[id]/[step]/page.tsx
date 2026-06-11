'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import WizardProgress from '@/components/WizardProgress'
import Step1Company from '@/components/steps/Step1Company'
import Step2People from '@/components/steps/Step2People'
import Step3Functions from '@/components/steps/Step3Functions'
import Step4Threats from '@/components/steps/Step4Threats'
import Step5Strategies from '@/components/steps/Step5Strategies'
import Step6IT from '@/components/steps/Step6IT'
import Step7Communications from '@/components/steps/Step7Communications'
import Step8Maintenance from '@/components/steps/Step8Maintenance'
import Step9Generate from '@/components/steps/Step9Generate'
import { BCPData, WIZARD_STEPS } from '@/lib/types'

const STEP_COMPONENTS = [
  Step1Company, Step2People, Step3Functions, Step4Threats,
  Step5Strategies, Step6IT, Step7Communications, Step8Maintenance, Step9Generate,
]

export default function WizardStepPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const stepNum = parseInt(params.step as string, 10)

  const [data, setData] = useState<Partial<BCPData>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/bcp/${id}`)
      .then(r => r.json())
      .then(bcp => {
        setData(bcp.data || {})
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load your BCP. Please check the link and try again.')
        setLoading(false)
      })
  }, [id])

  const saveAndNavigate = useCallback(
    async (stepData: Partial<BCPData>, nextStep: number) => {
      setSaving(true)
      const merged = { ...data, ...stepData }
      try {
        await fetch(`/api/bcp/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: merged, currentStep: nextStep }),
        })
        setData(merged)
        if (nextStep > WIZARD_STEPS.length) {
          router.push(`/bcp/${id}`)
        } else {
          router.push(`/wizard/${id}/${nextStep}`)
        }
      } catch {
        setError('Failed to save. Please try again.')
      } finally {
        setSaving(false)
      }
    },
    [id, data, router]
  )

  const goBack = useCallback(() => {
    if (stepNum > 1) router.push(`/wizard/${id}/${stepNum - 1}`)
  }, [id, stepNum, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gov-blue border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Loading your plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <a href="/" className="mt-4 inline-block text-brand-600 underline">Back to home</a>
      </div>
    )
  }

  if (stepNum < 1 || stepNum > WIZARD_STEPS.length) {
    router.push(`/wizard/${id}/1`)
    return null
  }

  const StepComponent = STEP_COMPONENTS[stepNum - 1]
  const step = WIZARD_STEPS[stepNum - 1]

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <WizardProgress currentStep={stepNum} bcpId={id} />
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{step.title}</h1>
        <p className="text-gray-500 mt-1">{step.description}</p>
      </div>
      <div className="card">
        <StepComponent
          data={data}
          onNext={(stepData) => saveAndNavigate(stepData, stepNum + 1)}
          onBack={stepNum > 1 ? goBack : undefined}
          saving={saving}
          bcpId={id}
        />
      </div>
      <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
        <strong>Your plan is saved automatically.</strong> Bookmark this page to return anytime.
      </div>
    </div>
  )
}
