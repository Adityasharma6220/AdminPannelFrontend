import React,{useState,useEffect} from 'react'
import { BackendURL } from 'store/constant';
import axios from 'axios';
import { MenuItem, Grid, TextField, CardContent, Button, Stack, Chip,Divider } from '@mui/material';
import { IconTrash, IconArrowLeft } from '@tabler/icons';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

import { useParams,useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import moment from 'moment';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing,Rows } from 'store/constant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';

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

const AgentReporting = () => {
    const navigate = useNavigate();
    const Column = [
        { id: 1, value: 'name', label: 'Name' },
        { id: 4, value: 'totalUsers', label: 'Total Users' },
        { id: 3, value: 'totalGamePlay', label: 'Total Game Play' },
        { id: 6, value: 'TotalBetValue', label: 'Total Bet Amount' },
        { id: 7, value: 'TotalWin', label: 'Total Win Amount' },
        { id: 2, value: 'GGR', label: 'GGR' },
      ];

      const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsperpage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [field, setField] = React.useState('name');
  const [sortby, setSortby] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
    
      useEffect(()=>{
        getUserDetails()
      },[page, rowsperpage, search, field, sortby])
    
      const getUserDetails = async () => {
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
        };
    
        try {
          let response = await axios.post(`${BackendURL}reporting/getOperatorWiseReporting`, inputparameters, { headers: headers });
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
    <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
      <MainCard title="Operator Report" xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#fffff' }}>
            {/* ============Table============ */}
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

<Grid item xs={12} style={{marginTop:"25px"}}>
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
                    <StyledTableCell>{row?.name}</StyledTableCell>
                    <StyledTableCell>{row?.totalUsers}</StyledTableCell>
                    <StyledTableCell>{row?.totalGamePlay}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.totalBetAmount) % 1 === 0) ? row?.totalBetAmount.toFixed(2) : (Math.floor(row?.totalBetAmount)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.totalWinningAmount) % 1 === 0) ? row?.totalWinningAmount.toFixed(2) : (Math.floor(row?.totalWinningAmount)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.GGR) % 1 === 0) ? row?.GGR.toFixed(2) : (Math.floor(row?.GGR)).toFixed(2)}</StyledTableCell>
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
            </Box>
        </Box>
      </MainCard>
    </Grid>
  </Grid>
  )
}

export default AgentReporting