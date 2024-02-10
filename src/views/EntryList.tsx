import { FC } from 'react'
import { Entry } from '../components/Entry'
import { IconPlus } from '@tabler/icons-react'
import { Link, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'
import { selectEntryFullInfo } from '../types/entries'
import { supabase } from '../supabase'

const loader = async () => {
  const { data: entries } = await supabase
    .from('entries')
    .select(selectEntryFullInfo)
    .order('word', { ascending: true })
  return { entries }
}

export const EntryList: FCForRouter<{ loader: typeof loader }> = () => {
  const { entries } = useLoaderData() as LoaderData<typeof loader>

  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Mis palabras</h1>

      <CreateButton />

      {entries ? (
        <ul className="mt-4 space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/palabras/${entry.id}/editar`}
              className="block"
            >
              <Entry entry={entry} />
            </Link>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center">No hay entradas</p>
      )}
    </div>
  )
}

EntryList.loader = loader

const CreateButton: FC = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 ">
      <div className="mx-auto max-w-3xl p-4">
        <Link className="btn btn-primary btn-lg shadow-xl" to="/palabras/nueva">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <IconPlus />
          </svg>
          Añadir palabra
        </Link>
      </div>
    </div>
  )
}
