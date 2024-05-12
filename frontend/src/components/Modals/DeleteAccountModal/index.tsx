import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { deleteAccountValidationSchema } from 'src/schemas'

import styles from './delete.module.scss'

import axios from 'axios'
import InputPassword from 'components/Form/InputPassword'
import { ModalWrapper } from 'components/Modals'
import toast from 'utils/toast'

type DeleteAccountFormType = {
  password: string,
}

type DeleteAccountModalType = {
  isOpen: boolean,
  handleClosing: () => void
}

const DeleteAccountModal = ({ isOpen, handleClosing }: DeleteAccountModalType) => {
  const navigate = useNavigate()

  const methods = useForm<DeleteAccountFormType>({
    resolver: yupResolver(deleteAccountValidationSchema)
  })

  const handleDelete = (data: DeleteAccountFormType) => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/client/delete`, { data } ,{ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        toast.success('Account deleted successfully')
        handleClosing()
        localStorage.removeItem('token')
        navigate('/sign-in')
      })
      .catch(() => {
        toast.error('Error deleting account')
      });
  }

  return (
    <ModalWrapper title='Delete Account' isOpen={isOpen} submitTxt='Delete' methods={methods} handleClosing={handleClosing} handleCreating={handleDelete} >
      <FormProvider {...methods}>
        <form className={styles.deleteModal}>
          <InputPassword label='Confirm your password' name='password' id='password' placeholder='Insert password' isRequired={true} />
        </form>
      </FormProvider>
    </ModalWrapper >
  )
}

export default DeleteAccountModal
