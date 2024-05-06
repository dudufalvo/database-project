import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { deleteAccountValidationSchema } from 'src/schemas'

import styles from './delete.module.scss'

import api from 'api/api'
import InputPassword from 'components/Form/InputPassword'
import { ModalWrapper } from 'components/Modals'
import useRequest from 'hooks/useRequest'
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

  const { doRequest: deleteAccountPassword } = useRequest<DeleteAccountFormType>(api.deleteUser, {
    onSuccess: () => {
      toast.success('Account deleted successfully')
      handleClosing()
      localStorage.removeItem('token')
      navigate('/sign-in')
    },
    onError: () => toast.error('Error deleting account')
  })

  return (
    <ModalWrapper title='Delete Account' isOpen={isOpen} submitTxt='Delete' methods={methods} handleClosing={handleClosing} handleCreating={deleteAccountPassword} >
      <FormProvider {...methods}>
        <form className={styles.deleteModal}>
          <InputPassword label='Confirm your password' name='password' id='password' placeholder='Insert password' isRequired={true} />
        </form>
      </FormProvider>
    </ModalWrapper >
  )
}

export default DeleteAccountModal
