import { FC } from 'react'
import { supabase } from '../supabase'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Form, Params, redirect, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'
import { Recorder } from '../components/Recorder'
import { getFileExtension } from '../utils/storage'

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
  const entryId = params.id
  if (!entryId) throw new Error('No id')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  const userId = user.id

  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  await supabase
    .from('entries')
    .update({
      word: String(updates.word),
      sentence: String(updates.sentence),
      notes: String(updates.notes),
      category_id: Number(updates.category_id),
    })
    .eq('id', entryId)

  // --- Drawing ---

  const drawingFile = updates.drawing
  if (drawingFile && drawingFile instanceof File && drawingFile.size > 0) {
    const fileExtension = getFileExtension(drawingFile.name)
    const { data: drawingData, error: drawingError } = await supabase.storage
      .from('main')
      .upload(
        `private/${userId}/drawing-${entryId}.${fileExtension}`,
        drawingFile,
        {
          upsert: true,
        },
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

  return redirect(`/palabras/${entryId}`)
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
        <Form method="post" encType="multipart/form-data">
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

          {entry.drawing && (
            <img
              src={entry.drawing}
              alt="Dibujo"
              className="mx-auto mt-4 w-full max-w-48 rounded-lg shadow-lg"
            />
          )}

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Dibujo</span>
            </div>
            <input
              type="file"
              name="drawing"
              className="file-input file-input-bordered w-full cursor-pointer bg-white"
            />
          </label>

          <Recorder
            name="pronunciation"
            size="sm"
            defaultValue={entry.pronunciation}
            className="mt-8"
          />
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
