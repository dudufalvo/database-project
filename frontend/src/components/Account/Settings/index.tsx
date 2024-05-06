import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useUser } from 'src/contexts/userContext'
import { profileValidationSchema, privacyValidationSchema } from 'src/schemas'

import styles from './settings.module.scss'

import api from 'api/api'
import Button from 'components/Button'
import InputPassword from 'components/Form/InputPassword'
import InputText from 'components/Form/InputText'
import InputFile from 'components/InputFile'
import Separator from 'components/Separator'
import useRequest from 'hooks/useRequest'
import toast from 'utils/toast'

type ProfileFormType = {
  first_name: string;
  email: string;
  phone_number: string;
  image: FileList
};

type PrivacyFormType = {
  current_password: string;
  password: string;
  confirm_password: string;
};

const Settings = () => {
  const { user, updateUserProfile } = useUser()

  const profileMethods = useForm<ProfileFormType>({
    resolver: yupResolver<ProfileFormType>(profileValidationSchema),
    defaultValues: user
  })

  useEffect(() => {
    profileMethods.reset(user)
  }, [user, profileMethods])

  const privacyMethods = useForm<PrivacyFormType>({
    resolver: yupResolver(privacyValidationSchema)
  })

  const handleProfileUpdate = (data: ProfileFormType) => {
    const formData = new FormData()
    if (data.first_name) formData.append('user[first_name]', data.first_name)
    if (data.phone_number) formData.append('user[phone_number]', data.phone_number)
    if (data.image && data?.image.length > 0) formData.append('user[image]', data.image[0])

    updateUserProfile(formData)
  }

  const { doRequest: updateUserPassword } = useRequest<PrivacyFormType>(api.updateUserPassword, {
    onSuccess: () => toast.success('Password updated successfully'),
    onError: () => toast.error('Error updating password')
  })

  return (
    <>
      <h2>My Profile</h2>
      <FormProvider {...profileMethods}>
        <form className={styles.settings}>
          <div className={styles.profileLeft}>
            <InputFile label='Profile Photo' name='image' />
          </div>
          <div className={styles.profileRight}>
            <InputText id='name' name='name' label='Name' placeholder='Insert your name' />
            <InputText id='email' name='email' label='Email' placeholder='Insert your email' isDisabled />
            <InputText id='phone' name='phone' label='Phone' placeholder='Insert your phone' />
            <Button type='submit' variant='filled' fullWidth handle={profileMethods.handleSubmit(handleProfileUpdate)}>Save</Button>
          </div>
        </form>
      </FormProvider>
      <Separator />
      <h2>Privacy</h2>
      <FormProvider {...privacyMethods}>
        <form className={styles.settings}>
          <InputPassword id='current_password' name='current_password' label='Current password' placeholder='Insert current password' />
          <InputPassword id='password' name='password' label='New Password' placeholder='Insert new password' />
          <InputPassword id='confirm_password' name='confirm_password' label='Confirm new password' placeholder='Confirm your new password' />
          <Button type='submit' variant='filled' fullWidth handle={privacyMethods.handleSubmit(updateUserPassword)}>Save</Button>
        </form>
      </FormProvider>
    </>
  )
}

export default Settings
