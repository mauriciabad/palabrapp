import { FC } from 'react'
import { supabase } from '../supabase'
import { IconMenu2 } from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error)
}

export const Navbar: FC = () => {
  const { user } = useAuth()

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">📚 PalabrApp</a>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <IconMenu2 size={24} />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 bg-white p-2 shadow"
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
