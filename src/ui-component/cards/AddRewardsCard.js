import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonBase,
  Link,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '../extended/Avatar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BackendURL } from '../../store/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const AddCardRewards = ({ title, icon, keydata }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required('Type is required.'),
    content: Yup.string().required('Content is required.'),
    amount: Yup.number()
      .positive('Target amount must be a positive number.')
      .integer('Target amount must be an integer.')
      .required('Target amount is required.'),
  });

  const initialValues = {
    type: 'WEEKLY',
    content: '',
    amount: '',
    rewardamount:"",
    createdDate:new Date()
  };

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    try {
      let response = await axios.post(`${BackendURL}rewards/add-rewards`, { ...values }, { headers });
      if (response.data.status === 'SUCCESS') {
        toast.success('New reward is created!');
        keydata('update parent');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      toast.error('Something went wrong on the server!');
      console.error('Error fetching user details:', error);
    }
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add Reward</DialogTitle>
        <DialogContent>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form>
             
              <Field name="type">
                {({ field }) => (
                  <>
                    <InputLabel htmlFor="type">Type</InputLabel>
                    <Select
                      {...field}
                      label="Type"
                      id="type"
                      color="success"
                      fullWidth
                      margin="normal"
                    >
                      <MenuItem value="WEEKLY">Weekly</MenuItem>
                      <MenuItem value="MONTHLY">Monthly</MenuItem>
                    </Select>
                  </>
                )}
              </Field>
              <ErrorMessage name="type" component="div" style={{ color: 'red' }} />

              <Field name="content">
                {({ field }) => (
                  <TextField {...field} label="Content" type="text" fullWidth margin="normal" color="success" />
                )}
              </Field>
              <ErrorMessage name="content" component="div" style={{ color: 'red' }} />

              <Field name="amount">
                {({ field }) => (
                  <TextField {...field} label="Target Amount" type="number" fullWidth margin="normal" color="success" />
                )}
              </Field>
              <ErrorMessage name="amount" component="div" style={{ color: 'red' }} />

              <Field name="rewardamount">
                {({ field }) => (
                  <TextField {...field} label="Reward Amount" type="number" fullWidth margin="normal" color="success" />
                )}
              </Field>
              <ErrorMessage name="rewardamount" component="div" style={{ color: 'red' }} />

              <DialogActions>
                <Button color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button color="success" type="submit">
                  Add
                </Button>
              </DialogActions>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>

      <Tooltip title={title || 'Add Reward'} placement="left">
        <ButtonBase disableRipple>
          {!icon && (
            <Avatar
              component={Link}
              onClick={handleClickOpen}
              alt="add logo"
              size="badge"
              color="success"
              outline
            ></Avatar>
          )}
          {icon && (
            <Avatar component={Link} size="badge" color="success" outline>
              {icon}
            </Avatar>
          )}
        </ButtonBase>
      </Tooltip>
    </>
  );
};

AddCardRewards.propTypes = {
  icon: PropTypes.node,
  link: PropTypes.string,
  title: PropTypes.string,
};

export default AddCardRewards;
