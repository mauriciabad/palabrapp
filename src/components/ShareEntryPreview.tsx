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

      const fileName = `palabrapp-${entry.word}-${Date.now()}.png`

      const shareData = {
        files: [
          new File([data], fileName, {
            type: 'image/png',
          }),
        ],
        title: 'Compartir palabra',
        text: [
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

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        const link = document.createElement('a')
        link.download = fileName
        link.href = URL.createObjectURL(data)
        link.click()
        setTimeout(() => {
          URL.revokeObjectURL(link.href)
        }, 0)
      }
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
