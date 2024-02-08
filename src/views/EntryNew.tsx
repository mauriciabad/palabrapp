import { FC } from 'react'
import { supabase } from '../supabase'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Form, redirect, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'
import { Tables } from '../../types/supabase'
import { cn } from '../utils/cn'

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

  return (
    <div className="pb-20">
      <div className="-mt-4 mb-4">
        <h1 className="text-center text-xl font-bold">Crear palabra</h1>
        <Process value={0} />
      </div>

      <Form method="post">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">
              Palabra<span className="text-red-500">*</span>
            </span>
          </div>
          <input
            type="text"
            name="word"
            required
            placeholder="Escribe aquí"
            className="input input-bordered w-full bg-white"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">
              Frase<span className="text-red-500">*</span>
            </span>
          </div>
          <textarea
            name="sentence"
            required
            placeholder="Escribe aquí"
            className="textarea textarea-bordered w-full bg-white"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">
              Categoria<span className="text-red-500">*</span>
            </span>
          </div>
          <select
            className="select select-bordered w-full bg-white"
            name="category_id"
            required
            defaultValue=""
          >
            <option disabled value="">
              Selecciona una categoría
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Notas</span>
          </div>
          <textarea
            name="notes"
            placeholder="Escribe aquí"
            className="textarea textarea-bordered w-full bg-white"
          />
        </label>
        <SaveButton />
      </Form>
    </div>
  )
}

EntryNew.action = action
EntryNew.loader = loader

const SaveButton: FC = () => {
  return (
    <button
      type="submit"
      className="btn btn-primary btn-lg fixed bottom-4 left-4 z-10 shadow-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <IconDeviceFloppy />
      </svg>
      Guardar
    </button>
  )
}

const steps = [
  {
    id: 1,
    icon: '✏️',
    text: 'Escribir',
  },
  {
    id: 2,
    icon: '💬',
    text: 'Decir',
  },
  {
    id: 3,
    icon: '🎨',
    text: 'Dibujar',
  },
  {
    id: 4,
    icon: '💡',
    text: 'Usar',
  },
  {
    id: 5,
    icon: '🗂️',
    text: 'Clasificar',
  },
] as const satisfies { id: number; icon: string; text: string }[]

const Process: FC<{
  value: number
}> = ({ value }) => {
  return (
    <div className="overflow-x-auto">
      <ul className="steps w-full">
        {steps.map((step) => (
          <li
            key={step.id}
            data-content={step.icon}
            className={cn('step', step.id <= value + 1 && 'step-secondary')}
          >
            {step.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
