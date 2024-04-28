import { useToPng } from '@hugocxl/react-to-image'
import { IconDownload } from '@tabler/icons-react'
import { FC } from 'react'
import { EntryFullInfo } from '../types/entries'
import { cn } from '../utils/cn'
import { EntryPreview } from './EntryPreview'

export const DownloadEntryPreview: FC<{
  entry: EntryFullInfo
  className?: string
}> = ({ entry, className }) => {
  const [, convert, ref] = useToPng<HTMLDivElement>({
    quality: 0.8,
    onSuccess: (data) => {
      const link = document.createElement('a')
      link.download = 'my-image-name.png'
      link.href = data
      link.click()
    },
  })

  return (
    <>
      <button onClick={convert} className={cn('btn', className)}>
        <IconDownload />
        Download preview
      </button>
      <div className="pointer-events-none fixed bottom-full right-full size-0 overflow-hidden">
        <EntryPreview entry={entry} ref={ref} className="w-[500px]" />
      </div>
    </>
  )
}
