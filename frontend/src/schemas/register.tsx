import * as yup from 'yup'

export const registerValidationSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  phone_number: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must be a number')
    .min(9, 'Phone number must have at least 9 digits')
    .max(9, 'Phone number must have at most 9 digits'),
  nif: yup.string()
    .required('NIF is required')
    .matches(/^[0-9]+$/, 'NIF must be a number')
    .min(9, 'NIF must have at least 9 digits')
    .max(9, 'NIF must have at most 9 digits')
})
