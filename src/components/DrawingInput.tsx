import { ChangeEvent, FC, useRef, useState } from 'react'
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from 'react-sketch-canvas'
import { cn } from '../utils/cn'

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

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas()
  }

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas()
  }

  return (
    <div className={cn('d-flex flex-column gap-2 p-2', className)}>
      <h1>Tools</h1>
      <div className="d-flex align-items-center gap-2 ">
        <label htmlFor="strokeWidth" className="form-label">
          Stroke width
        </label>
        <input
          disabled={eraseMode}
          type="range"
          className="form-range"
          min="1"
          max="20"
          step="1"
          id="strokeWidth"
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
        />
        <label htmlFor="eraserWidth" className="form-label">
          Eraser width
        </label>
        <input
          disabled={!eraseMode}
          type="range"
          className="form-range"
          min="1"
          max="20"
          step="1"
          id="eraserWidth"
          value={eraserWidth}
          onChange={handleEraserWidthChange}
        />
      </div>

      <div className="h-9 w-9 overflow-hidden rounded-full">
        <input
          title="Color"
          className="h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 transform-cpu cursor-pointer appearance-none border-none bg-transparent"
          type="color"
          value={strokeColor}
          onChange={handleStrokeColorChange}
        />
      </div>
      <div className="d-flex align-items-center gap-2 ">
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          Pen
        </button>
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          Eraser
        </button>
        <div className="vr" />
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          onClick={handleUndoClick}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          onClick={handleRedoClick}
        >
          Redo
        </button>
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          onClick={handleClearClick}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn-outline-primary btn btn-sm"
          onClick={handleResetClick}
        >
          Reset
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
        className="mx-auto rounded-md border border-gray-300"
      />
    </div>
  )
}
