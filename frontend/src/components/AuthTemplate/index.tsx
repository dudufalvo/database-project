import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import type { UseFormReturn } from 'react-hook-form/dist/types'
import type { SignInType, SignUpType } from 'types/User'

import styles from './authtemplate.module.scss'

import google from 'assets/google.svg'
import logo from 'assets/logo.png'
import signImage from 'assets/signImage.png'
import Button from 'components/Button'
import Separator from 'components/Separator'
import toast from 'utils/toast'

type FormType = SignUpType | SignInType;

type AuthTemplateType<T extends FormType> = {
  children: React.ReactNode,
  type: 'sign-in' | 'sign-up',
  methods: UseFormReturn<T>
  handleAuth: () => void
}

const AuthTemplate = <T extends FormType>({ children, type, methods, handleAuth }: AuthTemplateType<T>) => {
  const navigate = useNavigate()

  const googleRequest = async (accessToken: string) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/auth/google_oauth2/callback`, { access_token: accessToken })
      .then(response => {
        localStorage.setItem('token', response.headers.authorization)
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
              <h1>{type === 'sign-in' ? 'Welcome back!' : 'Welcome'}</h1>
              <h3>{type === 'sign-in' ? 'It\'s never been simpler to colect your soil data.' : 'Please enter your details.'}</h3>
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
            <Separator>OR</Separator>
            <Button handle={googleLogin} variant='google' fullWidth={true}>
              <img src={google} alt='Google' />
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} with Google
            </Button>
          </div>
        </div>
      </div>

      {/* <div className={styles.authRight}>
        <div className={styles.authImage}>
          <img src={signImage} alt='sign-image' />
          <div>
            <img src={logo} alt='logo' />
            <h2>It's never been simpler to plan meals with your friends!</h2>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default AuthTemplate
