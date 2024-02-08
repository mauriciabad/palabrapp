import { EntryList } from './views/EntryList'
import { LoginProtected } from './LoginProtected'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <main className="mx-auto max-w-3xl">
      <Navbar />
      <div className="p-4">
        <LoginProtected>
          <EntryList />
        </LoginProtected>
      </div>
    </main>
  )
}
