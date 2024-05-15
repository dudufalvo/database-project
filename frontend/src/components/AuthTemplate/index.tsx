import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import type { UseFormReturn } from 'react-hook-form/dist/types'
import type { SignInType, SignUpType, RecoverPasswordType, ResetPasswordType } from 'types/User'

import styles from './authtemplate.module.scss'

import google from 'assets/google.svg'
import Button from 'components/Button'
import Separator from 'components/Separator'
import toast from 'utils/toast'

type FormType = SignUpType | SignInType | RecoverPasswordType | ResetPasswordType;

type AuthTemplateType<T extends FormType> = {
  children: React.ReactNode,
  type: 'sign-in' | 'sign-up' | 'recover' | 'reset-password',
  methods: UseFormReturn<T>
  handleAuth: () => void
}

const AuthTemplate = <T extends FormType>({ children, type, methods, handleAuth }: AuthTemplateType<T>) => {
  const navigate = useNavigate()

  const googleRequest = async (accessToken: string) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/auth/google_oauth2/callback`, { access_token: accessToken })
      .then(response => {
        localStorage.setItem('token', response.data.access_token)
        toast.success('Logged in successfully with Google')
        navigate('/')
      })
      .catch(() => {
        toast.error('Failed to login with Google')
      })
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      googleRequest(tokenResponse.access_token)
    },
    onError: () => {
      toast.error('Error with React OAuth Google')
    },
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar'
  })

  return (
    <div className={styles.auth}>
      <div className={styles.authLeft}>
        <div className={styles.authContent}>
          <div className={styles.authContentContainer}>
            <div className={styles.authContentTop}>
              <h1>{type === 'sign-in' ? 'Welcome back!' : (type == 'sign-up' ? 'Welcome' : "Let's recover your password!")}</h1>
              <h3>{type === 'sign-in' ? 'It\'s never been simpler to schedule your padle games.' : 'Please enter your details.'}</h3>
            </div>

            <FormProvider {...methods}>
              {children}
            </FormProvider>
          </div>

          <div className={styles.authContentBottom}>
            <div className={styles.authButton}>
              <Button disabled={!methods.formState.isDirty} type='submit' variant='filled' fullWidth={true} handle={handleAuth}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </Button>
              {type === 'sign-in'
                ? <span>Don't have an account? <a href='/sign-up'>Sign Up</a></span>
                : <span>Already have an account? <a href='/sign-in'>Sign In</a></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthTemplate
