import {
  IconPlayerPause,
  IconPlayerPlay,
  IconWriting,
} from '@tabler/icons-react'
import { FC } from 'react'
import { useAudio } from '../hooks/useAudio'
import { EntryFullInfo } from '../types/entries'
import { addTimeToUrl } from '../utils/strings'
import { ShareEntryPreview } from './ShareEntryPreview'

export const Entry: FC<{ entry: EntryFullInfo }> = ({ entry }) => {
  const { playing, toggle } = useAudio(entry.pronunciation, entry.updated_at)

  return (
    <li className="card border bg-white shadow-xl">
      <div className="card-body p-4">
        <div className="flex flex-col items-start gap-2 xs2:flex-row xs2:gap-4">
          <div className="flex items-center justify-between gap-4 self-stretch xs2:flex-col xs2:justify-start xs2:self-center">
            {entry.drawing ? (
              <img
                src={addTimeToUrl(entry.drawing, entry.updated_at)}
                alt="Dibujo"
                className="h-auto w-20 rounded"
              />
            ) : (
              <div className="flex aspect-square w-20 items-center justify-center rounded bg-base-200">
                <IconWriting size={24} />
              </div>
            )}
            <div className="block flex-1 xs2:hidden" />
            {entry.pronunciation && (
              <button
                className="btn btn-circle btn-outline flex xs2:hidden"
                onClick={(e) => {
                  e.preventDefault()
                  toggle()
                }}
              >
                {playing ? <IconPlayerPause /> : <IconPlayerPlay />}
              </button>
            )}
            <ShareEntryPreview
              entry={entry}
              category={entry.categories}
              size="sm"
              className="btn-primary flex xs2:hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{entry.word}</p>
            <p className="mb-1 text-pretty italic">
              <span className="text-stone-400">&laquo;</span>
              {entry.sentence}
              <span className="text-stone-400">&raquo;</span>
            </p>
            {entry.categories && (
              <div>
                <span className="leading-1 badge h-auto text-balance">
                  <span className="me-1">{entry.categories.icon}</span>
                  {entry.categories.name}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse items-center gap-1 self-center sm:flex-row sm:gap-4">
            {entry.pronunciation && (
              <button
                className="btn btn-circle btn-outline hidden self-center xs2:flex"
                onClick={(e) => {
                  e.preventDefault()
                  toggle()
                }}
              >
                {playing ? <IconPlayerPause /> : <IconPlayerPlay />}
              </button>
            )}
            <ShareEntryPreview
              entry={entry}
              category={entry.categories}
              size="sm"
              className="btn-primary hidden self-center xs2:flex"
            />
          </div>
        </div>
        {(!!entry.related_entries || !!entry.notes) && (
          <hr className="border-t-2 border-base-100" />
        )}
        {entry.related_entries && (
          <p className="mb-1 text-pretty italic">{entry.related_entries}</p>
        )}
        {entry.notes && <p className="text-pretty">{entry.notes}</p>}
      </div>
    </li>
  )
}
