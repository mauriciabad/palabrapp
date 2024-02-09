import { FC, ReactNode, useCallback, useState } from 'react'
import { supabase } from '../../supabase'
import { Form, redirect, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../../types/loaders'
import { Tables } from '../../../types/supabase'
import { cn } from '../../utils/cn'
import { StepWrite } from './StepWrite'
import { StepSay } from './StepSay'
import { StepDraw } from './StepDraw'
import { StepUse } from './StepUse'
import { StepClasify } from './StepClasify'

const loader = async () => {
  const { data: categories } = await supabase.from('categories').select()
  return { categories }
}

const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData) as unknown as Tables<'entries'>
  const { data } = await supabase
    .from('entries')
    .insert(updates)
    .select('id')
    .single()
  if (!data) throw new Error('No data')
  return redirect(`/palabras/${data.id}`)
}

export const EntryNew: FCForRouter<{
  action: typeof action
  loader: typeof loader
}> = () => {
  const { categories } = useLoaderData() as LoaderData<typeof loader>
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      id: 1,
      icon: '✏️',
      text: 'Escribir',
      nextEnabledByDefault: false,
      content: (
        <StepWrite
          setStepValidity={useCallback((value) => {
            setValidStep(1, value)
          }, [])}
        />
      ),
    },
    {
      id: 2,
      icon: '💬',
      text: 'Decir',
      nextEnabledByDefault: true,
      content: (
        <StepSay
          setStepValidity={useCallback((value) => {
            setValidStep(2, value)
          }, [])}
        />
      ),
    },
    {
      id: 3,
      icon: '🎨',
      text: 'Dibujar',
      nextEnabledByDefault: true,
      content: (
        <StepDraw
          setStepValidity={useCallback((value) => {
            setValidStep(3, value)
          }, [])}
        />
      ),
    },
    {
      id: 4,
      icon: '💡',
      text: 'Usar',
      nextEnabledByDefault: false,
      content: (
        <StepUse
          setStepValidity={useCallback((value) => {
            setValidStep(4, value)
          }, [])}
        />
      ),
    },
    {
      id: 5,
      icon: '🗂️',
      text: 'Clasificar',
      nextEnabledByDefault: false,
      content: (
        <StepClasify
          setStepValidity={useCallback((value) => {
            setValidStep(5, value)
          }, [])}
          categories={categories}
        />
      ),
    },
  ] as const satisfies readonly Step[]

  const [validSteps, setValidSteps] = useState<Record<number, boolean>>(
    Object.fromEntries(
      steps.map((step) => [step.id, !!step.nextEnabledByDefault]),
    ),
  )
  const setValidStep = (step: number, enabled: boolean) => {
    setValidSteps((prev) => ({ ...prev, [step]: enabled }))
  }

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }
  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }
  return (
    <div className="pb-20">
      <div className="-mt-4 mb-4">
        <h1 className="text-center text-xl font-bold">Crear palabra</h1>
        <Process
          value={currentStep}
          steps={steps}
          setCurrentStep={setCurrentStep}
        />
      </div>

      <Form
        method="post"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            if (currentStep === steps.length) return

            e.preventDefault()
            if (validSteps[currentStep]) goToNextStep()
          }
        }}
      >
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(step.id === currentStep ? 'block' : 'hidden')}
          >
            {step.content}
          </div>
        ))}

        <div className="btm-nav">
          {currentStep >= 2 && (
            <button
              type="button"
              onClick={goToPrevStep}
              className="bg-base-300"
            >
              Anterior
            </button>
          )}
          {currentStep === steps.length ? (
            <button
              type="submit"
              className="bg-primary"
              disabled={!validSteps[currentStep]}
            >
              Guardar
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextStep}
              className="bg-primary"
              disabled={
                !validSteps[currentStep] || currentStep === steps.length
              }
            >
              Siguiente
            </button>
          )}
        </div>
      </Form>
    </div>
  )
}

EntryNew.action = action
EntryNew.loader = loader

interface Step {
  id: number
  icon: string
  text: string
  content: ReactNode
  nextEnabledByDefault?: boolean
}

const Process: FC<{
  value: number
  steps: readonly Step[]
  setCurrentStep: (value: number) => void
}> = ({ value, steps, setCurrentStep }) => {
  return (
    <div className="overflow-x-auto">
      <ul className="steps w-full">
        {steps.map((step) => (
          <li
            key={step.id}
            data-content={step.icon}
            className={cn(
              'step',
              step.id <= value && 'step-secondary',
              step.id < value && 'cursor-pointer',
            )}
            onClick={() => {
              if (step.id < value) setCurrentStep(step.id)
            }}
          >
            {step.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
