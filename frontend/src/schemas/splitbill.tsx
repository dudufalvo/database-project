import * as yup from 'yup'

export const splitBillValidationSchema = yup.object({
  group_id: yup.string().required('Group is required'),
  title: yup.string().required('Title is required'),
  creditors: yup.array().of(yup.object().shape({
    name: yup.string().required('Name is required'),
    image: yup.string().required('Image is required'),
    user_id: yup.string().required('User id is required'),
    tag: yup.string(),
    value: yup.number()
  })).min(1, 'At least one creditor is required'),
  debtors: yup.array().of(yup.object().shape({
    name: yup.string().required('Name is required'),
    image: yup.string().required('Image is required'),
    user_id: yup.string().required('User id is required'),
    tag: yup.string(),
    value: yup.number()
  })).min(1, 'At least one debtor is required'),
})
