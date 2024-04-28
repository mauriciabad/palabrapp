import { IconBrush, IconDeviceFloppy, IconTrash } from '@tabler/icons-react'
import { FC, useRef, useState } from 'react'
import {
  Form,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom'
import { ShareEntryPreview } from '../components/ShareEntryPreview'
import { DrawingInputRef } from '../components/DrawingInput'
import { Recorder } from '../components/Recorder'
import { supabase } from '../supabase'
import { selectEntryFullInfo } from '../types/entries'
import { FCForRouter, LoaderData } from '../types/loaders'
import { cn } from '../utils/cn'
import { getFileExtension } from '../utils/storage'
import { addTimeToUrl } from '../utils/strings'
import { StepDraw } from './entry-new/StepDraw'

const loader = async ({ params }: { params: Params<'id'> }) => {
  if (!params.id) return { entry: undefined }
  const { data: entry } = await supabase
    .from('entries')
    .select(selectEntryFullInfo)
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
      related_entries: String(updates.related_entries) || null,
      notes: String(updates.notes) || null,
      category_id: Number(updates.category_id),
    })
    .eq('id', entryId)

  // --- Drawing ---

  const drawingPhotoFile =
    updates.drawingPhoto &&
    updates.drawingPhoto instanceof File &&
    updates.drawingPhoto.size > 0
      ? updates.drawingPhoto
      : null
  const drawingSvgFile = updates.drawingSvg
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

export const EntryEdit: FCForRouter<{
  action: typeof action
  loader: typeof loader
}> = () => {
  const { entry, categories } = useLoaderData() as LoaderData<typeof loader>
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [hideDrawing, setHideDrawing] = useState(false)

  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Editar palabra</h1>

      {entry ? (
        <>
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={() => {
              setFormSubmitted(true)
            }}
          >
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
                  Palabras amigas
                  <span className="ms-2 text-xs text-gray-500">
                    Separadas por comas
                  </span>
                </span>
              </div>
              <textarea
                name="related_entries"
                defaultValue={entry.related_entries ?? ''}
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

            {entry.drawing && !hideDrawing && (
              <img
                src={addTimeToUrl(entry.drawing)}
                alt="Dibujo"
                className="mx-auto mt-4 w-full max-w-48 rounded-lg bg-white shadow-lg"
              />
            )}

            <div className="mt-8 flex justify-center">
              <EditDrawingDialog
                onOpen={() => {
                  setHideDrawing(true)
                }}
                hasBeenOpened={hideDrawing}
              />
            </div>

            <Recorder
              name="pronunciation"
              size="sm"
              defaultValue={entry.pronunciation}
              className="mt-8"
            />
            <SaveButton loading={formSubmitted} />
          </Form>
          <div className="mt-8 flex justify-between">
            <ShareEntryPreview
              entry={entry}
              className="btn-primary"
              category={categories?.find(
                (category) => category.id === entry.category_id,
              )}
            />
            <DeleteButton entryId={entry.id} />
          </div>
        </>
      ) : (
        <p className="text-center">No existe la entrada</p>
      )}
    </div>
  )
}

EntryEdit.loader = loader
EntryEdit.action = action

const SaveButton: FC<{
  loading: boolean
}> = ({ loading }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 ">
      <div className="mx-auto max-w-3xl p-4">
        <button
          className="btn btn-primary btn-lg shadow-xl"
          type="submit"
          disabled={loading}
        >
          <IconDeviceFloppy />
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

const DeleteButton: FC<{ entryId: number }> = ({ entryId }) => {
  const navigate = useNavigate()

  return (
    <>
      <button
        className="btn btn-accent mt-4"
        onClick={() => {
          const modal = document.getElementById(
            'delete-modal',
          ) as HTMLDialogElement | null

          if (!modal) throw new Error('No modal found')
          modal.showModal()
        }}
      >
        <IconTrash />
        Eliminar
      </button>

      <dialog id="delete-modal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>

          <h3 className="text-lg font-bold">¿Seguro?</h3>
          <p className="py-4">Esta acción no se puede deshacer</p>
          <div className="modal-action">
            <button className="btn">Atrás</button>

            <button
              type="submit"
              className="btn btn-error"
              onClick={async () => {
                await supabase.from('entries').delete().eq('id', entryId)
                navigate('/palabras')
              }}
            >
              <IconTrash />
              Eliminar
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>Cerrar</button>
        </form>
      </dialog>
    </>
  )
}

const EditDrawingDialog: FC<{
  className?: string
  onOpen?: () => void
  hasBeenOpened?: boolean
}> = ({ className, onOpen, hasBeenOpened }) => {
  const drawStepRef = useRef<DrawingInputRef>(null)

  return (
    <>
      <label
        htmlFor="edit-drawing-modal"
        className={cn('btn', className)}
        onClick={onOpen}
      >
        <IconBrush />
        {hasBeenOpened ? 'Volver a editar dibujo' : 'Cambiar dibujo'}
      </label>

      <input type="checkbox" id="edit-drawing-modal" className="modal-toggle" />

      <div id="edit-drawing-modal" className="modal" role="dialog">
        <div className="modal-box">
          <label
            htmlFor="edit-drawing-modal"
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => {
              drawStepRef.current?.reset()
            }}
          >
            ✕
          </label>

          <StepDraw
            ref={drawStepRef}
            setStepValidity={() => {
              // Do nothing
            }}
          />

          <div className="modal-action">
            <label
              className="btn"
              htmlFor="edit-drawing-modal"
              onClick={() => {
                drawStepRef.current?.reset()
              }}
            >
              Cancelar
            </label>

            <label
              htmlFor="edit-drawing-modal"
              className="btn btn-primary"
              onClick={() => {
                void drawStepRef.current?.setInputValue()
              }}
            >
              <IconDeviceFloppy />
              Guardar
            </label>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="edit-drawing-modal"
          onClick={() => {
            drawStepRef.current?.reset()
          }}
        >
          Cerrar
        </label>
      </div>
    </>
  )
}
