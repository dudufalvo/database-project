import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import styles from './recoverpassword.module.scss'

import AuthTemplate from 'components/AuthTemplate'
import InputText from 'components/Form/InputText'
import toast from 'utils/toast'
import { recoverPasswordSchema } from 'src/schemas/recoverPassword'
import { RecoverPasswordType } from 'types/User'

const RecoverPassword = () => {
  const navigate = useNavigate()

  const methods = useForm<RecoverPasswordType>({
    resolver: yupResolver(recoverPasswordSchema)
  })

  const recoverPassword = async (data: RecoverPasswordType) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/client/recover-password`, { data })
      .then(() => {
        toast.success('Email sent successfully')
        navigate('/sign-in')
      })
      .catch(() => {
        toast.error('Failed to send email')
      })
  }

  return (
    <AuthTemplate type='recover' methods={methods} handleAuth={methods.handleSubmit(recoverPassword)}>
      <form className={styles.signinContentMiddle}>
        <div className={styles.signinInputs}>
          <InputText label="E-mail" type="text" name="email" id="email" placeholder="Enter your email" isRequired={true} />
        </div>
      </form>
    </AuthTemplate>
  )
}

export default RecoverPassword
