import { FC } from 'react'
import { supabase } from '../supabase'
import { Entry } from '../components/Entry'
import { IconPencil } from '@tabler/icons-react'
import { Link, Params, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'

const loader = async ({ params }: { params: Params<'id'> }) => {
  if (!params.id) return { entry: undefined }
  const { data } = await supabase
    .from('entries')
    .select()
    .eq('id', params.id)
    .single()
  return { entry: data }
}

export const EntryView: FCForRouter<{ loader: typeof loader }> = () => {
  const { entry } = useLoaderData() as LoaderData<typeof loader>

  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Palabra</h1>

      {entry ? (
        <>
          <Entry entry={entry} />
          <EditButton id={entry.id} />
        </>
      ) : (
        <p className="text-center">No existe la entrada</p>
      )}
    </div>
  )
}

EntryView.loader = loader

const EditButton: FC<{ id: number }> = ({ id }) => {
  return (
    <Link
      className="btn btn-primary btn-lg fixed bottom-4 left-4 z-10 shadow-xl"
      to={`/palabras/${id}/editar`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <IconPencil />
      </svg>
      Editar palabra
    </Link>
  )
}
