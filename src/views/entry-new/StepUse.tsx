import { FC, useEffect, useState } from 'react'

export const StepUse: FC<{
  setStepValidity: (enabled: boolean) => void
}> = ({ setStepValidity }) => {
  const [sentence, setSentence] = useState('')

  useEffect(() => {
    setStepValidity(Boolean(sentence))
  }, [sentence, setStepValidity])
  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Frase<span className="text-red-500">*</span>
          </span>
        </div>
        <textarea
          name="sentence"
          required
          placeholder="Escribe aquí"
          className="textarea textarea-bordered w-full bg-white"
          value={sentence}
          onChange={(e) => {
            setSentence(e.target.value)
          }}
        />
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Notas</span>
        </div>
        <textarea
          name="notes"
          placeholder="Escribe aquí"
          className="textarea textarea-bordered w-full bg-white"
        />
      </label>
    </>
  )
}
