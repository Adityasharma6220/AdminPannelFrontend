import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BackendURL } from "store/constant";
import "./AgentSignup.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MenuItem,
  FormControl,
  Grid,
  Select,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

function AgentSignup({ CloseModel }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    location: "",
    type: "NONE",
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name + " => ", value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (
      formData.type === "AGENT" ||
      formData.type === "OPERATOR" ||
      formData.type === "APK_DEALER" ||
      formData.type === "APK_MANGER" ||
      formData.type === "ADMIN"
    ) {
      setShowForm(true);
    } else {
      toast.error("Please select affiliate type !");
    }
  };


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      mobile: "",
      location: "",
      type: "",
      associatedWithAgent: "no",
      associatedWithAdmin:"no",
      agentId: "0",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter email address"),
      password: Yup.string()
        .required("Please enter password")
        .min(8, "Password must be at least 8 characters"),
      password_confirmation: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
      ),
      mobile: Yup.string()
        .required("Please enter mobile number")
        .matches(/^[0-9]+$/, "Mobile number must only contain digits")
        .min(10, "Mobile number must be at least 10 digits"),
      location: Yup.string().required("Please enter location"),
      agentId: Yup.string().test(
        "agentId",
        "Please enter Agent ID",
        function (value) {
          console.log(this.parent.associatedWithAgent);
          const isAssociatedWithAgent =
            this.parent.associatedWithAgent === "yes";
          return isAssociatedWithAgent ? !!value : true;
        }
      ),
    }),
    onSubmit: async (values) => {
      try {
        if (formData.type == "AGENT" || formData.type == "APK_MANGER") {
          values.agentId = "";
        }
        values["type"] = formData.type;
        const response = await axios.post(`${BackendURL}agents/register`,values);
        if (response.data.status == true) {
          toast.success("Successfully registered!");
          CloseModel(true);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div>
      {console.log(formik)}
      {!showForm ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          p={3} // Padding around the Box
        >
          <Typography variant="h2" mb={2}>
            Are you a ?
          </Typography>{" "}
          {/* Added margin-bottom (mb) */}
          <form onSubmit={handleQuestionSubmit}>
            <FormControl>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ minWidth: "200px" }} // Set minimum width for better appearance
              >
                <MenuItem value="NONE">Select</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="AGENT">Agent</MenuItem>
                <MenuItem value="OPERATOR">Operator</MenuItem>
                <MenuItem value="APK_MANGER">APK Manger</MenuItem>
                <MenuItem value="APK_DEALER">APK Dealer</MenuItem>
              </Select>
            </FormControl>
            <Box mt={3}>
              {" "}
              {/* Increased margin-top (mt) */}
              <Button
                type="submit"
                variant="contained"
                style={{
                  borderRadius: "4px",
                  background: "#008000",
                  color: "#fff",
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <div>
          {showForm && (
            <div>
              {(formData.type === "OPERATOR" ||
                formData.type === "APK_DEALER") && (
                <div>
                  <h2>
                    Sign Up For{" "}
                    {formData.type == "OPERATOR" ? "Operator" : "Apk Dealer"}
                  </h2>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Name"
                            type="text"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.name && Boolean(formik.errors.name)
                            }
                            helperText={
                              formik.touched.name && formik.errors.name
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.email &&
                              Boolean(formik.errors.email)
                            }
                            helperText={
                              formik.touched.email && formik.errors.email
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.password &&
                              Boolean(formik.errors.password)
                            }
                            helperText={
                              formik.touched.password && formik.errors.password
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Confirm Password"
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.password_confirmation &&
                              Boolean(formik.errors.password_confirmation)
                            }
                            helperText={
                              formik.touched.password_confirmation &&
                              formik.errors.password_confirmation
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Mobile"
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.mobile &&
                              Boolean(formik.errors.mobile)
                            }
                            helperText={
                              formik.touched.mobile && formik.errors.mobile
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Revenue Share"
                            type="text"
                            id="location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.location &&
                              Boolean(formik.errors.location)
                            }
                            helperText={
                              formik.touched.location && formik.errors.location
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth>
                          <Typography variant="caption">
                            Associated with an admin?
                          </Typography>
                          <RadioGroup
                            row
                            id="associatedWithAdmin"
                            name="associatedWithAdmin"
                            value={formik.values.associatedWithAdmin}
                            onChange={formik.handleChange}
                            disabled={!formik.values.associatedWithAdmin}
                            error={
                              formik.touched.associatedWithAdmin &&
                              Boolean(formik.errors.associatedWithAdmin)
                            }
                            helperText={
                              formik.touched.associatedWithAdmin &&
                              formik.errors.associatedWithAdmin
                            }
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {
                        formik.values.associatedWithAdmin === "no" ? <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth>
                          <Typography variant="caption">
                            Associated with an agent?
                          </Typography>
                          <RadioGroup
                            row
                            id="associatedWithAgent"
                            name="associatedWithAgent"
                            value={formik.values.associatedWithAgent}
                            onChange={formik.handleChange}
                            disabled={!formik.values.associatedWithAgent}
                            error={
                              formik.touched.associatedWithAgent &&
                              Boolean(formik.errors.associatedWithAgent)
                            }
                            helperText={
                              formik.touched.associatedWithAgent &&
                              formik.errors.associatedWithAgent
                            }
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid> : <></>
                      }
                      
                      {console.log(formik.values.associatedWithAgent)}
                      {(formik.values.associatedWithAgent === "yes" || formik.values.associatedWithAdmin === "yes") && (
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <TextField
                              label="Agent ID"
                              type="text"
                              id="agentId"
                              name="agentId"
                              value={formik.values.agentId}
                              onChange={formik.handleChange}
                              disabled={!formik.values.associatedWithAgent}
                              error={
                                formik.touched.agentId &&
                                Boolean(formik.errors.agentId)
                              }
                              helperText={
                                formik.touched.agentId && formik.errors.agentId
                              }
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        borderRadius: "4px",
                        background: "#008000",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                    >
                      Sign Up
                    </Button>
                  </form>
                </div>
              )}
              {(formData.type === "AGENT" ||
                formData.type === "APK_MANGER" || formData.type === 'ADMIN') && (
                <div>
                  <h2>
                    Sign Up For{" "}
                    {formData.type == "AGENT" ? "Agent" : formData.type == 'ADMIN' ? 'Admin' : "APK Manger"}
                  </h2>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Name"
                            type="text"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.name && Boolean(formik.errors.name)
                            }
                            helperText={
                              formik.touched.name && formik.errors.name
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.email &&
                              Boolean(formik.errors.email)
                            }
                            helperText={
                              formik.touched.email && formik.errors.email
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.password &&
                              Boolean(formik.errors.password)
                            }
                            helperText={
                              formik.touched.password && formik.errors.password
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Confirm Password"
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.password_confirmation &&
                              Boolean(formik.errors.password_confirmation)
                            }
                            helperText={
                              formik.touched.password_confirmation &&
                              formik.errors.password_confirmation
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Mobile"
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.mobile &&
                              Boolean(formik.errors.mobile)
                            }
                            helperText={
                              formik.touched.mobile && formik.errors.mobile
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <TextField
                            label="Revenue Share"
                            type="text"
                            id="location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.location &&
                              Boolean(formik.errors.location)
                            }
                            helperText={
                              formik.touched.location && formik.errors.location
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        borderRadius: "4px",
                        background: "#008000",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                    >
                      Sign Up
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentSignup;
