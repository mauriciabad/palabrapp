import { useEffect, useState } from 'react'
import { addTimeToUrl } from '../utils/strings'

export const useAudio = (url?: string | null, updatedAt?: Date | string) => {
  const [audio] = useState(
    url ? new Audio(addTimeToUrl(url, updatedAt ?? new Date())) : undefined,
  )
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    setPlaying(!playing)
  }
  const play = () => {
    setPlaying(true)
  }
  const pause = () => {
    setPlaying(false)
  }

  useEffect(() => {
    if (playing) {
      void audio?.play()
    } else {
      audio?.pause()
    }
  }, [playing, audio])

  useEffect(() => {
    audio?.addEventListener('ended', () => {
      setPlaying(false)
    })
    return () => {
      audio?.removeEventListener('ended', () => {
        setPlaying(false)
      })
    }
  }, [audio])

  return { playing, play, toggle, pause }
}
