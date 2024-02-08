import { FC } from 'react'
import { supabase } from '../supabase'
import { IconMenu2 } from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error)
}

export const Navbar: FC = () => {
  const { user } = useAuth()

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          📚 PalabrApp
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
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
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-white p-2 shadow"
            >
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
