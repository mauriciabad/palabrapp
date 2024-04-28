import { useEffect, useState } from 'react'

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void,
] {
  const [prompt, setState] = useState<IBeforeInstallPromptEvent | null>(null)

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event',
      ),
    )
  }

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setState(e)
    }

    // @ts-expect-error No overload matches this call.  Overload 1 of 2, '(type: keyof WindowEventMap, l...
    window.addEventListener('beforeinstallprompt', ready)

    return () => {
      // @ts-expect-error No overload matches this call.  Overload 1 of 2, '(type: keyof WindowEventMap, l...
      window.removeEventListener('beforeinstallprompt', ready)
    }
  }, [])

  return [prompt, promptToInstall]
}
