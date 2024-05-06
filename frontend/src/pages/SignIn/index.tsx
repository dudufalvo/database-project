import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { loginValidationSchema } from 'src/schemas'

import type { SignInType } from 'types/User'

import styles from './signin.module.scss'

import AuthTemplate from 'components/AuthTemplate'
import Checkbox from 'components/Checkbox'
import InputPassword from 'components/Form/InputPassword'
import InputText from 'components/Form/InputText'
import toast from 'utils/toast'

const SignIn = () => {
  const navigate = useNavigate()

  const methods = useForm<SignInType>({
    defaultValues: {
      rememberMe: false
    },
    resolver: yupResolver(loginValidationSchema)
  })

  const signInUser = async (data: SignInType) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/client/login`, { data })
      .then(response => {
        localStorage.setItem('token', response.data.access_token)
        toast.success('Logged in successfully')
        navigate('/')
      })
      .catch(() => {
        toast.error('Failed to login')
      })
  }

  return (
    <AuthTemplate type='sign-in' methods={methods} handleAuth={methods.handleSubmit(signInUser)}>
      <form className={styles.signinContentMiddle}>
        <div className={styles.signinInputs}>
          <InputText label="E-mail" type="text" name="email" id="email" placeholder="Enter your email" isRequired={true} />
          <InputPassword id="password" name="password" placeholder="Enter your password" label="Password" isRequired={true} />
        </div>

        <div className={styles.signinRememberMe}>
          <Checkbox name='rememberMe' label='Remember me' />
          <a href="/client/forgot-password">Forgot password?</a>
        </div>
      </form>
    </AuthTemplate>
  )
}

export default SignIn
