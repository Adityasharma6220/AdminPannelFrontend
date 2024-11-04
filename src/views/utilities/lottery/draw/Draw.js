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
import { IconTrash, IconEdit } from '@tabler/icons';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import { Rows, BackendURL, gridSpacing, AppName } from '../../../../store/constant';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

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

export default function TableComponent() {
  document.title = `Users | ${AppName}`
  const Column = [
    { id: 1, value: 'name', label: 'Name' },
    { id: 4, value: 'isActive', label: 'Status' },
    { id: 5, value: 'action', label: 'Actions' }
  ];
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
    getUserDetails();
  }, [page, rowsperpage, search, field, sortby]);

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
      sortby: sortby
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/draw/get-draw`, inputparameters, { headers: headers });

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

  const UpdateStatus = async (e, id) => {


    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      _id: id,
      isActive: e.target.checked
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/draw/update-status-draw`, inputparameters, { headers: headers });

      if (e.target.checked) {
        toast.success("Draw is activated !");
      } else {
        toast.success("Draw is deactivated !");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const DeleteUser = async (id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      _id: id
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/draw/delete-draw`, inputparameters, { headers: headers });

      toast.success("Draw deleted successfully !");
      await getUserDetails();
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
    <>
      <Paper>
        <MainCard title="Draws">
          <Grid container spacing={gridSpacing} justifyContent="flex-end" alignItems="center" style={{ marginBottom: "10px" }}>
            <Grid item>
              <Link to="/admin/lottery/draw/add-draw"><Button variant="contained" color="warning">Add Draw</Button></Link>
            </Grid>
          </Grid>
          <Grid container spacing={gridSpacing}>


            <Grid item xs={12} sm={12}>
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
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell>
                              <IOSSwitch
                                defaultChecked={row.isActive}
                                onChange={(e) => {
                                  UpdateStatus(e, row._id);
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>

                              <IconButton aria-label="fingerprint" color="secondary">
                                <Link to={`/admin/lottery/draw/edit-draw/${row._id}`}>
                                  <IconEdit />
                                </Link>
                              </IconButton>

                              <IconButton aria-label="fingerprint" color="error" onClick={() => DeleteUser(row._id)}>
                                <IconTrash />
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
            </Grid>
          </Grid>
        </MainCard>
      </Paper>
    </>

  );
}
