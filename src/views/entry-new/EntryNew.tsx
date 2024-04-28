import { FC, ReactNode, useCallback, useRef, useState } from 'react'
import { Form, redirect, useLoaderData } from 'react-router-dom'
import { DrawingInputRef } from '../../components/DrawingInput'
import { supabase } from '../../supabase'
import { FCForRouter, LoaderData } from '../../types/loaders'
import { cn } from '../../utils/cn'
import { getFileExtension } from '../../utils/storage'
import { StepClasify } from './StepClasify'
import { StepDraw } from './StepDraw'
import { StepSay } from './StepSay'
import { StepUse } from './StepUse'
import { StepWrite } from './StepWrite'

const loader = async () => {
  const { data: categories } = await supabase.from('categories').select()
  return { categories }
}

const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  const userId = user.id

  const { data: entryData, error: entryError } = await supabase
    .from('entries')
    .insert({
      word: String(updates.word),
      sentence: String(updates.sentence),
      related_entries: String(updates.related_entries) || null,
      notes: String(updates.notes) || null,
      category_id: Number(updates.category_id),
    })
    .select('id')
    .single()
  if (entryError) throw new Error(entryError.message)
  const entryId = entryData.id

  // --- Drawing ---

  const drawingPhotoFile =
    updates.drawingPhoto &&
    updates.drawingPhoto instanceof File &&
    updates.drawingPhoto.size > 0
      ? updates.drawingPhoto
      : null
  const drawingSvgFile = String(updates.drawingSvg)
    ? new File([String(updates.drawingSvg)], `drawing-${entryId}.svg`, {
        type: 'image/svg+xml',
      })
    : null
  const drawingUploadFile = drawingSvgFile ?? drawingPhotoFile
  if (drawingUploadFile) {
    const fileExtension = getFileExtension(drawingUploadFile.name)
    const { data: drawingData, error: drawingError } = await supabase.storage
      .from('main')
      .upload(
        `private/${userId}/drawing-${entryId}.${fileExtension}`,
        drawingUploadFile,
        { upsert: true },
      )
    if (drawingError) throw new Error(drawingError.message)
    const { data: uploadedDrawing } = supabase.storage
      .from('main')
      .getPublicUrl(drawingData.path)

    await supabase
      .from('entries')
      .update({ drawing: uploadedDrawing.publicUrl })
      .eq('id', entryId)
  }

  // --- Pronunciation ---

  const pronunciationFile = updates.pronunciation
  if (
    pronunciationFile &&
    pronunciationFile instanceof File &&
    pronunciationFile.size > 0
  ) {
    const fileExtension = getFileExtension(pronunciationFile.name)
    const { data: pronunciationData, error: pronunciationError } =
      await supabase.storage
        .from('main')
        .upload(
          `private/${userId}/pronunciation-${entryId}.${fileExtension}`,
          pronunciationFile,
          {
            upsert: true,
          },
        )
    if (pronunciationError) throw new Error(pronunciationError.message)
    const { data: uploadedPronunciation } = supabase.storage
      .from('main')
      .getPublicUrl(pronunciationData.path)

    await supabase
      .from('entries')
      .update({ pronunciation: uploadedPronunciation.publicUrl })
      .eq('id', entryId)
  }

  return redirect(`/palabras`)
}

export const EntryNew: FCForRouter<{
  action: typeof action
  loader: typeof loader
}> = () => {
  const { categories } = useLoaderData() as LoaderData<typeof loader>
  const [currentStep, setCurrentStep] = useState(1)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const drawStepRef = useRef<DrawingInputRef>(null)

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
          ref={drawStepRef}
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
    if (currentStep === 3) {
      void drawStepRef.current?.setInputValue()
    }
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
          onChange={(step) => {
            if (
              Object.entries(validSteps)
                .filter(([s]) => Number(s) > currentStep && Number(s) < step)
                .every(([, isValid]) => isValid)
            )
              setCurrentStep(step)
          }}
        />
      </div>

      <Form
        method="post"
        encType="multipart/form-data"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            if (currentStep === steps.length) return

            e.preventDefault()
            if (validSteps[currentStep]) goToNextStep()
          }
        }}
        onSubmit={() => {
          setFormSubmitted(true)
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
              disabled={!validSteps[currentStep] || formSubmitted}
            >
              {formSubmitted ? 'Guardando...' : 'Guardar'}
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
  onChange: (value: number) => void
}> = ({ value, steps, onChange }) => {
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
              onChange(step.id)
            }}
          >
            {step.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
