import * as yup from 'yup'

export const registerValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  password_confirmation: yup.string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Confirm Password does not match')
})
