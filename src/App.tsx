import { EntryList } from './EntryList'
import { LoginProtected } from './LoginProtected'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <LoginProtected>
        <EntryList />
      </LoginProtected>
    </>
  )
}
