import { IconMicrophone } from '@tabler/icons-react'
import { FC, useEffect, useRef, useState } from 'react'
import { useVoiceRecorder } from 'use-voice-recorder'
import { cn } from '../utils/cn'
import { addTimeToUrl } from '../utils/strings'

const MIN_RECORDING_TIME = 500

export const Recorder: FC<{
  name: string
  size?: 'sm' | 'lg'
  defaultValue?: string | null
  className?: string
}> = ({ name, size = 'lg', defaultValue, className }) => {
  const [record, setRecord] = useState<Blob | null>(null)
  const { isRecording, stop, start } = useVoiceRecorder(setRecord)
  const pronunciationInput = useRef<HTMLInputElement>(null)
  const [recordingStart, setRecordingStart] = useState<number | null>(null)
  const [showhelp, setShowHelp] = useState(false)

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

  useEffect(() => {
    if (isRecording) {
      setShowHelp(false)
      setRecordingStart(Date.now())
    } else if (
      recordingStart &&
      Date.now() - recordingStart < MIN_RECORDING_TIME
    ) {
      setShowHelp(true)
      setRecord(null)
      setRecordingStart(null)
    }
  }, [isRecording, recordingStart])

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
      <div className="flex flex-col items-center">
        <input
          type="file"
          name={name}
          ref={pronunciationInput}
          className="hidden"
        />
        <div
          data-tip="Manten pulsado para grabar"
          className={cn(
            'tooltip',
            showhelp ? 'tooltip-open' : 'before:hidden after:hidden',
          )}
        >
          <button
            type="button"
            onMouseDown={() => {
              void start()
            }}
            onMouseUp={() => {
              stop()
              setTimeout(stop, MIN_RECORDING_TIME)
            }}
            onTouchStart={() => {
              void start()
            }}
            onTouchEnd={() => {
              stop()
              setTimeout(stop, MIN_RECORDING_TIME)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
            }}
            className={cn(
              'btn btn-circle btn-primary btn-lg relative',
              isRecording && 'btn-error',
              'before:absolute before:inset-0 before:-z-10 before:animate-ping before:rounded-full before:bg-error',
              !isRecording && 'before:hidden',
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
        </div>
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
            src={addTimeToUrl(defaultValue)}
            controls
            preload={'metadata'}
            className={cn('w-full')}
          />
        )
      )}
    </div>
  )
}
