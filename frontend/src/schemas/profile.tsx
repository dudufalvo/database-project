import * as yup from 'yup'

export const profileValidationSchema = yup.object({
  first_name: yup.string().required(),
  email: yup.string().notRequired(),
  phone_number: yup.string().notRequired(),
  image: yup.mixed<FileList>().notRequired()
})
