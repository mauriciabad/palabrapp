import { FC, ReactNode, useState } from 'react'
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
      content: <StepWrite />,
    },
    {
      id: 2,
      icon: '💬',
      text: 'Decir',
      content: <StepSay />,
    },
    {
      id: 3,
      icon: '🎨',
      text: 'Dibujar',
      content: <StepDraw />,
    },
    {
      id: 4,
      icon: '💡',
      text: 'Usar',
      content: <StepUse />,
    },
    {
      id: 5,
      icon: '🗂️',
      text: 'Clasificar',
      content: <StepClasify categories={categories} />,
    },
  ] as const satisfies Step[]

  return (
    <div className="pb-20">
      <div className="-mt-4 mb-4">
        <h1 className="text-center text-xl font-bold">Crear palabra</h1>
        <Process value={currentStep} steps={steps} />
      </div>

      <Form method="post">
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
              onClick={() => {
                setCurrentStep((prev) => Math.max(prev - 1, 1))
              }}
              className="bg-base-300"
            >
              Anterior
            </button>
          )}
          {currentStep === steps.length ? (
            <button type="submit" className="bg-primary">
              Guardar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length))
              }}
              className="bg-primary"
              disabled={currentStep === steps.length}
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
}

const Process: FC<{
  value: number
  steps: readonly Step[]
}> = ({ value, steps }) => {
  return (
    <div className="overflow-x-auto">
      <ul className="steps w-full">
        {steps.map((step) => (
          <li
            key={step.id}
            data-content={step.icon}
            className={cn('step', step.id <= value && 'step-secondary')}
          >
            {step.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
