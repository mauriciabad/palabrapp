import { FC } from 'react'
import { EntryFullInfo } from '../types/entries'
import { IconPlayerPlay, IconWriting } from '@tabler/icons-react'
import { useAudio } from '../hooks/useAudio'
import { IconPlayerPause } from '@tabler/icons-react'

export const Entry: FC<{ entry: EntryFullInfo }> = ({ entry }) => {
  const { playing, toggle } = useAudio(entry.pronunciation)

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
          {entry.pronunciation && (
            <button
              className="btn btn-circle btn-outline"
              onClick={(e) => {
                e.preventDefault()
                toggle()
              }}
            >
              {playing ? <IconPlayerPause /> : <IconPlayerPlay />}
            </button>
          )}
        </div>
        {entry.notes && (
          <p className="text-pretty border-t-2 border-base-100 pt-2 text-stone-600">
            {entry.notes}
          </p>
        )}
      </div>
    </li>
  )
}
