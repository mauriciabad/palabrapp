import { FC, useEffect, useRef } from 'react'
import { useVoiceRecorder } from 'use-voice-recorder'
import { useState } from 'react'
import { cn } from '../utils/cn'
import { IconMicrophone } from '@tabler/icons-react'

export const Recorder: FC<{
  name: string
  size?: 'sm' | 'lg'
  defaultValue?: string | null
  className?: string
}> = ({ name, size = 'lg', defaultValue, className }) => {
  const [record, setRecord] = useState<Blob | null>(null)
  const { isRecording, stop, start } = useVoiceRecorder(setRecord)
  const pronunciationInput = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const container = new DataTransfer()
    if (record) {
      container.items.add(
        new File([record], 'pronunciation.wav', {
          type: 'image/wav',
          lastModified: new Date().getTime(),
        }),
      )
    } else {
      container.items.clear()
    }

    if (pronunciationInput.current) {
      pronunciationInput.current.files = container.files
    }
  }, [record, pronunciationInput])

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        {
          'flex-col gap-8': size === 'lg',
          'flex-row gap-4': size === 'sm',
        },
        className,
      )}
    >
      <div>
        <input
          type="file"
          name={name}
          ref={pronunciationInput}
          className="hidden"
        />
        <button
          type="button"
          onMouseDown={() => {
            void start()
          }}
          onMouseUp={() => {
            stop()
          }}
          onTouchStart={() => {
            void start()
          }}
          onTouchEnd={() => {
            stop()
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
          className={cn(
            'btn btn-circle btn-primary btn-lg relative',
            isRecording && 'btn-error',
            'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full before:bg-error',
            !isRecording && 'before:hidden',
            'mx-auto flex',
            {
              'h-16 w-16': size === 'sm',
              'h-32 w-32': size === 'lg',
            },
          )}
        >
          <IconMicrophone
            size={size === 'lg' ? 24 * 3 : 24 * 1}
            stroke={size === 'lg' ? 4 / 3 : 6 / 3}
          />
        </button>
        {size === 'lg' && (
          <p className="mt-4 text-center text-sm text-stone-500">
            Manten presionado el botón para grabar.
            <br />
            Suelta para detener la grabación.
          </p>
        )}
      </div>

      {record ? (
        <audio
          src={window.URL.createObjectURL(record)}
          controls
          preload={'metadata'}
          className={cn('w-full')}
        />
      ) : (
        defaultValue && (
          <audio
            src={defaultValue}
            controls
            preload={'metadata'}
            className={cn('w-full')}
          />
        )
      )}
    </div>
  )
}
