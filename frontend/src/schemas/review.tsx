import * as yup from 'yup'

export const reviewValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  location: yup.string().required('Location is required'),
  groups: yup.array().of(yup.string()).notRequired(),
  public: yup.boolean().default(false).notRequired(),
  images: yup.mixed<FileList>().notRequired(),
  rate: yup.number().required('Rate is required'),
  content: yup.string().required('Content is required')
})
