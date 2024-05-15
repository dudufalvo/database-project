import styles from './statistics.module.scss'
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
import { DropdownOptionType } from 'types/Component';
import { SingleValue, MultiValue } from 'react-select';

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

type TableType = {
  count: number,
  label: string
}

type WaitlistType = {
  waitlist_id: number,
  date: string,
  time: string,
  silence: number,
  client: string
}

const Statistics = () => {
  const [reservedField, setReservedField] = useState<TableType[]>([])
  const [reservedTime, setReservedTime] = useState<TableType[]>([])
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('1week')
  const [waitlist, setWaitlist] = useState<WaitlistType[]>([])

  const handleSelectedOption = (value: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    if (!value) return
    const filteredOption = value as DropdownOptionType

    setSelectedTimePeriod(filteredOption.value)
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/statistics/frequent-field/${selectedTimePeriod}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setReservedField([res.data])
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/statistics/frequent-time/${selectedTimePeriod}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setReservedTime([res.data])
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/waitlist/all`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setWaitlist(res.data)
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })
  }
  , [selectedTimePeriod])
  
  return (
    <div className={styles.main}>
      <div className={styles.table}>
        <span>Statistics</span>
        <SelectDropdown type='select' label='Select Time Period' options={[{ value: '1week', label: '1 Week' }, { value: '1month', label: '1 Month' }, { value: '1year', label: '1 Year' }]} sendOptionsToParent={handleSelectedOption} />
        <div>
          <span>Most Reserved Field</span>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Count</StyledTableCell>
                  <StyledTableCell align="right">Field</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservedField?.map((row) => (
                  <StyledTableRow key={row.count}>
                    <StyledTableCell component="th" scope="row">
                      {row.count}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.label}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div>
          <span>Most Reserved Time</span>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Count</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservedTime?.map((row) => (
                  <StyledTableRow key={row.count}>
                    <StyledTableCell component="th" scope="row">
                      {row.count}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.label}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div>
          <span>Waitlist</span>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                  <StyledTableCell align="right">Client</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {waitlist?.map((row) => (
                  <StyledTableRow key={row.waitlist_id}>
                    <StyledTableCell component="th" scope="row">
                      {row.date}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.time}</StyledTableCell>
                    <StyledTableCell align="right">{row.client}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

export default Statistics
