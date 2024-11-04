import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Typography, CardContent, Button, Stack, Chip, CircularProgress } from '@mui/material';
import { IconTrash, IconArrowLeft } from '@tabler/icons';

import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';


function ViewUserDetails({ userId }) {
  const navigate = useNavigate();
  let { id } = useParams();

  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getUserDetails(id);
  }, []);

  const getUserDetails = async (userId) => {
    setLoading(true)  // before fetching the data
    console.log(userId)
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      userId: userId
    };

    try {
      let response = await axios.post(`${BackendURL}user/getuserdetails`, inputparameters, { headers: headers });
      setUserDetails(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false) // After fetching the data
    }
  };

  const backBtn = () => {
    navigate(-1);
  };

  const DeleteUser = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      userID: userId
    };

    try {
      let response = await axios.post(`${BackendURL}user/deleteuser`, inputparameters, { headers: headers });
      if (response.data.status === true) {
        toast.success(`User is deleted !`);
        navigate(-1);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {
              loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                  <CircularProgress color="success" />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>ID:</strong> {userDetails?._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Username:</strong> {userDetails?.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Email:</strong> {userDetails?.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Mobile:</strong> {userDetails?.mobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Status:</strong>{' '}
                      {userDetails?.isVerified ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" />}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Is Add Money ?:</strong>{' '}
                  {userDetails?.isAddMoney ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />}
                </Typography>
              </Grid> */}
                </Grid>
              )
            }

          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
            Back
          </Button>
          {/* <Button variant="outlined" color="error" onClick={DeleteUser} startIcon={<IconTrash />}>
            Delete
          </Button> */}
        </Stack>
      </Grid>
    </>
  );
}

export default ViewUserDetails;
