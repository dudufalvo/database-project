import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import styles from './resetpassword.module.scss'

import AuthTemplate from 'components/AuthTemplate'
import InputText from 'components/Form/InputText'
import toast from 'utils/toast'
import { resetPasswordSchema } from 'src/schemas/resetPassword'
import { ResetPasswordRequestType, ResetPasswordType } from 'types/User'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams();

  const methods = useForm<ResetPasswordType>({
    resolver: yupResolver(resetPasswordSchema)
  })

  const resetPassword = async (data: ResetPasswordType) => {
    // replace all the "+" in the token with "." to match the API's expected format
    const reset_token = token?.replace(/\+/g, '.')

    data = { ...data, reset_token: reset_token } as ResetPasswordRequestType
    console.log(data)

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/client/reset-password`, { data })
      .then(() => {
        toast.success('Email sent successfully')
        navigate('/sign-in')
      })
      .catch(() => {
        toast.error('Failed to send email')
      })
  }

  return (
    <AuthTemplate type='reset-password' methods={methods} handleAuth={methods.handleSubmit(resetPassword)}>
      <form className={styles.signinContentMiddle}>
        <div className={styles.signinInputs}>
          <InputText label="Password" type="text" name="password" id="password" placeholder="Enter your new password" isRequired={true} />
        </div>
      </form>
    </AuthTemplate>
  )
}

export default ResetPassword
