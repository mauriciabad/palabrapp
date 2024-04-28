import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { DrawingInput, DrawingInputRef } from '../../components/DrawingInput'
import { cn } from '../../utils/cn'

type DrawingType = 'drawing' | 'photo'

export const StepDraw = forwardRef<
  DrawingInputRef,
  {
    setStepValidity: (enabled: boolean) => void
  }
>(function StepDraw(_props, outerRef) {
  const drawingInputRef = useRef<DrawingInputRef>(null)
  const [drawingType, setDrawingType] = useState<DrawingType>('drawing')

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(outerRef, () => drawingInputRef.current!, [])

  return (
    <>
      <div role="tablist" className="tabs tabs-lifted mt-4">
        <div
          role="tab"
          className={cn('tab', {
            'tab-active': drawingType === 'drawing',
          })}
          onClick={() => {
            setDrawingType('drawing')
          }}
        >
          Dibujar
        </div>
        <div
          role="tab"
          className={cn('tab', {
            'tab-active': drawingType === 'photo',
          })}
          onClick={() => {
            setDrawingType('photo')
          }}
        >
          Subir foto
        </div>
      </div>

      {drawingType === 'drawing' ? (
        <DrawingInput
          className="mt-2"
          ref={drawingInputRef}
          name="drawingSvg"
        />
      ) : (
        <input
          type="file"
          name="drawingPhoto"
          className="file-input file-input-bordered mt-16 w-full cursor-pointer bg-white"
        />
      )}
    </>
  )
})
