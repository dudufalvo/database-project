import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { registerValidationSchema } from 'src/schemas'

import type { SignUpType } from 'types/User'

import styles from './signup.module.scss'

import AuthTemplate from 'components/AuthTemplate'
import InputPassword from 'components/Form/InputPassword'
import InputText from 'components/Form/InputText'
import toast from 'utils/toast'


const SignUp = () => {
  const navigate = useNavigate()

  const methods = useForm<SignUpType>({
    resolver: yupResolver(registerValidationSchema)
  })

  const signUpUser = async (data: SignUpType) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, { user: data })
      .then(response => {
        localStorage.setItem('token', response.headers.authorization)
        toast.success('Signed up successfully')
        navigate('/home')
      })
      .catch(() => {
        toast.error('Failed to sign up')
      })
  }

  return (
    <AuthTemplate type='sign-up' methods={methods} handleAuth={methods.handleSubmit(signUpUser)} >
      <form className={styles.signupContentMiddle}>
        <InputText type="text" id="name" name="name" placeholder="Enter your name" label="Name" isRequired={true} />
        <InputText type="text" id="email" name="email" placeholder="Enter your e-mail" label="E-mail" isRequired={true} />
        <InputPassword id="password" name="password" placeholder="Create a password" label="Password" isRequired={true} />
        <InputPassword id="password_confirmation" name="password_confirmation" placeholder="Confirm the password" label="Confirm password" isRequired={true} />
      </form>
    </AuthTemplate>
  )
}

export default SignUp
