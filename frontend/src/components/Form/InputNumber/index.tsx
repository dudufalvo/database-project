import styles from './inputnumber.module.scss'

type InputNumberType = {
  valueDisabled?: boolean,
  inputValue: number | undefined,
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputNumber = ({ valueDisabled, inputValue, handleInputChange }: InputNumberType) => {
  return (
    <div className={`${styles.inlineInput} ${valueDisabled && styles.valueDisabled}`}>
      €
      <input type='number' step='0.1' placeholder='00.00' disabled={valueDisabled} value={inputValue} onChange={handleInputChange} />
    </div>
  )
}

export default InputNumber
