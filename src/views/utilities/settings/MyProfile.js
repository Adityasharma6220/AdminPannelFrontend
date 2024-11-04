import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Stack } from '@mui/material';
import { BackendURL } from '../../../store/constant';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
function MyProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [initialValues, setinitialValues] = useState({});

  useEffect(() => {
    const fetchGraph = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };

      try {
        let response = await axios.get(`${BackendURL}admin/loggedUser`, { headers: headers });
        setUserData(response.data.user);
        let initialValues = {
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          mobile: response.data.user.mobile || ''
        };
        
        setinitialValues(initialValues);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Error fetching user details:', error);
      }
    };

    fetchGraph();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string().required('Mobile Number is required')
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };

      try {
        let response = await axios.post(`${BackendURL}admin/updateProfile`, { updateObject: values }, { headers: headers });
        if (response.data.status) {
          toast.success('Profile is updated');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Error fetching user details:', error);
       
      }
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', userData.name || '');
    formik.setFieldValue('email', userData.email || '');
    formik.setFieldValue('mobile', userData.mobile || '');
  }, [userData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container mt={0}>
        <Grid item sx={5}>
          <TextField
            id="outlined-controlled-name"
            // label="Full Name"
            type="text"
            fullWidth
            margin="normal"
            color="success"
            value={formik.values.name}
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          
          <TextField
            id="outlined-controlled-email"
            // label="Email"
            type="email"
            fullWidth
            margin="normal"
            color="success"
            value={formik.values.email}
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            id="outlined-controlled-mobile"
            // label="Contact No."
            type="text"
            fullWidth
            margin="normal"
            color="success"
            value={formik.values.mobile}
            {...formik.getFieldProps('mobile')}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" color="success">
              Update Profile
            </Button>

            <Button variant="outlined" color="primary">
              Back
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default MyProfile;
