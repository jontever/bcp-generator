'use client'

import { WIZARD_STEPS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number
  bcpId: string
}

export default function WizardProgress({ currentStep, bcpId }: WizardProgressProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <nav className="flex min-w-max gap-1 px-4 sm:px-0">
        {WIZARD_STEPS.map((step) => {
          const state =
            step.id < currentStep ? 'complete' :
            step.id === currentStep ? 'current' : 'upcoming'

          return (
            <div key={step.id} className="flex items-center gap-1">
              {step.id > 1 && (
                <div className={cn(
                  'h-0.5 w-6 flex-shrink-0',
                  state === 'upcoming' ? 'bg-gray-200' : 'bg-brand-600'
                )} />
              )}
              <a
                href={state !== 'upcoming' ? `/wizard/${bcpId}/${step.id}` : undefined}
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  state === 'complete' && 'bg-brand-600 text-white hover:bg-brand-700',
                  state === 'current' && 'bg-gov-blue text-white ring-4 ring-blue-100',
                  state === 'upcoming' && 'bg-gray-200 text-gray-500 cursor-default',
                )}
                title={step.title}
              >
                {state === 'complete' ? '✓' : step.id}
              </a>
            </div>
          )
        })}
      </nav>
      <p className="mt-3 px-4 sm:px-0 text-sm text-gray-500">
        Step {currentStep} of {WIZARD_STEPS.length} —{' '}
        <span className="font-medium text-gray-900">
          {WIZARD_STEPS.find(s => s.id === currentStep)?.title}
        </span>
      </p>
    </div>
  )
}
