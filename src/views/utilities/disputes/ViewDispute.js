import React, { useState, useEffect } from 'react';
import { Grid, Chip, Button, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IconTrash, IconArrowLeft } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router';

import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

function ViewDispute() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [disputeDetails, setDisputeDetails] = useState({});
  useEffect(() => {
    getDisputeDetails(id);
  }, []);

  const getDisputeDetails = async (id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      disputeId: id
    };

    try {
      let response = await axios.post(`${BackendURL}dispute/getdisputedetails`, inputparameters, { headers: headers });
      setDisputeDetails(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
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
      disputeId: id
    };

    try {
      let response = await axios.post(`${BackendURL}dispute/deleteDispute`, inputparameters, { headers: headers });
      if (response.data.status === true) {
        toast.success(`Dispute is deleted !`);
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
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="View Dispute" xs={12}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>ID:</strong> {disputeDetails?._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Username:</strong> {disputeDetails.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Game Mode:</strong> {disputeDetails.gamemode}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Status:</strong>{' '}
                      {disputeDetails.isResolved ? <Chip label="Resolved" color="success" /> : <Chip label="Ignore" color="error" />}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Subject:</strong> {disputeDetails.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Message:</strong> {disputeDetails.message}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
                Back
              </Button>
              <Button variant="outlined" color="error" onClick={DeleteUser} startIcon={<IconTrash />}>
                Delete
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ViewDispute;
