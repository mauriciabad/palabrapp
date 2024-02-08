import { FC } from 'react'
import { supabase } from '../supabase'
import { Entry } from '../components/Entry'
import { IconPlus } from '@tabler/icons-react'
import { Link, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'

const loader = async () => {
  const { data } = await supabase.from('entries').select()
  return { entries: data }
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
            <Link key={entry.id} to={`/palabras/${entry.id}`} className="block">
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
    <Link
      className="btn btn-primary btn-lg fixed bottom-4 left-4 z-10 shadow-xl"
      to="/palabras/nueva"
    >
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
  )
}
