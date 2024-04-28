import { forwardRef, useImperativeHandle, useRef } from 'react'
import { DrawingInput, DrawingInputRef } from '../../components/DrawingInput'

export const StepDraw = forwardRef<
  DrawingInputRef,
  {
    setStepValidity: (enabled: boolean) => void
  }
>(function StepDraw(_props, outerRef) {
  const drawingInputRef = useRef<DrawingInputRef>(null)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(outerRef, () => drawingInputRef.current!, [])

  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Dibujo</span>
        </div>
        <input
          type="file"
          name="drawingPhoto"
          className="file-input file-input-bordered w-full cursor-pointer bg-white"
        />
      </label>

      <DrawingInput className="mt-4" ref={drawingInputRef} name="drawingSvg" />
    </>
  )
})
