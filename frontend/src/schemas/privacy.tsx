import * as yup from 'yup'

export const privacyValidationSchema = yup.object({
  current_password: yup.string()
    .required('Current Password is required')
    .min(6, 'Current Password must be at least 6 characters')
    .max(40, 'Current Password must not exceed 40 characters'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  confirm_password: yup.string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Confirm Password does not match')
})
