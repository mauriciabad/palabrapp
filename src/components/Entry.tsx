import { FC } from 'react'
import { Tables } from '../../types/supabase'

export const Entry: FC<{ entry: Tables<'entries'> }> = ({ entry }) => {
  return (
    <li className="card border bg-white shadow-xl">
      <div className="card-body p-4">
        <p className="text-lg font-bold">{entry.word}</p>
        <p className="text-pretty italic">{entry.sentence}</p>
        {entry.notes && (
          <p className="border-base-100 text-pretty border-t-2 pt-2 text-stone-600">
            {entry.notes}
          </p>
        )}
      </div>
    </li>
  )
}
