import * as React from 'react';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import {
  Paper, Box, TextField, MenuItem, Grid, Pagination, Chip, Table, TableBody, TableContainer, TableHead,
  TableRow, CircularProgress,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useTranslation } from 'react-i18next';
import { Rows, BackendURL } from '../../../store/constant';
import { Link, useNavigate } from 'react-router-dom';

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

const status = [
  { value: 'today', label: 'Today', action: 'setToday' },
  { value: 'yesterday', label: 'Yesterday', action: 'setYesterday' },
  { value: 'lastTwoDays', label: 'Last Two Days', action: 'setLastTwoDays' },
  { value: 'lastWeek', label: 'Last Week', action: 'setLastWeek' },
  { value: 'thisMonth', label: 'This Month', action: 'setThisMonth' },
  { value: 'lastMonth', label: 'Last Month', action: 'setLastMonth' },
  // { value: 'all', label: 'All', action: 'setAll' },
];

export default function TableComponent({
  Column,
  GET_API_URL,
  UPDATE_STATU_URL,
  DELETE_USER_URL,
  STATUS_UPDATE_MSG_TRUE,
  STATUS_UPDATE_MSG_FALSE,
  DELETE_USER_STATUS,
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
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation()
  const [value, setValue] = React.useState('today');

   // Function to format date as "YYYY-MM-DD"
   const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to get the default start date (first day of last month)
  const getDefaultStartDate = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // console.log('lastMonth -', lastMonth)
    return formatDate(lastMonth);
  };

  const [startDate, setStartDate] = React.useState(getDefaultStartDate());
  const [endDate, setEndDate] = React.useState(formatDate(new Date())); // Current date

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  React.useEffect(() => {
    getUserDetails(startDate, endDate);
  }, [startDate, endDate, page, rowsperpage, search, field, sortby]);

  // console.log('Fetching data with filters:', { startDate, endDate, page, rowsperpage, search, field, sortby });
  const getUserDetails = async (startDate, endDate) => {
    // console.log('API Call with:', { startDate, endDate });
    setLoading(true)  // before fetch the data
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
      fromDate: startDate,
      toDate: endDate
    };

    try {
      let response = await axios.post(`${BackendURL}${GET_API_URL}`, inputparameters, { headers: headers });
      // console.log('input parameters:- ', inputparameters)
      setRows(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false) // After fetched the data
    }
  };

  const sortingMethod = (columnname) => {

    if (columnname !== 'action') {
      setField(columnname);
      //console.log(setField(columnname)) // undefined
      setSortby(-sortby); // Toggle between ascending and descending order
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      event.preventDefault();
    }
  };

  // Date Filter Functions
  const setDateRange = (days) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - days);

    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
  };

  const setToday = () => {
    const today = new Date();
    setStartDate(formatDate(today));
    setEndDate(formatDate(today));
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setStartDate(formatDate(yesterday));
    setEndDate(formatDate(yesterday));
  };

  const setLastWeek = () => {
    setDateRange(7);
  };

  const setLastTwoDays = () => {
    setDateRange(2);
  };

  const setThisMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    setStartDate(formatDate(lastMonth));
    setEndDate(formatDate(endOfLastMonth));
  };

  // const setAll = () => {
  //   setStartDate('');
  //   setEndDate('');
  // };

  React.useEffect(() => {
    switch (value) {
      case 'today':
        setToday();
        break;
      case 'yesterday':
        setYesterday();
        break;
      case 'lastWeek':
        setLastWeek();
        break;
      case 'lastTwoDays':
        setLastTwoDays();
        break;
      case 'thisMonth':
        setThisMonth();
        break;
      case 'lastMonth':
        setLastMonth();
        break;
        // case 'all':
        //   setAll();
        //   break;
      default:
        break;
    }
  }, [value]);

  // console.log('rows', rows)

  return (
    <Paper>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">

        <Grid item xs={2}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 0.3, width: '50%' }
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

        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* =========Date Filter======= */}
          <Grid
            container
            spacing={2}
            // alignItems="center"
            // justifyContent="flex-center"

            sx={{ pb: 0.25, margin: '0 auto' }}
          >
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

        </Grid>

        <Grid item xs={2} textAlign="right">
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 0.3, width: '50%' }
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
                {
                  loading ?
                    (
                      <TableRow>
                        <TableCell colSpan={Column.length}> {/* colspan should match the number of columns */}
                          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                            <CircularProgress color="success" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows?.map((row) =>  (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                          <StyledTableCell>
                            <Link to={`/admin/users/view/${row.userId}`}>{row.userDetails.userId}</Link>
                          </StyledTableCell>
                          <StyledTableCell>{row.transactionId}</StyledTableCell>
                          <StyledTableCell>
                            {row.transactionType === 'credit' ? (
                              <Chip label="Credit" color="success" size="small" />
                            ) : (
                              <Chip label="Debit" color="error" size="small" />
                            )}
                          </StyledTableCell>
                          <StyledTableCell>{row.operation}</StyledTableCell>
                          {row.transactionType === 'debit' ? (
                            <StyledTableCell color="error">
                              <span style={{ color: 'red' }}>- {row.amount}</span>
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell>
                              <span style={{ color: 'green' }}> + {row.amount}</span>
                            </StyledTableCell>
                          )}
                          <StyledTableCell>{row.balance}</StyledTableCell>
                          {/* <StyledTableCell>{row.createdDate}</StyledTableCell> */}
                          {/* correct date with moment formatter */}
                          <StyledTableCell>{moment(row?.createdDate).format('DD/MM/YYYY hh:mm A')}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    )
                }

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



