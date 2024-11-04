// material-ui
import {  Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';


// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" target="_blank" underline="hover">
      {t('login.adminPanel')}
    </Typography>
    <Typography variant="subtitle2"  target="_blank" underline="hover">
      &copy;  {t('login.adminPanel')}

    </Typography>
  </Stack>
  )
 
};

export default AuthFooter;
