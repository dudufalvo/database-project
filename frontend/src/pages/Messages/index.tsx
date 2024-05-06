import styles from './messages.module.scss'
import InputText from 'components/Form/InputText'
import InputTextArea from 'components/Form/InputTextArea'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/Button'
import * as yup from 'yup'

type MessageType = {
  title: string;
  email: string;
  message: string;
}

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  email: yup.string().required('Email is required'),
  message: yup.string().required('Message is required')
})

const Messages = () => {
  const methods = useForm<MessageType>({
    resolver: yupResolver(validationSchema)
  })

  const handleSendMessage = (data: MessageType) => {
    console.log(data)
  }

  return (
    <div className={styles.main}>
      <div className={styles.table}>
        <span>Messages</span>

        <div className={styles.forms}>
          <FormProvider {...methods}>
            <form className={styles.reviewModal}>
              <InputText label='Title' name='title' id='title' placeholder='Enter the title of the message' isRequired={true} />
              <InputText label='Email' name='email' id='email' placeholder="Enter the emails separated by a comma or 'all.clients@gmail.com' to send to all clients" isRequired={true} />
              <InputTextArea label='Write your message' name='message' placeholder='Write something here' isRequired={true} />
              <Button type='submit' variant='filled' fullWidth handle={methods.handleSubmit(handleSendMessage)}>Send Message</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default Messages
