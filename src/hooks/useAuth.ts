import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        const currentUser = session?.user
        setUser(currentUser ?? null)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { user }
}
