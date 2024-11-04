import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { IconFileDiff, IconArrowLeft } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BackendURL } from '../../../../store/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditDraw() {
  const [FormData, SetFormData] = useState({
    name: '',
  });

  const [isLoading,setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    EditUserMethod(id);
  }, [id]);


  const EditUserMethod = async (ID) => {
    setIsLoading(true)
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    let inputparameters = {
      _id: ID,
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/draw/get-draw-id`, inputparameters, { headers: headers });
      let Data = response.data.data;
      SetFormData((prevEditUser) => ({
        ...prevEditUser,
        name: Data.name,
      }));
      setIsLoading(false)
    } catch (error) {
      handleRequestError(error);
      setIsLoading(false)
    }
  };




  const backBtn = () => {
    navigate(-1);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Draw is required.')
    
  });

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    console.log(values)
    try {
      let response = await axios.post(`${BackendURL}v2/lottery/draw/update-draw`, { ...values,_id:id}, { headers: headers });
      if (response.data.status === true) {
        toast.success('Draw updated successfully!');
        navigate('/adminlottery/draw/all');
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
      <MainCard title="Edit Draw" xs={12}>
        <Grid item xs={12}>
          {isLoading ? (
            <h1>Loading ...</h1>
          ) : (
            <Formik initialValues={FormData} validationSchema={validationSchema} onSubmit={onSubmit}>
              <Form fullWidth>
                <Field name="name">
                  {({ field }) => <TextField {...field} label="Enter draw" type="text" fullWidth margin="normal" variant="outlined" />}
                </Field>
                <ErrorMessage name="name" component="div" style={{ color: 'red' }} />

               

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

export default EditDraw;
