import React,{useState,useEffect} from 'react'
import { BackendURL } from 'store/constant';
import axios from 'axios';
import { MenuItem, Grid, TextField, Select,FormControl, Button, IconButton,   Collapse,Divider } from '@mui/material';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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
        { id: 1, value: '', label: '' },
        { id: 1, value: 'name', label: 'Name' },
        { id: 4, value: 'totalUsers', label: 'Total Users' },
        { id: 3, value: 'totalGamePlay', label: 'Total Game Play' },
        { id: 6, value: 'TotalBetValue', label: 'Total Bet Amount' },
        { id: 7, value: 'TotalWin', label: 'Total Win Amount' },
        { id: 2, value: 'GGR', label: 'GGR' },
      ];

        // Function to get the default start date (first day of last month)
  const getDefaultStartDate = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return formatDate(lastMonth);
  };

  // Function to format date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(formatDate(new Date())); // Current date
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin,setSelectedAdmin] = useState("0")
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
      const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsperpage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [field, setField] = React.useState('name');
  const [sortby, setSortby] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [openRowId, setOpenRowId] = useState(null);
  const [subTable,setSubTable] = useState([]);
    
      useEffect(()=>{
        getUserDetails();
        gettingListOfAdmin();
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
            fromDate:startDate,
            toDate:endDate,
            id:selectedAdmin
        };
    
        try {
          let response = await axios.post(`${BackendURL}reporting/getAgentWiseReporting`, inputparameters, { headers: headers });
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
       //Getting admin list for filter
  const gettingListOfAdmin = async () => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
  
      const inputParameters = {
        type:"AGENT"
      };
  
      try {
        const response = await axios.post( `${BackendURL}reporting/gettingListForFilters`,inputParameters,{ headers });
        setAdminList(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching user details:", error);
      }
  }

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

      const handleRowToggle = async(rowId) => {
        
        setOpenRowId(openRowId === rowId ? null : rowId);
    
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
      
          const inputParameters = {_id:rowId,fromDate:"",toDate:""};
      
          try {
            const response = await axios.post(`${BackendURL}reporting/gettingAdminsInnerUserReporting`, inputParameters,{ headers });
            setSubTable(response.data.data);
            // setTotalPages(response.data.pagination.totalPages);
            // setTotalRecords(response.data.totalRecords);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("token");
              navigate("/login");
            }
            console.error("Error fetching user details:", error);
          }
    
      };

      const handleChangeAdmin = (e) => {
        setSelectedAdmin(e.target.value)
      }
    
      const handleApplyFilters = async() => {
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
              fromDate:startDate,
              toDate:endDate,
              id:selectedAdmin
          };
      
          try {
            let response = await axios.post(`${BackendURL}reporting/getAgentWiseReporting`, inputparameters, { headers: headers });
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
      }
    
      const handleResetFilters = async() => {
        setStartDate(getDefaultStartDate());
        setEndDate(formatDate(new Date())); 
        setSelectedAdmin("0")
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
              fromDate:getDefaultStartDate(),
              toDate:formatDate(new Date()),
              id:"0"
          };
      
          try {
            let response = await axios.post(`${BackendURL}reporting/getAgentWiseReporting`, inputparameters, { headers: headers });
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
      }

  return (
    <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
      <MainCard title="Agent Report" xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#fffff' }}>
          <Grid container spacing={2} alignItems="center">
          {/* Date Filters */}
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  id="start-date"
                  label="From Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="end-date"
                  label="To Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Search Field */}
          <Grid item xs={12} sm={4}>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 0.3, width: '100%' } }}
              noValidate
              autoComplete="off"
            >
                <FormControl fullWidth>
              <Select id="reporting-type" value={selectedAdmin} onChange={handleChangeAdmin}>
                      <MenuItem value="0">--Select Agent--</MenuItem>
                      {
                        adminList.map((el)=>(
                            <MenuItem key={el._id} value={el._id}>{el.name}</MenuItem>

                        ))
                      }
                    </Select>
                    </FormControl>
            </Box>
          </Grid>

          {/* Apply Filters Button */}
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              fullWidth
            >
              Apply Filters
            </Button>
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={6} sm={2}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Divider />
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
                    <React.Fragment key={row._id}>
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <StyledTableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => handleRowToggle(row._id)}>
                          {openRowId === row._id ? (<KeyboardArrowUpIcon /> ) : (<KeyboardArrowDownIcon />)}
                        </IconButton>
                      </StyledTableCell>
                    <StyledTableCell>{row?.name}</StyledTableCell>
                    <StyledTableCell>{row?.totalUsers}</StyledTableCell>
                    <StyledTableCell>{row?.totalGamePlay}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.totalBetAmount) % 1 === 0) ? row?.totalBetAmount.toFixed(2) : (Math.floor(row?.totalBetAmount)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.totalWinningAmount) % 1 === 0) ? row?.totalWinningAmount.toFixed(2) : (Math.floor(row?.totalWinningAmount)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.GGR) % 1 === 0) ? row?.GGR.toFixed(2) : (Math.floor(row?.GGR)).toFixed(2)}</StyledTableCell>
                    
                  </StyledTableRow>
                  <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}colSpan={6}>
                        <Collapse in={openRowId === row._id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell align="right">Total Users</TableCell>
                                  <TableCell align="right">Total Game Play</TableCell>
                                  <TableCell align="right">Total Bet Amount</TableCell>
                                  <TableCell align="right">Total Winning Amount</TableCell>
                                  <TableCell align="right">GGR</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subTable?.map((row) => (
                                  <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell align="right">{row.totalUsers}</TableCell>
                                    <TableCell align="right">{row.totalGamePlay}</TableCell>
                                    <StyledTableCell align="right">{Math.floor(row?.totalBetAmount) % 1 === 0? row?.totalBetAmount.toFixed(2): Math.floor(row?.totalBetAmount).toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="right">{Math.floor(row?.totalWinningAmount) % 1 ===0? row?.totalWinningAmount.toFixed(2): Math.floor(row?.totalWinningAmount).toFixed(2 )}</StyledTableCell>
                                    <StyledTableCell align="right">{Math.floor(row?.GGR) % 1 === 0? row?.GGR.toFixed(2): Math.floor(row?.GGR).toFixed(2)}</StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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