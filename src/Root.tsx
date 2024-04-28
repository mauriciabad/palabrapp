import { Outlet } from 'react-router-dom'
import { LoginProtected } from './LoginProtected'
import { Navbar } from './components/Navbar'

export default function Root() {
  return (
    <main className="mx-auto max-w-3xl">
      <Navbar />
      <div className="p-4">
        <LoginProtected>
          <Outlet />
        </LoginProtected>
      </div>
    </main>
  )
}
