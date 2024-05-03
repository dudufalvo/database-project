import 'react'

import { useFormContext } from 'react-hook-form'
import { BiErrorCircle } from 'react-icons/bi'

import styles from 'components/Form/inputGeral.module.scss'
import InputMain from 'components/Form/InputMain'

interface InputTextAreaProps {
  label?: string;
  placeholder: string;
  rows?: number;
  name: string,
  isRequired?: boolean;
  isDisabled?: boolean;
}
const InputTextArea = ({
  label,
  placeholder,
  rows = 4,
  name,
  isRequired,
  isDisabled,
}: InputTextAreaProps) => {

  const { register, formState: { errors } } = useFormContext()

  return (
    <InputMain label={label} name={name} id={name} isRequired={isRequired}>

      <div className={styles.inputForm}>

        <textarea {...register(name)} id={name} placeholder={placeholder} rows={rows} className={`textarea ${isDisabled ? styles.disabledInput : ''} ${errors[name] ? styles.errorInput : ''}`}/>
        
        {errors[name] && <BiErrorCircle className={styles.errorIcon} />}
        
      </div>
    </InputMain>

  )
}

export default InputTextArea
