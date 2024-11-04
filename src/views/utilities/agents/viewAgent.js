import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BackendURL } from '../../../store/constant';
import  { tableCellClasses } from '@mui/material/TableCell';
import {Typography,Container,CircularProgress,Paper, Table,TableBody,TableContainer,TableHead,TableRow,Box,TextField,Button,MenuItem,TableCell,Grid,Pagination,IconButton,Switch,styled} from '@mui/material';
import { IconEye, IconArrowLeft,IconEdit } from '@tabler/icons';
import { Link,useNavigate } from 'react-router-dom';
import { gridSpacing } from 'store/constant';

import moment from 'moment';



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

const Column1 = [
  { id: 1, value: 'name', label: 'Name' },
  { id: 2, value: 'mobile', label: 'Mobile' },
  { id: 3, value: 'email', label: 'Email' },
  { id: 4, value: 'uniqueId', label: 'UniqueId' },
  { id: 5, value: 'type', label: 'Role' },
  // { id: 6, value: 'status', label: 'Status' },
  { id: 6, value: 'createdDate', label: 'Created Date' },
  { id: 7, value: 'action', label: 'Action' },
  
];


function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsperpage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [field, setField] = React.useState('createdDate');
  const [sortby, setSortby] = React.useState(-1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [loading,setLoading] = React.useState(false);
  const [agent,setAgent] = React.useState(false);
  const [currentUser,setCurrentUser] = React.useState({})
  const [type,setType] = React.useState(null)



  React.useEffect(() => {
    console.log(id)
    getUserDetails();
  }, [page, rowsperpage, search, field, sortby]);

  const getUserDetails = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      _id:id,
      page: page,
      rowsperpage: rowsperpage,
      search: search,
      field: field,
      sortby: sortby
    };

    try {
      let response = await axios.post(`${BackendURL}agents/getaffilatemembers`, inputparameters, { headers: headers });
      console.log(response.data?.currentUserDetails)
  setType(response.data?.currentUserDetails?.type)

      setCurrentUser(response.data?.currentUserDetails)
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

  if (loading) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  

  //Back Button
  const backbutton = () => {
    navigate(-1)
  }

  return (
    <>

<Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
          <UserDetailsCard user={currentUser} />
          </Grid>
        </Grid>
      </Grid>
      <Paper>

     

        <Grid container justifyContent="flex-end">
          <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backbutton}  sx={{ marginRight: "10px", marginTop: "10px", marginBottom: '20px', fontWeight: 'bold', borderRadius: '10px' }}>
            Back
          </Button>
        </Grid>


       

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
                  {[10, 20, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 0.3, width: '80%' } // Adjust the width here
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
          
        </Grid>

        <Grid item xs={12}>
          <TableContainer sx={{ maxHeight: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Column1?.map((column) => (
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
                    <StyledTableCell>{row.mobile}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.uniqueId}</StyledTableCell>
                    <StyledTableCell>{row.type}</StyledTableCell> 
                    <StyledTableCell>{moment(row.createdDate).format('DD/MM/YYYY')}</StyledTableCell> 
                    <StyledTableCell>
                    {
                        type == 'AGENT' ? <IconButton aria-label="fingerprint" color="success">
                        <Link to={`/agents/view/${row.uniqueId}`}>
                          <IconEye />
                        </Link>
                      </IconButton> : <></>
                      }
                      <IconButton aria-label="edit" color="secondary">
                        <Link to={`/agents/edit/${row.uniqueId}`}>
                          <IconEdit />
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
            <p>Total records: {totalRecords}</p>
          </Grid>
          <Grid item xs={6}>
            <Pagination
              count={totalPages}
              shape="rounded"
              color="success"
              onChange={(event, newPage) => setPage(newPage)}
              style={{ float: 'right' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}


function UserDetailsCard({ user }) {
  return (
    <Card sx={{  margin: 'auto', marginTop: 5, backgroundColor: '#ffffff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} variant="h5" component="h2" gutterBottom>
          User Details
        </Typography>
        <Typography sx={{ marginBottom: 1 }} color="textSecondary">
          Name: {user.name}
        </Typography>
        <Typography sx={{ marginBottom: 1 }} color="textSecondary">
          Email: {user.email}
        </Typography>
        <Typography sx={{ marginBottom: 1 }} color="textSecondary">
          Mobile : {user.mobile}
        </Typography>
        <Typography sx={{ marginBottom: 1 }} color="textSecondary">
          Type: {user.type}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AgentProfile;
