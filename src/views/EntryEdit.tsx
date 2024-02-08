import { FC } from 'react'
import { supabase } from '../supabase'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Form, Params, redirect, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'

const loader = async ({ params }: { params: Params<'id'> }) => {
  if (!params.id) return { entry: undefined }
  const { data: entry } = await supabase
    .from('entries')
    .select()
    .eq('id', params.id)
    .single()
  const { data: categories } = await supabase.from('categories').select()
  return { entry, categories }
}

const action = async ({
  request,
  params,
}: {
  request: Request
  params: Params<'id'>
}) => {
  if (!params.id) throw new Error('No id')
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  await supabase.from('entries').update(updates).eq('id', params.id)
  return redirect(`/palabras/${params.id}`)
}

export const EntryEdit: FCForRouter<{
  action: typeof action
  loader: typeof loader
}> = () => {
  const { entry, categories } = useLoaderData() as LoaderData<typeof loader>

  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Editar palabra</h1>

      {entry ? (
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
              defaultValue={entry.word}
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
              defaultValue={entry.sentence}
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
              defaultValue={entry.category_id}
              name="category_id"
              required
            >
              {categories ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))
              ) : (
                <option disabled value={entry.category_id}>
                  Categoria actual
                </option>
              )}
            </select>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Notas</span>
            </div>
            <textarea
              name="notes"
              defaultValue={entry.notes ?? ''}
              placeholder="Escribe aquí"
              className="textarea textarea-bordered w-full bg-white"
            />
          </label>
          <SaveButton />
        </Form>
      ) : (
        <p className="text-center">No existe la entrada</p>
      )}
    </div>
  )
}

EntryEdit.loader = loader
EntryEdit.action = action

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
