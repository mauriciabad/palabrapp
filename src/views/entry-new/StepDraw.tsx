import { FC } from 'react'
import { DrawingInput } from '../../components/DrawingInput'

export const StepDraw: FC<{
  setStepValidity: (enabled: boolean) => void
}> = () => {
  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Dibujo</span>
        </div>
        <input
          type="file"
          name="drawing"
          className="file-input file-input-bordered w-full cursor-pointer bg-white"
        />
      </label>

      <DrawingInput className="mt-4" />
    </>
  )
}
