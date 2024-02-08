import { FC } from 'react'

export const StepWrite: FC = () => {
  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Palabra<span className="text-red-500">*</span>
          </span>
        </div>
        <input
          type="text"
          name="word"
          required
          placeholder="Escribe aquí"
          className="input input-bordered w-full bg-white"
        />
      </label>
    </>
  )
}
