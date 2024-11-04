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
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { IconTrash, IconEye } from '@tabler/icons';
import IconButton from '@mui/material/IconButton';
import { Rows, BackendURL,AppName } from '../../../store/constant';
import moment from 'moment';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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



export default function TableComponent({
  Column,
  GET_API_URL,
  UPDATE_STATU_URL,
  DELETE_USER_URL,
  VIEW_URL
}) {
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
    document.title = `Version | ${AppName}`
    getVersionMethod();
  }, [page, rowsperpage, search, field, sortby]);

  const getVersionMethod = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      page: page,
      rowsperpage: rowsperpage,
      search: search,
      field: field,
      sortby: sortby
    };

    try {
      let response = await axios.post(`${BackendURL}${GET_API_URL}`, inputparameters, { headers: headers });
      
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



  const DeleteVersion = async (id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      ID: id
    };

    try {
      let response = await axios.post(`${BackendURL}${DELETE_USER_URL}`, inputparameters, { headers: headers });
      
      toast.success("Version is deleted !");
      await getVersionMethod();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      event.preventDefault();
    }
  };

  return (
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
                    <StyledTableCell>{row.versionnumber}</StyledTableCell>
                    <StyledTableCell>{row.url}</StyledTableCell>
                    <StyledTableCell>{moment(row.createdDate).format('DD/MM/YYYY hh:mm A')}</StyledTableCell>
                    <StyledTableCell><IconButton aria-label="fingerprint" color="error" onClick={() => DeleteVersion(row._id)}><IconTrash /></IconButton></StyledTableCell>
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
  );
}
