import * as yup from 'yup'

export const deleteAccountValidationSchema = yup.object({
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters')
})
