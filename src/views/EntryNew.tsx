import { FC } from 'react'
import { supabase } from '../supabase'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Form, redirect } from 'react-router-dom'
import { FCForRouter } from '../types/loaders'
import { Tables } from '../../types/supabase'

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
}> = () => {
  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Crear palabra</h1>

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
