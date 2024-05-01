import { FC, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export const EditUserPage: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    if (user) {
      setDisplayName(
        (user.user_metadata.display_name as string | undefined) ?? '',
      )
    }
  }, [user])

  const onSubmit = async () => {
    if (!user) return
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    })
    if (error) {
      console.error('Error updating display name:', error.message)
    }
    navigate('/')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full">
        <label className="label" htmlFor="display_name">
          Nombre
        </label>
        <input
          id="display_name"
          type="text"
          placeholder="Tu nombre completo"
          className="input input-bordered w-full"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value)
          }}
        />
      </div>
      <button className="btn btn-primary mt-4 w-full" onClick={onSubmit}>
        Guardar
      </button>
    </div>
  )
}
