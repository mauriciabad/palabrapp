import { useState, useEffect } from 'react'

export const useAudio = (url?: string | null) => {
  const [audio] = useState(url ? new Audio(url) : undefined)
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
