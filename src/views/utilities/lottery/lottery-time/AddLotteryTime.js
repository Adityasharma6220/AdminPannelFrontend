import React, { useState } from 'react';
import { Grid, Button, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing ,BackendURL} from 'store/constant';
import { useNavigate } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function AddLotteryTime() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const backBtn = () => {
    navigate(-1);
  };

  const validationSchema = Yup.object().shape({
    time: Yup.string().required('Lottery time is required.'),
  });

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/lottery-time/add-lottery-time`, {...values,launchdate:new Date()}, { headers });
      if (response.data.status === 'SUCCESS') {
        toast.success('Lottery time added successfully!');
        navigate('/admin/lottery/lottery-time/all');
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
        <MainCard title="Add Lottery Time">
          <Grid item xs={12}>
            {isLoading ? (
              <h1>Loading ...</h1>
            ) : (
              <div style={{ padding: '20px' }}>
                <Formik initialValues={{ time: moment() }} validationSchema={validationSchema} onSubmit={onSubmit}>
                  <Form>
                    <Field name="time">
                      {({ field,form  }) => (
                        <div style={{ marginBottom: '20px' }}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label="Lottery Time"
                            value={field.value}
                            onChange={(value) => form.setFieldValue(field.name, value)}
                            error={form.errors.time && form.touched.time}
                            helperText={form.errors.time && form.touched.time ? form.errors.time : ''}
                          />
                          </LocalizationProvider>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage name="time" component="div" style={{ color: 'red', marginBottom: '10px' }} />

                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="primary" type="submit" style={{ width: '100px' }}>
                        Save
                      </Button>
                      <Button variant="contained" color="warning" onClick={backBtn} style={{ width: '100px' }}>
                        Back
                      </Button>
                    </Stack>
                  </Form>
                </Formik>
              </div>
            )}
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default AddLotteryTime;
