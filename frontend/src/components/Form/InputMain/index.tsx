import 'react'

import { useFormContext } from 'react-hook-form'

import type { ReactNode } from 'react'

import styles from './inputMain.module.scss'

interface InputMainProps {
  id: string;
  label?: string;
  helperTxt?: string | ReactNode;
  name: string,
  isRequired?: boolean;
  children: React.ReactNode;
}

const InputMain = ({
  id,
  label,
  helperTxt,
  name,
  isRequired,
  children,
}: InputMainProps) => {
  const { formState: { errors } } = useFormContext()

  return (
    <div className={styles.inputMain}>

      {label && <label htmlFor={id}>
        {label}
        {isRequired && <span className={styles.labelRequired}>*</span>}
      </label>}

      {children}

      {
        (errors[name]?.message || helperTxt) &&
        <div className={styles.helperDiv}>
          {helperTxt && <span className={styles.helperTxt}>{helperTxt}</span>}
          {errors[name]?.message && <span className={styles.errorHelper}>{errors[name]?.message?.toString()}</span>}
        </div>
      }
    </div>
  )
}

export default InputMain
