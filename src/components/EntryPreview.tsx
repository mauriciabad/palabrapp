import { forwardRef } from 'react'
import { EntryFullInfo } from '../types/entries'
import { cn } from '../utils/cn'
import { addTimeToUrl } from '../utils/strings'

export const EntryPreview = forwardRef<
  HTMLDivElement,
  { entry: EntryFullInfo; className?: string }
>(function EntryPreview({ entry, className }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full space-y-2 bg-white p-4 text-center',
        className,
      )}
    >
      {entry.drawing && (
        <img
          src={addTimeToUrl(entry.drawing)}
          alt="Dibujo"
          className="mx-auto h-auto w-full max-w-[200px] rounded"
        />
      )}

      <h2 className="text-3xl font-semibold tracking-wider">{entry.word}</h2>
      {entry.categories && (
        <div className="mb-4">
          <span className="leading-1 badge h-auto text-balance">
            <span className="me-1">{entry.categories.icon}</span>
            {entry.categories.name}
          </span>
        </div>
      )}

      <p className="text-pretty italic">
        <span className="text-stone-400">&laquo;</span>
        {entry.sentence}
        <span className="text-stone-400">&raquo;</span>
      </p>

      {(!!entry.related_entries || !!entry.notes) && (
        <hr className="border-t-2 border-base-100" />
      )}
      {entry.related_entries && (
        <p className="mb-1 text-pretty italic">{entry.related_entries}</p>
      )}
      {entry.notes && <p className="text-pretty">{entry.notes}</p>}

      <img
        src="/logo.png"
        alt="Logo"
        // className="mx-auto h-12"
        className="absolute right-4 top-4 h-12 opacity-70"
        // className="absolute bottom-4 right-4 h-12"
      />
    </div>
  )
})
