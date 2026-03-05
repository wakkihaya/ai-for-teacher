import { cn } from '@/lib/utils'

const STEPS = [
  { number: 1, label: 'Lesson Plan' },
  { number: 2, label: 'Vocabulary' },
  { number: 3, label: 'Lesson Note' },
]

export function WizardProgress({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                step.number < currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : step.number === currentStep
                  ? 'border-primary text-primary bg-background'
                  : 'border-muted text-muted-foreground bg-background'
              )}
            >
              {step.number < currentStep ? '✓' : step.number}
            </div>
            <span
              className={cn(
                'text-xs font-medium whitespace-nowrap',
                step.number === currentStep ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 mx-2 mb-4 transition-colors',
                step.number < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
