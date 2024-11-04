import React from 'react';
import { Grid, TextField, Button, Stack } from '@mui/material';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BackendURL } from '../../../store/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Please enter current password'),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Please enter new password'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please enter confirm password')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Call API to update password (replace API_URL with your actual API endpoint)
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
      let inputparameters = {
        currentpassword: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmNewPassword
      };
      
      let response = await axios.post(`${BackendURL}admin/changepassword`, inputparameters, { headers: headers });
      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      resetForm();
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error updating password:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, handleBlur }) => (
        <Form>
          <Grid container mt={0}>
            <Grid item xs={5}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
                color="success"
                name="currentPassword"
                id="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="currentPassword" component="div" style={{ color: 'red' }} />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                color="success"
                name="newPassword"
                id="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="newPassword" component="div" style={{ color: 'red' }} />

              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                color="success"
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="confirmNewPassword" component="div" style={{ color: 'red' }} />

              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" color="success">
                  Update Password
                </Button>

                <Button variant="outlined" color="primary">
                  Back
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePassword;
