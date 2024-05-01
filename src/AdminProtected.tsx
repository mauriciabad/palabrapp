import { IconBarrierBlock } from '@tabler/icons-react'
import { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export const AdminProtected: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()

  if (user && user.role === 'admin') {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <IconBarrierBlock size={24 * 5} stroke={(2 / 5) * 2} />
      <h1 className="text-4xl font-bold text-gray-800">Acceso denegado</h1>
      <p className="text-gray-600">
        No tienes permisos para acceder a esta página
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
