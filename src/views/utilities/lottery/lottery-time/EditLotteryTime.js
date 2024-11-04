import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing,BackendURL } from 'store/constant';
import { IconFileDiff, IconArrowLeft } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';

function EditLotteryTime() {
  const [formData, setFormData] = useState({
    time: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    editUserMethod(id);
  }, [id]);

  const editUserMethod = async (ID) => {
    setIsLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    let inputParameters = {
      _id: ID,
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/lottery-time/get-lottery-time-id`, inputParameters, { headers: headers });
      let data = response.data.data;
      setFormData({ time: new Date(data.time) });
      setIsLoading(false);
    } catch (error) {
      handleRequestError(error);
      setIsLoading(false);
    }
  };

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
      let response = await axios.post(`${BackendURL}v2/lottery/lottery-time/update-lottery-time`, { ...values, _id: id }, { headers: headers });
      if (response.data.status === true) {
        toast.success('Lottery time updated successfully!');
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
        <MainCard title="Edit Lottery Time">
          <Grid item xs={12}>
            {isLoading ? (
              <h1>Loading ...</h1>
            ) : (
              <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form>
                  <Field name="time">
                    {({ field, form }) => (
                      <div style={{ marginBottom: '20px' }}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label="Lottery Time"
                            value={moment(field.value)}
                            onChange={(value) => form.setFieldValue(field.name, value)}
                            error={form.errors.time && form.touched.time}
                            helperText={form.errors.time && form.touched.time ? form.errors.time : ''}
                          />
                        </LocalizationProvider>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="time" component="div" style={{ color: 'red' }} />

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

export default EditLotteryTime;
