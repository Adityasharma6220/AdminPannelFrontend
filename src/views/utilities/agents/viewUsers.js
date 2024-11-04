import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BackendURL } from '../../../store/constant';
import  { tableCellClasses } from '@mui/material/TableCell';
// import { Container, Typography, CircularProgress, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import Pagination component
import {Typography,Container,CircularProgress,Paper, Table,TableBody,TableContainer,TableHead,TableRow,Box,TextField,Button,MenuItem,TableCell,Grid,Pagination,IconButton,Switch,Dialog,DialogActions,DialogContent,DialogTitle,styled} from '@mui/material';
import { IconEye, IconArrowLeft,IconEdit } from '@tabler/icons';
import { Link,useNavigate } from 'react-router-dom';
import InfoCard from '../InfoCard';
import { gridSpacing } from 'store/constant';

import AddIcon from '@mui/icons-material/Add';
import { IconPigMoney, IconReport, IconDeviceGamepad2 } from '@tabler/icons';

import moment from 'moment';
import { toast } from 'react-toastify';

import SubAdminTable from './SubAdminTable';



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




function AgentProfile() {
  const { id,role } = useParams();
  const navigate = useNavigate();
 
  const [loading,setLoading] = React.useState(false);
  const [currentUser,setCurrentUser] = React.useState({});


  React.useEffect(() => {
    console.log(id,role)
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      _id:id,
      // page: page,
      // rowsperpage: rowsperpage,
      // search: search,
      // field: field,
      // sortby: sortby
    };

    try {
      let response = await axios.post(`${BackendURL}agents/getaffilatemembers`, inputparameters, { headers: headers });
      console.log(response.data?.currentUserDetails)
      let userdata = {...response.data?.currentUserDetails,totalRecords:response.data.totalRecords}
      setCurrentUser(userdata)
      // setType(response.data?.currentUserDetails?.type)
      // setRows(response.data.data);
      // setTotalPages(response.data.pagination.totalPages);
      // setTotalRecords(response.data.totalRecords);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
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


       {
        role === 'admin' ? <SubAdminTable _id={id}/> :<></>
       }


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
        <Typography sx={{ marginBottom: 1 }} color="textSecondary">
          Total Active Users: {user?.totalRecords}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default AgentProfile;
