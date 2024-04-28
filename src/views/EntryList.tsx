import { IconPlus, IconSearch } from '@tabler/icons-react'
import { FC, useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Entry } from '../components/Entry'
import { supabase } from '../supabase'
import { EntryFullInfo, selectEntryFullInfo } from '../types/entries'
import { FCForRouter, LoaderData } from '../types/loaders'
import { containsIgnoreCaseAndAccents, normalize } from '../utils/strings'

const loader = async () => {
  const { data: entries } = await supabase
    .from('entries')
    .select(selectEntryFullInfo)
    .order('word', { ascending: true })

  const { data: categories } = await supabase.from('categories').select()

  return { entries, categories }
}

const dateIntervals = [
  { id: 'today', name: 'Hoy' },
  { id: 'week', name: 'Esta semana' },
  { id: 'month', name: 'Este mes' },
  { id: 'year', name: 'Este año' },
] as const satisfies {
  id: string
  name: string
}[]

type DateInterval = (typeof dateIntervals)[number]['id']

export const EntryList: FCForRouter<{ loader: typeof loader }> = () => {
  const { entries, categories } = useLoaderData() as LoaderData<typeof loader>
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState('')
  const [dateInterval, setDateInterval] = useState<DateInterval | ''>('')

  const filteredEntries = useMemo(() => {
    if (!entries) return null

    return entries
      .filter((entry) => {
        const passesFilterSearch =
          !search ||
          containsIgnoreCaseAndAccents(entry.word, search) ||
          containsIgnoreCaseAndAccents(entry.notes ?? '', search) ||
          containsIgnoreCaseAndAccents(entry.sentence, search)
        const passesFilterCategory =
          !category || entry.category_id === Number(category)

        return (
          passesFilterSearch &&
          passesFilterCategory &&
          passesDateInterval(entry, dateInterval || null)
        )
      })
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
  }, [entries, search, category, dateInterval])

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

      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          className="select select-bordered select-sm w-full bg-white"
          name="category_id"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
          }}
        >
          <option disabled value="">
            Categoría
          </option>
          <option value="">Todas las categorías</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered select-sm w-full bg-white"
          name="date"
          value={dateInterval}
          onChange={(e) => {
            setDateInterval(e.target.value as DateInterval | '')
          }}
        >
          <option disabled value="">
            Fecha de creación
          </option>
          <option value="">Qualquier momento</option>
          {dateIntervals.map((dateInterval) => (
            <option key={dateInterval.id} value={dateInterval.id}>
              {dateInterval.name}
            </option>
          ))}
        </select>
      </div>

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

const DAY_IN_MS = 24 * 60 * 60 * 1000

const passesDateInterval = (
  entry: EntryFullInfo,
  dateInterval: DateInterval | null,
) => {
  const date = new Date(entry.created_at)
  const now = new Date().getTime()

  switch (dateInterval) {
    case 'today':
      return date > new Date(now - 1 * DAY_IN_MS)
    case 'week':
      return date > new Date(now - 7 * DAY_IN_MS)
    case 'month':
      return date > new Date(now - 30 * DAY_IN_MS)
    case 'year':
      return date > new Date(now - 365 * DAY_IN_MS)
    default:
      return true
  }
}
