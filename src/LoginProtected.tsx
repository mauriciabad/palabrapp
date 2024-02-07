import { FC, PropsWithChildren } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './supabase'
import { useAuth } from './hooks/useAuth'

export const LoginProtected: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  }

  return <>{children}</>
}
