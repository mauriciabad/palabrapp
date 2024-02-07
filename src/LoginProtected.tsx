import { FC, PropsWithChildren } from 'react'
import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './supabase'
import { useAuth } from './hooks/useAuth'

export const LoginProtected: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return (
      <Auth
        supabaseClient={supabase}
        providers={[]}
        appearance={{
          extend: false,
          className: {
            anchor: 'label-text-alt link link-hover block mt-2',
            button: 'btn btn-primary mt-4 w-full',
            input: 'input input-bordered w-full',
            label: 'label label-text',
          },
        }}
      />
    )
  }

  return <>{children}</>
}
