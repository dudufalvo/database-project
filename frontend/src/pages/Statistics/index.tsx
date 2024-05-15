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
import { ChangeEvent, useEffect, useState } from 'react'
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

type TableSimpleType = {
  label: string
}



const Statistics = () => {
  const [reservedField, setReservedField] = useState<TableType[]>([])
  const [reservedTime, setReservedTime] = useState<TableType[]>([])
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('1week')
  const [selectedFilterType, setSelectedFilterType] = useState<string>('day')
  const [selectedFilter, setSelectedFilter] = useState<string>('null')
  const [unusedFields, setUnusedFields] = useState<TableSimpleType[]>([]);

  console.log(selectedTimePeriod)

  const handleSelectedOption = (value: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    if (!value) return
    const filteredOption = value as DropdownOptionType

    setSelectedTimePeriod(filteredOption.value)
  }

  const handleSelectedFilterType = (value: ChangeEvent<HTMLSelectElement>) => {
    if (!value) return
    const filteredOption = value as ChangeEvent<HTMLSelectElement>
    
    setSelectedFilterType(filteredOption.target.value)
  }

  const handleSelectedFilter = (value: ChangeEvent<HTMLInputElement>) => {
    if (!value) return
    const filteredOption = value as ChangeEvent<HTMLInputElement>
    
    setSelectedFilter(filteredOption.target.value)
  }

  const renderFilter = (selectedFilterType: string) => {
    if(selectedFilterType === 'day') {
      return(
        <input type="date" onChange={handleSelectedFilter}/> 
      )
    } else if(selectedFilterType === 'month') {
      return(
        <input type="month" onChange={handleSelectedFilter}/>  
      )
    }
    else {
      return(
        <input type="number" onChange={handleSelectedFilter}/> 
      )
    }
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/statistics/frequent-field/${selectedTimePeriod}`)
      .then((response) => {
        console.log(response.data)
        setReservedField([response.data])
        toast.success('Fetched reserved field statistics')
      })
      .catch(() => {
        toast.error('Error fetching reserved field statistics')
      })

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/statistics/frequent-time/${selectedTimePeriod}`)
      .then((response) => {
        setReservedTime([response.data])
      })
      .catch(() => {
        toast.error('Error fetching reserved time statistics')
      })
  }
  , [selectedTimePeriod])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/fields/unused/${selectedFilterType}/${selectedFilter}`)
    .then((response) => {
      console.log(response.data)
      setUnusedFields(response.data)
      toast.success('Fetched reserved field statistics')
    })
    .catch(() => {
      toast.error('Error fetching reserved field statistics')
    })

  }, [selectedFilter])
  
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
                {reservedField.map((row) => (
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
                {reservedTime.map((row) => (
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
                  <StyledTableCell>Count</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservedTime.map((row) => (
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

        <div className={styles.specificStatisticsFilterDiv}>
          <select onChange={handleSelectedFilterType}>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          {renderFilter(selectedFilterType)}
        </div>

        <div>
          <span>Unused Fields</span>
          { unusedFields.length >= 0 &&
                      <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Field</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {unusedFields.map((row) => (
                            <StyledTableRow key={row.label}>
                              <StyledTableCell align="left">{row.label}</StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
          }
        </div>

      </div>
    </div>
  )
}

export default Statistics
