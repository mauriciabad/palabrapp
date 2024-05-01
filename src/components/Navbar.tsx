import { IconHomePlus, IconMenu2 } from '@tabler/icons-react'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAddToHomescreenPrompt } from '../hooks/useAddToHomescreenPrompt'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error)
}

export const Navbar: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = useState(false)

  useEffect(() => {
    if (prompt) setVisibleState(true)
  }, [prompt])

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          <img
            src="/logo.png"
            alt="PalabrApp"
            aria-label="PalabrApp"
            className="h-12"
          />
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          {isVisible && (
            <button
              className="btn btn-neutral btn-sm"
              onClick={() => {
                setVisibleState(false)
                promptToInstall()
              }}
            >
              <IconHomePlus />
              Instalar
            </button>
          )}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <IconMenu2 size={24} />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[100] mt-3 w-52 rounded-box bg-white p-2 shadow"
            >
              <li>
                <button
                  onClick={() => {
                    navigate('/usuario/editar')
                  }}
                >
                  Editar perfil
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    void signOut()
                  }}
                >
                  Cerrar sesion
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
