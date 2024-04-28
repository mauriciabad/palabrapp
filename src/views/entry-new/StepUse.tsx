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
          autoFocus
        />
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Palabras amigas
            <span className="ms-2 text-xs text-gray-500">
              Separadas por comas
            </span>
          </span>
        </div>
        <textarea
          name="related_entries"
          placeholder="Escribe aquí"
          className="textarea textarea-bordered w-full bg-white"
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
