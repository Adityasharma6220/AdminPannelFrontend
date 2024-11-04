import axios from 'axios';
import * as React from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField,
  Button, MenuItem, Grid, Pagination, IconButton, Switch, CircularProgress,
} from '@mui/material';

import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import {
  IconEye,
  // IconTrash, IconEdit,
} from '@tabler/icons';

import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Rows, BackendURL } from '../../../store/constant';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


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

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

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
  const [loading, setLoading] = React.useState(true)
 

  React.useEffect(() => {
    getUserDetails();
  }, [page, rowsperpage, search, field, sortby]);

  const getUserDetails = async () => {
    setLoading(true); // Set loading to true before data fetching
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      search: search,
      field: field,
      sortby: sortby,
      page: page,
      rowsperpage: rowsperpage,
    };

    try {
      let response = await axios.post(`${BackendURL}${GET_API_URL}`, inputparameters, { headers: headers });

      setRows(response.data.data);
      console.log('rrr', response.data.data)
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false); // Set loading to false after data fetching, whether it's successful or not
    }
  };

  
  const sortingMethod = (columnname) => {

    if (columnname !== 'action') {
      setField(columnname);
      setSortby(-sortby); // Toggle between ascending and descending order
    }
  };

  const UpdateStatus = async (e, id) => {

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      userID: id,
      isVerified: e.target.checked
    };

    try {
      let response = await axios.post(`${BackendURL}${UPDATE_STATU_URL}`, inputparameters, { headers: headers });

      if (e.target.checked) {
        toast.success(STATUS_UPDATE_MSG_TRUE);
      } else {
        toast.success(STATUS_UPDATE_MSG_FALSE);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  // const DeleteUser = async (id) => {
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${localStorage.getItem('token')}`
  //   };

  //   let inputparameters = {
  //     userID: id
  //   };

  //   try {
  //     let response = await axios.post(`${BackendURL}${DELETE_USER_URL}`, inputparameters, { headers: headers });

  //     toast.success(DELETE_USER_STATUS);
  //     await getUserDetails();
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       localStorage.removeItem('token');
  //       navigate('/login');
  //     }
  //     console.error('Error fetching user details:', error);
  //   }
  // };

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
                '& .MuiTextField-root': { m: 0.3, width: '22%' }
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
                  {loading ?
                    (
                      <TableRow>
                        <TableCell colSpan={Column.length}> {/* colspan should match the number of columns */}
                          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                            <CircularProgress color="success" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows?.map((row) => (

                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                          <StyledTableCell>{row.userId}</StyledTableCell>
                          {/* <StyledTableCell>{row.mobile}</StyledTableCell> */}
                          {/* <StyledTableCell>{row.email}</StyledTableCell> */}
                          <StyledTableCell>
                            <IOSSwitch
                              defaultChecked={row.isVerified}
                              onChange={(e) => {
                                UpdateStatus(e, row._id);
                              }}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <IconButton aria-label="fingerprint" color="success">
                              <Link to={`${VIEW_URL}${row._id}`}>
                                <IconEye />
                              </Link>
                            </IconButton>
                            {/* <IconButton aria-label="fingerprint" color="secondary">
                              <Link to={`/admin/users/edit/${row._id}`}>
                                <IconEdit />
                              </Link>
                            </IconButton> */}

                            {/* <IconButton aria-label="fingerprint" color="error" onClick={() => DeleteUser(row._id)}>
                              <IconTrash />
                            </IconButton> */}
                          </StyledTableCell>
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
              <p>Total records  : {totalRecords}</p>
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