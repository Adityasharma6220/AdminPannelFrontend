import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Link, Tooltip, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// project imports
import Avatar from '../extended/Avatar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BackendURL } from '../../store/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
// ==============================|| CARD SECONDARY ACTION ||============================== //

const CardSecondaryAction = ({ title, icon, keydata }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const checkEmailExists = async (email) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
    let inputparameters = {
      email: email
    };
    try {
      let response = await axios.post(`${BackendURL}user/checkEmail`, inputparameters, { headers: headers });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const checkMobileExists = async (mobile) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
    let inputparameters = {
      mobile: mobile
    };
    try {
      let response = await axios.post(`${BackendURL}user/checkNumber`, inputparameters, { headers: headers });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed.')
      .required('Username is required.'),
    email: Yup.string()
      .email('Invalid email address.')
      .required('Email is required.')
      .test('checkEmailExists', 'Email already exists.', async function (value) {
        
        if (value) {
          const response = await checkEmailExists(value);
          return !response;
        }
        return true;
      }),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, 'Only numbers are allowed.')
      .min(10, 'Mobile number must be at least 10 digits.')
      .max(10, 'Mobile number must be at least 10 digits.')
      .required('Mobile number is required.')
      .test('checkMobileNoExists', 'Mobile number already exists.', async function (value) {
        if (value) {
          const response = await checkMobileExists(value);
          return !response;
        }
        return true;
      }),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters.')
      .max(20, 'Password must not exceed 20 characters.')
      .required('Password is required.'),

      WalletBalance: Yup.number()
      .positive('Wallet balance must be a positive number.')
      .integer('Wallet balance must be an integer.')
      .required('Wallet balance is required.'),
  });

  const initialValues = {
    username: '',
    email: '',
    mobile: '',
    password: '',
    WalletBalance:"",
  };

  const onSubmit = async (values) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    try {
      let response = await axios.post(`${BackendURL}user/registerUser`, { ...values }, { headers: headers });
      if (response.data.status === 'SUCCESS') {
        toast.success('New User is created !');
        keydata('update parent');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      toast.error('something went wrong on server !');
      console.error('Error fetching user details:', error);
    }
    handleClose();
  };

  return (
    <>
      <React.Fragment>
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
          <DialogTitle>Add User</DialogTitle>

          <DialogContent>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              <Form fullWidth>
                <Field name="username" fullWidth>
                  {({ field }) => <TextField {...field} label="Username" type="text" fullWidth margin="normal" color="success" />}
                </Field>
                <ErrorMessage name="username" component="div" style={{ color: 'red' }} />

                <Field name="email" fullWidth>
                  {({ field }) => <TextField {...field} label="Email" type="text" fullWidth margin="normal" color="success" />}
                </Field>
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />

                <Field name="mobile" fullWidth>
                  {({ field }) => <TextField {...field} label="Mobile Number" type="text" fullWidth margin="normal" color="success" />}
                </Field>
                <ErrorMessage name="mobile" component="div" style={{ color: 'red' }} />

                <Field name="password" fullWidth>
                  {({ field }) => <TextField {...field} label="Password" type="text" fullWidth margin="normal" color="success" />}
                </Field>
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

                <Field name="WalletBalance" fullWidth>
                  {({ field }) => <TextField {...field} label="Wallet Balance" type="number" fullWidth margin="normal" color="success" />}
                </Field>
                <ErrorMessage name="WalletBalance" component="div" style={{ color: 'red' }} />

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
      </React.Fragment>

      <Tooltip title={title || 'Add User'} placement="left">
        <ButtonBase disableRipple>
          {!icon && (
            <Avatar component={Link} onClick={handleClickOpen('paper')} alt="add logo" size="badge" color="success" outline></Avatar>
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

CardSecondaryAction.propTypes = {
  icon: PropTypes.node,
  link: PropTypes.string,
  title: PropTypes.string
};

export default CardSecondaryAction;
