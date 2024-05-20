import { FC, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'
import { IconAsterisk, IconExternalLink } from '@tabler/icons-react'

export const EditUserPage: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState<string>('')
  const [tosAccepted, setTosAccepted] = useState<boolean>(false)
  const [emailAccepted, setEmailAccepted] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      setDisplayName(
        (user.user_metadata.display_name as string | undefined) ?? '',
      )
      setTosAccepted(
        (user.user_metadata.tos_accepted as boolean | undefined) ?? false,
      )
      setEmailAccepted(
        (user.user_metadata.email_accepted as boolean | undefined) ?? false,
      )
    }
  }, [user])

  const onSubmit = async () => {
    if (!user) return

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        tos_accepted: tosAccepted,
        email_accepted: emailAccepted,
      },
    })

    if (error) {
      console.error('Error updating user:', error.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Completa tu perfil</h1>
      <div className="w-full">
        <label className="label justify-start" htmlFor="display_name">
          <IconAsterisk
            size={12}
            stroke={4}
            className="mr-0.5 inline-block align-baseline text-red-500"
            aria-label="(Campo obligatorio)"
          />
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
          required
        />
      </div>
      <div className="form-control self-start">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            checked={tosAccepted}
            onChange={(e) => {
              setTosAccepted(e.target.checked)
            }}
            className="checkbox"
            required
          />
          <span className="label-text pl-2">
            <IconAsterisk
              size={12}
              stroke={4}
              className="mr-0.5 inline-block align-baseline text-red-500"
              aria-label="(Campo obligatorio)"
            />
            Acepto los{' '}
            <Link to="/tos" className="link" target="_blank" rel="noreferrer">
              Términos de servicio
              <IconExternalLink
                size={16}
                className="inline-block align-text-bottom"
              />
            </Link>
          </span>
        </label>
      </div>
      <div className="form-control self-start">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            checked={emailAccepted}
            onChange={(e) => {
              setEmailAccepted(e.target.checked)
            }}
            className="checkbox"
            required
          />
          <span className="label-text pl-2">
            <IconAsterisk
              size={12}
              stroke={4}
              className="mr-0.5 inline-block align-baseline text-red-500"
              aria-label="(Campo obligatorio)"
            />
            Acepto recibir comunicaciones por email
          </span>
        </label>
      </div>

      <button
        className="btn btn-primary mt-4 w-full"
        onClick={onSubmit}
        disabled={!displayName || !tosAccepted}
      >
        Guardar
      </button>
    </div>
  )
}
