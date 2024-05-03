import 'react'

import { Controller, useFormContext } from 'react-hook-form'

import InputMain from 'components/Form/InputMain'
import Rating from 'components/Rating'

interface InputRateProps {
  id: string;
  label?: string;
  name: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

const InputRate = ({
  label,
  name,
  isRequired,
}: InputRateProps) => {
  const { control } = useFormContext()

  return (
    <InputMain label={label} name={name} id={name} isRequired={isRequired}>
      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={({ field: { value, onChange } }) => <Rating rating={value} onChangeRating={onChange} />}
      />
    </InputMain>
  )
}

export default InputRate
