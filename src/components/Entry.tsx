import { FC } from 'react'
import { EntryFullInfo } from '../types/entries'
import { IconWriting } from '@tabler/icons-react'

export const Entry: FC<{ entry: EntryFullInfo }> = ({ entry }) => {
  return (
    <li className="card border bg-white shadow-xl">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {entry.drawing ? (
            <img
              src={entry.drawing}
              alt="Dibujo"
              className="h-auto w-20 rounded"
            />
          ) : (
            <div className="flex aspect-square w-20 items-center justify-center rounded bg-base-200">
              <IconWriting size={24} />
            </div>
          )}
          <div className="flex-1">
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
          </div>
        </div>
        {entry.notes && (
          <p className="text-pretty border-t-2 border-base-100 pt-2 text-stone-600">
            {entry.notes}
          </p>
        )}
        {entry.pronunciation && (
          <audio
            controls
            src={entry.pronunciation}
            className="mt-2 w-full"
          ></audio>
        )}
      </div>
    </li>
  )
}
