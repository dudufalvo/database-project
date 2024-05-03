import * as yup from 'yup'

export const profileValidationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().notRequired(),
  phone: yup.string().notRequired(),
  image: yup.mixed<FileList>().notRequired()
})
