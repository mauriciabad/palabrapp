import { FC, useEffect, useState } from 'react'

export const StepWrite: FC<{
  setStepValidity: (enabled: boolean) => void
}> = ({ setStepValidity }) => {
  const [word, setWord] = useState('')

  useEffect(() => {
    setStepValidity(Boolean(word))
  }, [word, setStepValidity])

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
          value={word}
          onChange={(e) => {
            setWord(e.target.value)
          }}
        />
      </label>
    </>
  )
}
