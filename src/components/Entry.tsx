import { FC } from 'react'
import { EntryFullInfo } from '../types/entries'

export const Entry: FC<{ entry: EntryFullInfo }> = ({ entry }) => {
  console.log(entry)
  return (
    <li className="card border bg-white shadow-xl">
      <div className="card-body p-4">
        <p className="text-lg font-bold">{entry.word}</p>
        <p className="text-pretty italic">{entry.sentence}</p>
        {entry.categories && (
          <div>
            <span className="badge">
              <span className="me-1">{entry.categories.icon}</span>
              {entry.categories.name}
            </span>
          </div>
        )}
        {entry.notes && (
          <p className="text-pretty border-t-2 border-base-100 pt-2 text-stone-600">
            {entry.notes}
          </p>
        )}
      </div>
    </li>
  )
}
