import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { IconFileDiff, IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddVersion() {
  const [FormData, SetFormData] = useState({
    versionnumber: '',
    url: '',
    launchdate:new Date()
  });

  const [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate();




  const backBtn = () => {
    navigate(-1);
  };

  const validationSchema = Yup.object().shape({
    versionnumber: Yup.string().required('Version is required.'),
    url: Yup.string().required('Url is required.')
    
  });

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    console.log(values)
    try {
      let response = await axios.post(`${BackendURL}version/add-version`, { ...values}, { headers: headers });
      if (response.data.status === 'SUCCESS') {
        toast.success('Version added successfully!');
        navigate('/admin/versions/all');
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
    <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
      <MainCard title="Add Version" xs={12}>
        <Grid item xs={12}>
          {isLoading ? (
            <h1>Loading ...</h1>
          ) : (
            <Formik initialValues={FormData} validationSchema={validationSchema} onSubmit={onSubmit}>
              <Form fullWidth>
                <Field name="versionnumber">
                  {({ field }) => <TextField {...field} label="Version Number" type="text" fullWidth margin="normal" variant="outlined" />}
                </Field>
                <ErrorMessage name="versionnumber" component="div" style={{ color: 'red' }} />

                <Field name="url">
                  {({ field }) => <TextField {...field} label="Url" type="text" fullWidth margin="normal" variant="outlined" />}
                </Field>
                <ErrorMessage name="url" component="div" style={{ color: 'red' }} />

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="success" type="submit" startIcon={<IconFileDiff />}>
                      Save
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
                      Back
                    </Button>
                  </Stack>
                </Grid>
              </Form>
            </Formik>
          )}
        </Grid>
      </MainCard>
    </Grid>
  </Grid>
  );
}

export default AddVersion;
