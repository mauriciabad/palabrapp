import { useToBlob } from '@hugocxl/react-to-image'
import { IconShare2 } from '@tabler/icons-react'
import { FC } from 'react'
import { EntryFullInfo } from '../types/entries'
import { cn } from '../utils/cn'
import { EntryPreview } from './EntryPreview'

export const ShareEntryPreview: FC<{
  entry: EntryFullInfo
  className?: string
  category:
    | {
        icon: string
        id: number
        name: string
      }
    | undefined
    | null
  size?: 'md' | 'sm'
}> = ({ entry, className, category, size = 'md' }) => {
  const [, convert, ref] = useToBlob<HTMLDivElement>({
    quality: 0.8,
    onSuccess: async (data) => {
      if (!data) throw new Error('No data')

      const shareData = {
        files: [
          new File([data], `palabrapp-${entry.word}-${Date.now()}.png`, {
            type: 'image/png',
          }),
        ],
        title: [
          `Palabra: ${entry.word}`,
          category ? `Categoría: ${category.icon} ${category.name}` : null,
          `Frase: ${entry.sentence}`,
          entry.notes ? `Notas: ${entry.notes}` : null,
          entry.related_entries
            ? `Palabras amigas: ${entry.related_entries}`
            : null,
        ]
          .filter(Boolean)
          .join('\n'),
      }
      await navigator.share(shareData)
    },
  })

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          convert()
        }}
        className={cn(
          'btn',
          {
            'btn-circle': size === 'sm',
          },
          className,
        )}
      >
        <IconShare2 />
        {size === 'md' && 'Compartir palabra'}
      </button>
      <div className="pointer-events-none fixed bottom-full right-full size-0 overflow-hidden">
        <EntryPreview entry={entry} ref={ref} className="w-[500px]" />
      </div>
    </>
  )
}
