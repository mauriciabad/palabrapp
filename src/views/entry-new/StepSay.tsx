import { FC, useEffect, useRef } from 'react'
import { useVoiceRecorder } from 'use-voice-recorder'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { IconMicrophone } from '@tabler/icons-react'

export const StepSay: FC<{
  setStepValidity: (enabled: boolean) => void
}> = () => {
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
    <>
      <input
        type="file"
        name="pronunciation"
        ref={pronunciationInput}
        className="hidden"
      />
      <button
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
          'mx-auto mt-16 flex h-32 w-32',
        )}
      >
        <IconMicrophone size={24 * 3} stroke={4 / 3} />
      </button>
      <p className="mt-4 text-center text-sm text-stone-500">
        Manten presionado el botón para grabar.
        <br />
        Suelta para detener la grabación.
      </p>

      {record && (
        <audio
          src={window.URL.createObjectURL(record)}
          controls
          preload={'metadata'}
          className="mt-8 w-full"
        />
      )}
    </>
  )
}
