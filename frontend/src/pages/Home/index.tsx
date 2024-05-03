import './home.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

type SoilDataType = {
  soil_data_id: string,
  moisture: string,
  date: string,
  time: string,
  node: string
}

type FetchDataType = {
  soil_data_id: string,
  moisture: string,
  timestamp: string,
  node: string
}

const converTimeStamp = (timestamp: string) => {
  // split time stamp in date and time
  const date = timestamp.split('T')[0];
  const time = timestamp.split('T')[1].split('.')[0];
  return {date, time};
}

const Home = () => {
  const [data, setData] = useState<SoilDataType[]>([]);

  useEffect(() => {
    axios.get('http://soilsense.pythonanywhere.com/api/soil-data/')
    .then((response) => {
      const data = response.data;
      const soilData = data.map((item: FetchDataType) => {
        const {date, time} = converTimeStamp(item.timestamp);
        return {
          soil_data_id: item.soil_data_id,
          moisture: item.moisture,
          date: date,
          time: time,
          node: item.node
        }
      });
      setData(soilData);
    }
    )
    .catch((error) => {
      console.log(error);
    });
  }
  , []);

  return (
    <div className='main'>
      <Navbar />
      <div className='table'>
        <span>Latest Soil Data</span>
    
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Soil Data (ID)</StyledTableCell>
            <StyledTableCell align="right">Moisture</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Time</StyledTableCell>
            <StyledTableCell align="right">Node (ID)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.soil_data_id}>
              <StyledTableCell component="th" scope="row">
                {row.soil_data_id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.moisture}</StyledTableCell>
              <StyledTableCell align="right">{row.date}</StyledTableCell>
              <StyledTableCell align="right">{row.time}</StyledTableCell>
              <StyledTableCell align="right">{row.node}</StyledTableCell>
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
