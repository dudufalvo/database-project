import * as yup from 'yup'

const testGoogleMapsLink = (value: string) => {
  const regex = new RegExp(/https:\/\/www\.google\.+[a-zA-Z0-9+]+\/maps\/place\/[a-zA-Z0-9+]+\/@\d+(\.\d+)?,-\d+(\.\d+)?,\d+z\/data=!.*/)
  return regex.test(value)
}

export const locationValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  link: yup.string()
    .required('Link is required')
    .test('is-google-maps-link', 'Link must be a valid google maps link', value => testGoogleMapsLink(value)),
  images: yup.mixed<FileList>().nullable()
})
