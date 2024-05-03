import 'react'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

import styles from 'components/Form/inputGeral.module.scss'
import InputMain from 'components/Form/InputMain'

interface InputPasswordProps {
  id: string;
  label?: string;
  placeholder: string;
  name: string,
  isRequired?: boolean;
  isDisabled?: boolean;
}

const InputPassword = ({
  id,
  label,
  placeholder,
  name,
  isRequired,
  isDisabled,
}: InputPasswordProps) => {
  const { register, formState: { errors } } = useFormContext()

  const [isPassVisible, setIsPassVisible] = useState(false)

  const inputType = isPassVisible ? 'text' : 'password'

  return (
    <InputMain label={label} name={name} id={name} isRequired={isRequired}>
      <div className={styles.inputForm}>

        <input {...register(name)} type={inputType} id={id} placeholder={placeholder} className={`${isDisabled ? styles.disabledInput : ''} ${errors[name] ? styles.errorInput : ''}`} />

        <span role="button" onClick={() => setIsPassVisible(!isPassVisible)}>
          {isPassVisible ? (
            <AiOutlineEye className={`${styles.passwordIcon} ${errors[name] ? styles.passwordIconError : ''}`} />
          ) : (
            <AiOutlineEyeInvisible className={`${styles.passwordIcon} ${errors[name] ? styles.passwordIconError : ''}`} />
          )}
        </span>

      </div>
    </InputMain>
  )
}

export default InputPassword
