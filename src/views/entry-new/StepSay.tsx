import { FC } from 'react'
import { Recorder } from '../../components/Recorder'

export const StepSay: FC<{
  setStepValidity: (enabled: boolean) => void
}> = () => {
  return (
    <>
      <Recorder name="pronunciation" size="lg" className="mt-16" />
    </>
  )
}
