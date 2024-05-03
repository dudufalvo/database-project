import { Controller, useFormContext } from 'react-hook-form'

import styles from './checkbox.module.scss'

type CheckboxType = {
  name: string,
  label?: string,
}

const Checkbox = ({ name, label }: CheckboxType) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className={styles.checkbox} >
          <label>
            <input type="checkbox" checked={value} onChange={onChange} />
            {label}
          </label>
        </div>
      )}
    />
  )
}

export default Checkbox
