import { FC, useEffect, useState } from 'react'
import { Tables } from '../types/supabase'
import { supabase } from './supabase'

export const EntryList: FC = () => {
  const [entries, setEntries] = useState<Tables<'entries'>[] | null>(null)

  useEffect(() => {
    void getEntries()
  }, [])

  async function getEntries() {
    const { data } = await supabase.from('entries').select()
    setEntries(data)
  }

  return (
    <div>
      <h1 className="text-center text-xl font-bold">Mis palabras</h1>

      <ul className="mt-4 space-y-4">
        {entries?.map((entry) => (
          <li key={entry.id} className="card border bg-white shadow-xl">
            <div className="card-body p-4">
              <p>{entry.word}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
