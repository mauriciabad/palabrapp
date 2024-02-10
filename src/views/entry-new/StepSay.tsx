import { FC } from 'react'
import { useVoiceRecorder } from 'use-voice-recorder'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { IconMicrophone } from '@tabler/icons-react'

export const StepSay: FC<{
  setStepValidity: (enabled: boolean) => void
}> = () => {
  const [record, setRecord] = useState<Blob | null>(null)
  const { isRecording, stop, start } = useVoiceRecorder(setRecord)

  return (
    <>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          void start()
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          stop()
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          void start()
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          stop()
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
