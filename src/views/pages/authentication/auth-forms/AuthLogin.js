import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addValue } from 'store/actions';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BackendURL    } from 'store/constant';
// material-ui
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(()=>{
    checkUserAuth()
  },[])

  const checkUserAuth = () => {
    if(localStorage.getItem('token')){
        navigate('/admin/dashboard')
    }else{
      navigate('/login')
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('login.invalidEmail')).required(t('login.emailRequired')),
      password: Yup.string().required(t('login.passwordRequired')),
    }),
    onSubmit: async (values) => {
      try {
       let mutation = await loginmethod(values); // Use mutateAsync for asynchronous mutations
        console.log(mutation)

        if (mutation && mutation.status) {
          dispatch(addValue("Admin"))
          localStorage.setItem('token', mutation.token);
          toast.success(t('login.loginSuccess'));
          navigate('/admin/dashboard');
        }else{
          toast.error(t('login.emailOrPasswordNotValid'))
        }
      } catch (error) { 
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('An error occurred during mutation:', error);
      }
    },
  });
  
 

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginmethod = async ({email,password}) => {
      let inputparameters = {
        email:email,
        password:password,
      }
      let headers = {
        "Content-Type":'application/json; charset=utf-8'
      }
      let sendrequest = await axios.post(`${BackendURL}admin/login`,inputparameters,{headers:headers});
      return sendrequest.data
  }

  return (
    <>
    {console.log(t('login.signIn'))}
      <Grid container direction="column" justifyContent="center" spacing={2}>
       
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{t('login.signInWithEmailAddress')}</Typography>
          </Box>
        </Grid>
      </Grid>


    
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <FormControl fullWidth  sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">{t('login.emailAddressNUsername')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={formik.values.email}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label={t('login.emailAddressNUsername')}
                inputProps={{}}
              />
              { formik.errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {formik.errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth  sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">{t('login.password')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label={t('login.password')}
                inputProps={{}}
              />
              {formik.errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {formik.errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
             
             
            </Stack>
            {formik.errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="success">
                {t('login.signIn')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
      
     
    </>
  );
};

export default FirebaseLogin;
