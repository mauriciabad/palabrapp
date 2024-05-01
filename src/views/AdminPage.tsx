import { IconLockOpen } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { FCForRouter } from '../types/loaders'
import { supabase } from '../supabase'

const loader = async () => {
  const { data: categories } = await supabase.from('categories').select()

  return { categories }
}

export const AdminPage: FCForRouter<{ loader: typeof loader }> = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <IconLockOpen size={24 * 5} stroke={(2 / 5) * 2} />
      <h1 className="text-4xl font-bold text-gray-800">Acceso permitido</h1>
      <p className="text-gray-600">Pagina en construcción</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

AdminPage.loader = loader
