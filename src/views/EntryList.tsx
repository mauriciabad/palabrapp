import { FC, useEffect, useState } from 'react'
import { Tables } from '../../types/supabase'
import { supabase } from '../supabase'
import { Entry } from '../components/Entry'
import { IconPlus } from '@tabler/icons-react'

export const EntryList: FC = () => {
  const [entries, setEntries] = useState<Tables<'entries'>[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void getEntries()
  }, [])

  async function getEntries() {
    setLoading(true)
    try {
      const { data } = await supabase.from('entries').select()
      setEntries(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-20">
      <h1 className="text-center text-xl font-bold">Mis palabras</h1>

      <CreateButton />

      {loading && <p className="mt-4 text-center">Cargando...</p>}
      {entries ? (
        <ul className="mt-4 space-y-4">
          {entries.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center">No hay entradas</p>
      )}
    </div>
  )
}

const CreateButton: FC = () => {
  return (
    <button
      className="btn btn-lg btn-primary fixed bottom-4 left-4 z-10 shadow-xl"
      onClick={() => {
        console.log('CreateButton')
      }}
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
    </button>
  )
}
