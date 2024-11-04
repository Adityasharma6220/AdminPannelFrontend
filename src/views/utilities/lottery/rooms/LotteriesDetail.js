import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import {  IconEye } from '@tabler/icons';
import IconButton from '@mui/material/IconButton';
import { Rows, BackendURL } from 'store/constant';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    cursor: 'pointer'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));



const Column = [
    { id: 1, value: 'username', label: 'Username' },
    { id: 2, value: 'mobile', label: 'Mobile' },
    { id: 3, value: 'email', label: 'Email' },
    { id: 4, value: 'lotteryDrawType', label: 'Draw' },
    { id: 4, value: 'lotteryBetValue', label: 'Lottery Bet Value' },
    { id: 4, value: 'lotteryModelType', label: 'Lottery Mode' },
    { id: 4, value: 'isWinner', label: 'Is Winner ?' },
    { id: 5, value: 'action', label: 'Actions' }
  ];
export default function LotteriesDetail({roomId}) {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsperpage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [field, setField] = React.useState('createdDate');
  const [sortby, setSortby] = React.useState(-1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);


  React.useEffect(() => {
    getUserDetails(roomId);
  }, [page, rowsperpage, search, field, sortby]);

  const getUserDetails = async (roomId) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      page: page,
      rowsperpage: rowsperpage,
      search: search,
      field: field,
      sortby: sortby,
      roomId:roomId
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/lottery-rooms/gettingRoomUserDetails`, inputparameters, { headers: headers });
      
      setRows(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const sortingMethod = (columnname) => {
    
    if (columnname !== 'action') {
      setField(columnname);
      setSortby(-sortby); // Toggle between ascending and descending order
    }
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      event.preventDefault();
    }
  };
  return (
    <>
        <Paper>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={6}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 0.3, width: '20%' }
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="Rows"
                defaultValue="10"
                color="success"
                focused
                size="small"
                onChange={(event) => {
                  
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(1);
                }}
              >
                {Rows.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Box>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 0.3, width: '32%' }
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-search"
              label="Search"
              type="search"
              color="success"
              size="small"
              onBlur={(event) => setSearch(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer sx={{ maxHeight: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Column?.map((column) => (
                    <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }} onClick={() => sortingMethod(column.value)}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                
                {rows?.map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <StyledTableCell>{row.username}</StyledTableCell>
                    <StyledTableCell>{row.mobile}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.lotteryDrawType}</StyledTableCell>
                    <StyledTableCell>{row.lotteryBetValue}</StyledTableCell>
                    <StyledTableCell>{row.lotteryModelType}</StyledTableCell>
                    <StyledTableCell>{row.isWinner ? "Yes" : "No" }</StyledTableCell>
                    <StyledTableCell>
                      <IconButton aria-label="fingerprint" color="success">
                        <Link to={`/admin/lottery/rooms/ticket/${row._id}`}>
                          <IconEye />
                        </Link>
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={6}>
            {/* Display total pages or records */}
            <p>Total records: {totalRecords}</p>
          </Grid>
          <Grid item xs={6}>
            {/* Pagination component */}
            <Pagination
              count={totalPages}
              shape="rounded"
              color="success"
              onChange={(event, newPage) => setPage(newPage)}
              style={{ float: 'right' }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    </>
    
  );
}
