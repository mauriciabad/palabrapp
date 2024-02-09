import { FC, useEffect, useState } from 'react'
import { Tables } from '../../../types/supabase'

export const StepClasify: FC<{
  categories: Tables<'categories'>[] | null
  setStepValidity: (enabled: boolean) => void
}> = ({ categories, setStepValidity }) => {
  const [category, setCategory] = useState('')

  useEffect(() => {
    setStepValidity(Boolean(category))
  }, [category, setStepValidity])
  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Categoria<span className="text-red-500">*</span>
          </span>
        </div>
        <select
          className="select select-bordered w-full bg-white"
          name="category_id"
          required
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
          }}
        >
          <option disabled value="">
            Selecciona una categoría
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </label>
    </>
  )
}
