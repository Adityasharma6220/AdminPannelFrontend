import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconFileDiff } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';


function UserWinTime() {
    const [numberofwin, setnumberofwin] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    
    const navigate = useNavigate();
  
    useEffect(() => {
      EditUserMethod();
    }, []);
  
    const EditUserMethod = async () => {
      setIsLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
  
      try {
        let response = await axios.post(`${BackendURL}winrate/get-userwinrate`, {}, { headers: headers });
        let Data = response.data.data;
        setnumberofwin(Data?.numberofwin);
        setIsLoading(false);
      } catch (error) {
        handleRequestError(error);
        setIsLoading(false);
      }
    };
  
    const validationSchema = Yup.object().shape({
        numberofwin: Yup.number().positive('User win rate must be a positive number.').integer('User win rate must be an integer.').required('User win rate is required.'),
    });
  
    const onSubmit = async (values) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
  
      try {
        let response = await axios.post(`${BackendURL}winrate/add-userwinrate`, { ...values }, { headers: headers });
        if (response.data.status === 'SUCCESS') {
            EditUserMethod();
          toast.success('User Win rate updated successfully!');
        }
      } catch (error) {
        handleRequestError(error);
      }
    };
  
    const handleRequestError = (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      toast.error('Something went wrong on the server!');
      console.error('Error:', error);
    };
  
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainCard title="User Win Rate">
            <Grid container spacing={2}>
              <Grid item xs={8}>
                {isLoading ? (
                  <CircularProgress color='success' />
                ) : (
                  <Formik initialValues={{ numberofwin:  numberofwin}} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Form>
                      <Field name="numberofwin">
                        {({ field }) => (
                          <TextField {...field} label="User win rate" type="text" fullWidth margin="normal" color="success" />
                        )}
                      </Field>
                      <ErrorMessage name="numberofwin" component="div" style={{ color: 'red' }} />
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button variant="outlined" color="success" type="submit" startIcon={<IconFileDiff />}>
                          Update
                        </Button>
                      </Stack>
                    </Form>
                  </Formik>
                )}
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    );
  }
  

export default UserWinTime