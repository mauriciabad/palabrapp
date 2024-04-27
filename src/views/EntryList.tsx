import { FC, useMemo, useState } from 'react'
import { Entry } from '../components/Entry'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { Link, useLoaderData } from 'react-router-dom'
import { FCForRouter, LoaderData } from '../types/loaders'
import { selectEntryFullInfo } from '../types/entries'
import { supabase } from '../supabase'
import { containsIgnoreCaseAndAccents, normalize } from '../utils/strings'

const loader = async () => {
  const { data: entries } = await supabase
    .from('entries')
    .select(selectEntryFullInfo)
    .order('word', { ascending: true })
  return { entries }
}

export const EntryList: FCForRouter<{ loader: typeof loader }> = () => {
  const { entries } = useLoaderData() as LoaderData<typeof loader>
  const [search, setSearch] = useState<string>('')

  const filteredEntries = useMemo(() => {
    if (!entries) return null
    if (!search) return entries

    return entries
      .filter(
        (entry) =>
          containsIgnoreCaseAndAccents(entry.word, search) ||
          containsIgnoreCaseAndAccents(entry.notes ?? '', search) ||
          containsIgnoreCaseAndAccents(entry.sentence, search),
      )
      .sort((a, b) => {
        // First sort if word starts with search
        if (normalize(a.word).startsWith(normalize(search))) return -1
        if (normalize(b.word).startsWith(normalize(search))) return 1

        // Then sort if word contains search
        if (containsIgnoreCaseAndAccents(a.word, search)) return -1
        if (containsIgnoreCaseAndAccents(b.word, search)) return 1

        // Then sort by notes
        if (containsIgnoreCaseAndAccents(a.notes ?? '', search)) return -1
        if (containsIgnoreCaseAndAccents(b.notes ?? '', search)) return 1

        // Finally sort by sentence
        if (containsIgnoreCaseAndAccents(a.sentence, search)) return -1
        if (containsIgnoreCaseAndAccents(b.sentence, search)) return 1
        return 0
      })
  }, [entries, search])

  return (
    <div className="pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">Mis palabras</h1>

      <label className="input input-bordered flex items-center gap-2 bg-white">
        <input
          type="text"
          className="grow"
          placeholder="Buscar"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <IconSearch />
      </label>

      <CreateButton />

      {filteredEntries?.length ? (
        <ul className="mt-4 space-y-4">
          {filteredEntries.map((entry) => (
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
        <p className="mt-8 text-center italic text-stone-600">
          {search ? 'Ningún resultado' : 'No has añadido ninguna palabra aún'}
        </p>
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
