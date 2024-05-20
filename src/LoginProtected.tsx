import { Auth } from '@supabase/auth-ui-react'
import { I18nVariables } from '@supabase/auth-ui-shared'
import { FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

const localizationVariables: I18nVariables = {
  sign_up: {
    email_label: 'Email',
    password_label: 'Contraseña',
    email_input_placeholder: 'Tu email',
    password_input_placeholder: 'Tu contraseña',
    button_label: 'Registrarse',
    loading_button_label: 'Registrando ...',
    social_provider_text: 'Continuar con {{provider}}',
    link_text: '¿No tienes una cuenta? Regístrate',
    confirmation_text: 'Revisa tu correo para el enlace de confirmación',
  },
  sign_in: {
    email_label: 'Email',
    password_label: 'Contraseña',
    email_input_placeholder: 'Tu email',
    password_input_placeholder: 'Tu contraseña',
    button_label: 'Iniciar sesión',
    loading_button_label: 'Iniciando sesión ...',
    social_provider_text: 'Continuar con {{provider}}',
    link_text: '¿Ya tienes una cuenta? Inicia sesión',
  },
  forgotten_password: {
    email_label: 'Email',
    password_label: 'Tu contraseña',
    email_input_placeholder: 'Tu email',
    button_label: 'Enviar instrucciones para restablecer la contraseña',
    loading_button_label: 'Enviando instrucciones para restablecer ...',
    link_text: '¿Olvidaste tu contraseña?',
    confirmation_text:
      'Revisa tu correo para el enlace de restablecimiento de contraseña',
  },
  update_password: {
    password_label: 'Nueva contraseña',
    password_input_placeholder: 'Tu nueva contraseña',
    button_label: 'Actualizar contraseña',
    loading_button_label: 'Actualizando contraseña ...',
    confirmation_text: 'Tu contraseña ha sido actualizada',
  },
  verify_otp: {
    email_input_label: 'Email',
    email_input_placeholder: 'Tu email',
    phone_input_label: 'Número de teléfono',
    phone_input_placeholder: 'Tu número de teléfono',
    token_input_label: 'Token',
    token_input_placeholder: 'Tu token Otp',
    button_label: 'Verificar token',
    loading_button_label: 'Verificando token ...',
  },
}

const isUserInfoComplete = (user: User) => {
  return Boolean(
    user.user_metadata.display_name &&
      user.user_metadata.tos_accepted &&
      user.user_metadata.email_accepted,
  )
}

export const LoginProtected: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <CustomAuthUI />
  }

  if (!isUserInfoComplete(user)) {
    navigate('/usuario/editar', { replace: true })
  }

  return <>{children}</>
}

const CustomAuthUI: FC = () => {
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
      localization={{
        variables: localizationVariables,
      }}
    />
  )
}
