import axios from "axios";
import React, { useState, useEffect } from "react";
import { BackendURL, gridSpacing } from "store/constant";

// material-ui
import { Grid, Button, TextField, Stack } from "@mui/material";
import AlgoCard from "ui-component/cards/AlgoCard";
import { green, indigo, pink, teal } from "@mui/material/colors";
import MainCard from "ui-component/cards/MainCard";

import { IconFileDiff } from '@tabler/icons';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';

// ==============================|| ALGO CARD DETAILS ||============================== //

const validationSchema = Yup.object().shape({
  min: Yup.number().positive('Min Rtp Range must be a positive number.').integer('Min Rtp Range must be an integer.').required('Min Rtp Range is required.')
  .test('is-less-or-equal', 'Min Rtp Range must not be greater than Max Rtp Range', function(value) {
    const { max } = this.parent;
    return value !== undefined ? value <= max : true;
  }),
  max: Yup.number().positive('Max Rtp Range must be a positive number.').integer('Max Rtp Range must be an integer.').required('Max Rtp Range is required.')
  
});

const Algo = () => {
  const [algoDetails, setAlgoDetails] = useState({});
  const [algoAdminDetails, setAlgoAdminDetails] = useState({ rtpRange: { min: '', max: '' } });

  // console.log("algo-details:- ", algoDetails);
  // console.log("algo-admin-details:- ", algoAdminDetails.rtpRange.min);
  // console.log("algo-admin-details:- ", algoAdminDetails);
  
  const algo = async (headers) => {
    try {
      let response = await axios.get(`${BackendURL}algo/getAlgo`, { headers });
      return response.data.rtp;
    } catch (error) {
      console.log("algo-details fetching error - ", error);
    }
  };

  const algoAdmin = async (headers) => {
    try {
      let response = await axios.get(`${BackendURL}algo/algoAdmin`, { headers });
      return response.data;
    } catch (error) {
      console.log("algo-admin-details fetching error - ", error);
    }
  };
  const getAlgoDetails = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const [algoDetails, algoAdminDetails] = await Promise.all([
        algo(headers),
        algoAdmin(headers),
      ]);
      setAlgoDetails(algoDetails);
      setAlgoAdminDetails(algoAdminDetails);
    } catch (error) {
      console.error("Algo details fetching error - ", error);
    }
  };

  useEffect(() => {
    getAlgoDetails();
  }, []);

  const updateAlgoAdmin = async (values, headers) => {
    try {
      let response = await axios.post(`${BackendURL}algo/updateAlgoAdmin`, values, { headers });
      return response.data;
    } catch (error) {
      console.log("algo-admin-details update error - ", error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      // Update the values in the database
      const updatedAlgoAdminDetails = await updateAlgoAdmin(values, headers);

      // Update the frontend state
      setAlgoAdminDetails((prevDetails) => ({
        ...prevDetails,
        rtpRange: {
          min: values.min,
          max: values.max,
        },
      }));

      if (values.min !== algoAdminDetails.rtpRange.min) {
        toast.success(`Min Rtp range updated successfully to ${values.min}`);
      }
      if (values.max !== algoAdminDetails.rtpRange.max) {
        toast.success(`Max Rtp range updated successfully to ${values.max}`);
      }
      
      setSubmitting(false);
    } catch (error) {
      console.error("Update error - ", error);
      setSubmitting(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Algo Details" xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} lg={6}>
              {algoDetails?.daily && (
                <AlgoCard
                  title="Daily"
                  data={algoDetails.daily}
                  sx={{
                    backgroundColor: green[100],color: green[700],
                    fontWeight: "bold", fontSize: "1rem",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              {algoDetails?.weekly && (
                <AlgoCard
                  title="Weekly"
                  data={algoDetails.weekly}
                  sx={{
                    backgroundColor: pink[100], color: pink[500],
                    fontWeight: "bold", fontSize: "1rem",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              {algoDetails?.monthly && (
                <AlgoCard
                  title="Monthly"
                  data={algoDetails.monthly}
                  sx={{
                    backgroundColor: indigo[100], color: indigo[700],
                    fontWeight: "bold", fontSize: "1rem",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              {algoDetails?.quarterly && (
                <AlgoCard
                  title="Quarterly"
                  data={algoDetails?.quarterly}
                  sx={{
                    backgroundColor: teal[100], color: teal[700],
                    fontWeight: "bold", fontSize: "1rem",
                  }}
                />
              )}
            </Grid>
          </Grid>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <MainCard title="Algo Admin (RTP Range)"
                xs={12} sx={{ p: 2, border: "none" }}>
                <Formik
                  initialValues={{ min: algoAdminDetails.rtpRange.min || '', max: algoAdminDetails.rtpRange.max || '' }}
                  validationSchema={validationSchema}
                  enableReinitialize={true}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Field name="min">
                          {({ field }) => (
                            <TextField
                              {...field}
                              label="Min Rtp Range"
                              type="text"
                              margin="normal"
                              color="success"
                              fullWidth
                            />
                          )}
                        </Field>
                        <ErrorMessage name="min" component="div"
                          style={{ color: "red" }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field name="max">
                          {({ field }) => (
                            <TextField
                              {...field}
                              label="Max Rtp Range"
                              type="text"
                              fullWidth
                              margin="normal"
                              color="success"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="max" component="div"
                          style={{ color: "red" }}
                        />
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button
                        variant="outlined"
                        color="success"
                        type="submit"
                        startIcon={<IconFileDiff />}
                      >
                        Update
                      </Button>
                    </Stack>
                  </Form>
                </Formik>
              </MainCard>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Algo;
