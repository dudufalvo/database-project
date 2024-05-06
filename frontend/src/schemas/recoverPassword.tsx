import * as yup from 'yup'

export const recoverPasswordSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Email is invalid')
})
