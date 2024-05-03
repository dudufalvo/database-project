import 'react'

import { useFormContext } from 'react-hook-form'
import { BiErrorCircle } from 'react-icons/bi'

import type { ReactNode } from 'react'

import styles from 'components/Form/inputGeral.module.scss'
import InputMain from 'components/Form/InputMain'

interface InputTextProps {
  type?: string;
  id: string;
  helperTxt?: string | ReactNode;
  label?: string;
  placeholder: string;
  name: string,
  isRequired?: boolean;
  isDisabled?: boolean;
}

const InputText = ({
  type = 'text',
  id,
  label,
  helperTxt,
  placeholder,
  name,
  isRequired,
  isDisabled,
}: InputTextProps) => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <InputMain label={label} helperTxt={helperTxt} name={name} id={name} isRequired={isRequired}>
      <div className={styles.inputForm}>
        <input {...register(name)} type={type} id={id} placeholder={placeholder} className={`${isDisabled ? styles.disabledInput : ''} ${errors[name] ? styles.errorInput : ''}`} />
        {errors[name] && <BiErrorCircle className={styles.errorIcon} />}
      </div>
    </InputMain>
  )
}

export default InputText
