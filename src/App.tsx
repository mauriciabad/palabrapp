import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '../types/supabase'

const supabase = createClient<Database>(
  'https://tsnycpxyfsftylvafhbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbnljcHh5ZnNmdHlsdmFmaGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMTU5NDgsImV4cCI6MjAyMjg5MTk0OH0.Uah_7UWZu6d-zyIWYQqcIKYkmaHsF13vnnRLGtaHOck',
)

function App() {
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
      <h1>Entries</h1>

      <ul>{entries?.map((entry) => <li key={entry.id}>{entry.word}</li>)}</ul>
    </div>
  )
}

export default App
