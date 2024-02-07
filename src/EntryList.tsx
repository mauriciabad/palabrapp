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
      <h1>Mis palabras</h1>

      <ul>{entries?.map((entry) => <li key={entry.id}>{entry.word}</li>)}</ul>
    </div>
  )
}
