import { EntryList } from './EntryList'
import { LoginProtected } from './LoginProtected'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <main className="mx-auto max-w-3xl">
      <Navbar />
      <LoginProtected>
        <div className="p-4">
          <EntryList />
        </div>
      </LoginProtected>
    </main>
  )
}
