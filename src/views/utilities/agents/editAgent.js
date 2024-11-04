import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { IconFileDiff, IconArrowLeft } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditUser() {
  const [editUser, setEditUser] = useState({
    name: '',
    mobile: '',
    email: '',   
  });

  const [isLoading,setIsLoading] = useState(true);
  const [fieldsDisabled, setFieldsDisabled] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    EditUserMethod(id);
  }, [id]);

  const backBtn = () => {
    navigate(-1);
  };

  const EditUserMethod = async (ID) => {
    setIsLoading(true)
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    let inputparameters = {
      userId: ID,
    };

    try {
      let response = await axios.post(`${BackendURL}agents/getagentdetails`, inputparameters, { headers: headers });
      console.log(response)
      let Data = response.data.data;
      setEditUser({
        name: Data.name,
        email: Data.email,
        mobile: Data.mobile,
      });
      setIsLoading(false)
      setFieldsDisabled(false); // Enable fields after data is loaded
    } catch (error) {
      handleRequestError(error);
      setIsLoading(false)
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
    email: Yup.string().email('Invalid email address.').required('Email is required.'),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, 'Only numbers are allowed.')
      .min(10, 'Mobile number must be at least 10 digits.')
      .max(10, 'Mobile number must be at least 10 digits.')
      .required('Mobile number is required.'),
  });

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    try {
      let response = await axios.post(`${BackendURL}agents/updateagent`, { ...values, userId: id }, { headers: headers });
      if (response.data.status === 'SUCCESS') {
        toast.success('Agent details updated successfully!');
        navigate('/agents');
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
        <MainCard title="Edit User Details" xs={12}>
          <Grid item xs={12}>
            {
              isLoading ? <h1>Loading ...</h1> : <Formik initialValues={editUser} validationSchema={validationSchema} onSubmit={onSubmit}>
              <Form fullWidth>
                <Field name="name">
                  {({ field }) => <TextField {...field} label="Name" type="text" fullWidth margin="normal" color="success" disabled={fieldsDisabled}/>}
                </Field>
                <ErrorMessage name="name" component="div" style={{ color: 'red' }} />

                <Field name="email">
                  {({ field }) => <TextField {...field} label="Email" type="text" fullWidth margin="normal" color="success" disabled={fieldsDisabled}/>}
                </Field>
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />

                <Field name="mobile">
                  {({ field }) => <TextField {...field} label="Mobile Number" type="text" fullWidth margin="normal" color="success" disabled={fieldsDisabled}/>}
                </Field>
                <ErrorMessage name="mobile" component="div" style={{ color: 'red' }} />

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="success" type="submit" startIcon={<IconFileDiff />} disabled={fieldsDisabled}>
                      Update
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
                      Back
                    </Button>
                  </Stack>
                </Grid>
              </Form>
            </Formik>
            }
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default EditUser;
