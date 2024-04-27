import { ChangeEvent, FC, useRef, useState } from 'react'
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from 'react-sketch-canvas'
import { cn } from '../utils/cn'
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconEraser,
  IconPalette,
  IconPencil,
  IconRestore,
} from '@tabler/icons-react'

export const DrawingInput: FC<{
  className?: string
}> = ({ className }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [eraseMode, setEraseMode] = useState(false)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [eraserWidth, setEraserWidth] = useState(10)

  const handleStrokeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(Number(event.target.value))
  }

  const handleEraserWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEraserWidth(Number(event.target.value))
  }

  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value)
  }

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  const handleUndoClick = () => {
    canvasRef.current?.undo()
  }

  const handleRedoClick = () => {
    canvasRef.current?.redo()
  }

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas()
  }

  return (
    <div
      className={cn(
        'mx-auto box-content flex flex-col items-center gap-2 p-2',
        className,
      )}
    >
      <input
        type="range"
        className="range range-primary w-full max-w-[320px]"
        min="1"
        max="20"
        step="1"
        value={eraseMode ? eraserWidth : strokeWidth}
        onChange={eraseMode ? handleEraserWidthChange : handleStrokeWidthChange}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <input
            title="Color"
            className="h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 transform-cpu cursor-pointer appearance-none border-none bg-transparent"
            type="color"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <IconPalette className="text-white" />
          </div>
        </div>

        <div className="join">
          <button
            type="button"
            className={cn('btn btn-circle join-item', {
              'btn-primary': !eraseMode,
            })}
            onClick={handlePenClick}
          >
            <IconPencil />
          </button>
          <button
            type="button"
            className={cn('btn btn-circle join-item', {
              'btn-primary': eraseMode,
            })}
            onClick={handleEraserClick}
          >
            <IconEraser />
          </button>
        </div>

        <button
          type="button"
          className="btn btn-circle"
          onClick={handleResetClick}
        >
          <IconRestore />
        </button>

        <button
          type="button"
          className="btn btn-circle"
          onClick={handleUndoClick}
        >
          <IconArrowBackUp />
        </button>
        <button
          type="button"
          className="btn btn-circle"
          onClick={handleRedoClick}
        >
          <IconArrowForwardUp />
        </button>
      </div>

      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor="#ffffff"
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        width="300px"
        height="300px"
      />
    </div>
  )
}
