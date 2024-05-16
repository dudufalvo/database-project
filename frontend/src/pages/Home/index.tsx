import styles from './home.module.scss'
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

type TableMessageType = {
  reservation_id: number;
  date: string;
  initial_time: string;
  end_time: string;
  price: string;
  field: string;
  cancelled: boolean;
}

type TableCheckboxType = {
  reservation_id: number;
  cancelled: boolean;
}

const TableCheckbox = ({ reservation_id, cancelled }: TableCheckboxType) => {
  const handleChange = () => {
    const data = {
      reservation_id: reservation_id,
      cancelled: !cancelled
    }
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/reservations/${reservation_id}/cancel`, { data: data } ,{ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        toast.success('Reservation cancelled successfully');
      })
      .catch((response) => {
        console.log(response)
        toast.error('Error cancelling reservation');
      })
  }

  return (
    <input type='checkbox' defaultChecked={cancelled} disabled={cancelled} onChange={handleChange} />
  )
}
const Home = () => {
  const [futureReservations, setFutureReservations] = useState<TableMessageType[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservations/future`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
    
        setFutureReservations(response.data);
      })
      .catch(() => {
        toast.error('Error getting future reservations');
      })
  }
  , [])

  return (
    <div className={styles.main}>
      <div className={styles.table}>
        <span>Home</span>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Reservation ID</StyledTableCell>
                <StyledTableCell align="right">Field</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">Initial Time</StyledTableCell>
                <StyledTableCell align="right">End Time</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Cancel</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {futureReservations.map((row) => (
                <StyledTableRow key={row.reservation_id}>
                  <StyledTableCell component="th" scope="row">
                    {row.reservation_id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.field}</StyledTableCell>
                  <StyledTableCell align="right">{row.date}</StyledTableCell>
                  <StyledTableCell align="right">{row.initial_time}</StyledTableCell>
                  <StyledTableCell align="right">{row.end_time}</StyledTableCell>
                  <StyledTableCell align="right">{row.price}</StyledTableCell>
                  <StyledTableCell align="right">{<TableCheckbox reservation_id={row.reservation_id} cancelled={row.cancelled}/>}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Home
