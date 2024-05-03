import 'react'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import { useState } from 'react'
import DatePicker from 'react-date-picker'
import { useFormContext } from 'react-hook-form'
import { BiCalendar, BiTimeFive, BiX } from 'react-icons/bi'
import TimePicker from 'react-time-picker'

import './calendar.scss'

import InputMain from '../InputMain'

import Button from 'components/Button'

type Value = Date | null;

interface DateTimePickerProps {
  id: string;
  name: string;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInline?: boolean;
  isPoll?: boolean;
  onDateAdded: (date: string) => void;
  onDateRemoved: (date: string) => void;
}

const DateTimePickerForm = ({
  id,
  name,
  label,
  isDisabled = false,
  isRequired,
  isInline = true,
  onDateAdded,
  onDateRemoved,
  isPoll = false
}: DateTimePickerProps) => {
  const [valueDate, setValueDate] = useState<Value>(new Date())
  const [valueTime, setValueTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const [readOnlyValues, setReadOnlyValues] = useState<{ valueDateTime: string }[]>([])

  const { setValue, formState: { errors } } = useFormContext()

  const handleAddDateTime = () => {
    if (!valueDate) return
    const isoDateTime = new Date(valueDate.getTime() - (valueDate.getTimezoneOffset() * 60000)).toISOString()
    // eslint-disable-next-line prefer-destructuring
    const formattedDate = isoDateTime.split('T')[0]
    const combinedDateTime = `${formattedDate}T${valueTime}:00.000Z`

    if (readOnlyValues.some(item => item.valueDateTime === combinedDateTime)) return

    setValue(name, combinedDateTime)
    setReadOnlyValues([...readOnlyValues, { valueDateTime: combinedDateTime }])
    onDateAdded(combinedDateTime)
  }

  const handleRemove = (indexToRemove: number) => {
    setReadOnlyValues(readOnlyValues.filter((_, index) => index !== indexToRemove))
    onDateRemoved(readOnlyValues[indexToRemove].valueDateTime)
  }

  return (
    <InputMain id={id} name={name} label={label} isRequired={isRequired}>
      <div className='date-time-picker-container'>
        <div className='date-time-picker-change-top'>
          <div className={`${isInline ? 'isInlinePicker' : 'isNotInlinePicker'}`}>
            <DatePicker
              onChange={newDate => setValueDate(newDate as Value)}
              value={valueDate} calendarIcon={<BiCalendar />}
              clearIcon={null} disabled={isDisabled}
              className={`datePickerMain ${errors[name] ? 'errorInputPicker' : ''} `}
              calendarClassName='calendarPickerMain' tileClassName='calendarDatePicker'
            />
            <TimePicker
              onChange={newTime => setValueTime(newTime as string)}
              value={valueTime} clockIcon={<BiTimeFive />}
              clearIcon={null}
              disabled={isDisabled}
              className={`timePickerMain ${errors[name] ? 'errorInputPicker' : ''} `} clockClassName='clockPickerMain'
            />
          </div>
          <Button handle={() => handleAddDateTime()}>Add</Button>
        </div>
        {!isPoll && readOnlyValues.map((readOnlyValue, index) => (
          <div key={index} className='readOnlyDatePickerContainer'>
            <div className='readOnlyDateTime'>
              <span>
                {`${readOnlyValue.valueDateTime.split('T')[0].split('-').reverse().join('-')} - ${readOnlyValue.valueDateTime.split('T')[1].slice(0, 5)}`}
              </span>
            </div>
            <Button handle={() => handleRemove(index)}><BiX /></Button>
          </div>
        ))}
      </div>
    </InputMain>
  )
}

export default DateTimePickerForm
