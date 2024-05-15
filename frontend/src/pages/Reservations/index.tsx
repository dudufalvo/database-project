import styles from './reservations.module.scss'
import * as yup from 'yup'
import axios from 'axios'
import toast from 'utils/toast'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react'
import SelectDropdown from 'components/SelectDropdown';
import { SingleValue, MultiValue } from 'react-select'
import { DropdownOptionType } from 'types/Component'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type TableCheckboxType = {
  mock_field_id: number,
  mock_price_id: number,
  mock_initial_time: string,
  mock_date: string,
  reservation_field_id?: number,
  reservation_initial_time?: string,
  reservation_date?: string
}

type TableMessageType = {
  price_id: number,
  field_id: number,
  field_name: string,
  initial_time: string,
  end_time: string,
  price_value: number,
}

type ReservationsType = {
  date: string,
  field_id: number,
  initial_time: string,
  reservation_id: number
}

type FieldsType = {
  field_id: number,
  name: string,
  available: boolean,
}

type PricesType = {
  price_id: number,
  price_type: string,
  price_value: number
}

type WaitlistType = {
  waitlist_id: number,
  interested_time: string,
  silence: boolean
}

const Reservations = () => {
  const [reservations, setReservations] = useState<ReservationsType[]>([])
  const [prices, setPrices] = useState<PricesType[]>([])
  const [fields, setFields] = useState<FieldsType[]>([])
  const [selectedField, setSelectedField] = useState<DropdownOptionType | null>({ label: 'All', value: '0' });
  const [selectedDate, setSelectedDate] = useState<DropdownOptionType>({ label: new Date().toDateString(), value: new Date().toISOString().split('T')[0] });
  const [selectedTime, setSelectedTime] = useState<DropdownOptionType | null>({ label: 'All', value: '0' });
  const [waitlist, setWaitlist] = useState<WaitlistType[]>([])

  const reservationsRows: TableMessageType[][] =  fields.map(field => {
    return prices.map(price => {
      return {
        price_id: price.price_id,
        field_id: field.field_id,
        field_name: field.name,
        initial_time: price.price_type.replace('FIM_SEMANA', 'FSEMANA').split('_')[1],
        end_time: price.price_type.replace('FIM_SEMANA', 'FSEMANA').split('_')[2],
        price_value: price.price_value
      }
    })
  })

  const dataOptions = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    // push in the format label and value, being label the date and value the date in the format yyyy-mm-dd
    dataOptions.push({ label: date.toDateString(), value: date.toISOString().split('T')[0] })
  }

  // get the different times in prices to show in the dropdown
  const timeOptions = prices.map(price => {
    return { value: price.price_type.replace('FIM_SEMANA', 'FSEMANA').split('_')[1], label: price.price_type.replace('FIM_SEMANA', 'FSEMANA').split('_')[1] + ' - ' + price.price_type.replace('FIM_SEMANA', 'FSEMANA').split('_')[2] }
  })
  timeOptions.unshift({ value: '0', label: 'All' })

  const fieldsOptions = fields.map(field => {
    return { value: field.field_id.toString(), label: field.name }
  })
  fieldsOptions.unshift({ value: '0', label: 'All' })

  const handleSelectedField = (value: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    if (!value) return
    const filteredField = value as DropdownOptionType

    setSelectedField(filteredField)
  }

  const handleSelectedDate = (value: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    if (!value) return
    const filteredDate = value as DropdownOptionType

    // clear reservations when changing date
    setReservations([])

    setSelectedDate(filteredDate)
  }

  const handleSelectedTime = (value: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    if (!value) return
    const filteredTime = value as DropdownOptionType

    setSelectedTime(filteredTime)
  }

  const handleCreateReservation = (values: any) => {
    const [hours, minutes] = values.initial_time.split('H');
    const initial_time = `${values.date} ${hours}:${minutes}:00`
    const end_time_timestamp = new Date(new Date(initial_time).getTime() + (2 * 60 * 60 * 1000) + (30 * 60 * 1000));
    const end_time = end_time_timestamp.toISOString().slice(0, 19).replace('T', ' ');

    const data = {
      fields_id: values.field_id,
      price_id: values.price_id,
      initial_time: initial_time,
      end_time: end_time
    }

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/reservations/create`, { data: data }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        toast.success('Reservation created successfully')
        setTimeout(() => {
          window.location.reload()
        }
        , 1000)
      })
      .catch(() => {
        toast.error('Failed to create reservation')
      })
  }

  const handleCreateWaitlist = (values: any) => {
    // create a timestamp with the values.date and values.initial_time like '2021-10-10 10:00:00'
    const interested_time = `${values.date} ${values.initial_time.split('H').join(':')}:00`

    const data = {
      silence: false,
      interested_time: interested_time
    }

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/waitlist/create`, { data: data }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        toast.success('Waitlist created successfully')
        setTimeout(() => {
          window.location.reload()
        }
        , 1000)
      })
      .catch((response) => {
        console.log(response)
        toast.error(response.response.data.error)
      })
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservations/date/${selectedDate?.value}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setReservations(response.data)
      })
      .catch(() => {
        toast.error('Failed to fetch reservations')
      })
  }, [selectedDate])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/fields`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setFields(response.data)
      })
      .catch(() => {
        toast.error('Failed to fetch fields')
      })
  }, [])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/prices/active/${selectedDate?.value}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setPrices(response.data)
      })
      .catch(() => {
        toast.error('Failed to fetch prices')
      })
  }
  , [selectedDate])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/waitlist`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setWaitlist(response.data)
      })
      .catch(() => {
        toast.error('Failed to fetch waitlist')
      })
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.table}>
        <span>Reservations</span>

        <div>
          <SelectDropdown type='select' sendOptionsToParent={handleSelectedField} /* defaultOption={fieldsOptions[0]} */ options={fieldsOptions} label='Field' name='field' />
          <SelectDropdown type='select' sendOptionsToParent={handleSelectedDate} /* defaultOption={dataOptions[0]} */ options={dataOptions} label='Date' name='date' />
          <SelectDropdown type='select' sendOptionsToParent={handleSelectedTime} /* defaultOption={dataOptions[0]} */ options={timeOptions} label='Time' name='time' />
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell align="right">Field Name</StyledTableCell>
                <StyledTableCell align="right">Start Time</StyledTableCell>
                <StyledTableCell align="right">End Time</StyledTableCell>
                <StyledTableCell align="right">Price Value</StyledTableCell>
                <StyledTableCell align="right">Reserve</StyledTableCell>
                <StyledTableCell align="right">Waitlist</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
              reservationsRows?.map((row) => (
                row.filter(row => row.field_name === selectedField?.label || selectedField?.label === 'All').filter(row => row.initial_time === selectedTime?.value || selectedTime?.label === 'All').map((row) => {
                  const values = {
                    field_id: row.field_id,
                    price_id: row.price_id,
                    initial_time: row.initial_time,
                    date: selectedDate?.value
                  }

                  return (
                  <StyledTableRow key={row.price_id}>
                      <StyledTableCell component="th" scope="row">
                        {selectedDate.label}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.field_name}</StyledTableCell>
                      <StyledTableCell align="right">{row.initial_time}</StyledTableCell>
                      <StyledTableCell align="right">{row.end_time}</StyledTableCell>
                      <StyledTableCell align="right">{row.price_value}</StyledTableCell>
                      <StyledTableCell align="right">
                        <input type='checkbox' checked={
                          reservations.length ? reservations.map(reservation => {
                            return (reservation.field_id === row.field_id && reservation.initial_time === row.initial_time && reservation.date === selectedDate.value)
                          }
                          ).includes(true) : false} disabled={
                          reservations.length ? reservations.map(reservation => {
                            return (reservation.field_id === row.field_id && reservation.initial_time === row.initial_time && reservation.date === selectedDate.value)
                          }
                          ).includes(true) : false}
                          
                          onChange={() => handleCreateReservation(values)} />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <input type='checkbox' checked={waitlist.map(waitlist => {
                          // convert waitlist.interested_time to the format yyyy-mm-dd hh:mm:ss in two variables
                          const [date, time] = new Date(waitlist.interested_time).toISOString().split('T')
                          // convert the time to the format hhHmm
                          const interested_time = time.split(':').slice(0, 2).join('H')
                          // check if the waitlist is for the same field, initial_time and date
                          console.log(interested_time, `${selectedDate.value} ${interested_time}`)
                          return (date === selectedDate.value && interested_time === row.initial_time)
                        }
                        ).includes(true)} disabled={waitlist.map(waitlist => {
                          // convert waitlist.interested_time to the format yyyy-mm-dd hh:mm:ss in two variables
                          const [date, time] = new Date(waitlist.interested_time).toISOString().split('T')
                          // convert the time to the format hhHmm
                          const interested_time = time.split(':').slice(0, 2).join('H')
                          // check if the waitlist is for the same field, initial_time and date
                          return (date === selectedDate.value && interested_time === row.initial_time)
                        }
                        ).includes(true)} onChange={() => handleCreateWaitlist(values)} />
                      </StyledTableCell>
                    </StyledTableRow>
                )})
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Reservations
