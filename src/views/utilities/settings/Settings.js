import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MainCard from 'ui-component/cards/MainCard';

import MyProfile from './MyProfile';
import UpdatePassword from './UpdatePassword';
import { AppName } from '../../../store/constant';

const StyledTabs = styled((props) => <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#00c853'
  }
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: '#000',
  '&.Mui-selected': {
    color: '#00c853'
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#00c853'
  }
}));

export default function TablerIcons() {
  const [value, setValue] = React.useState(0);
  document.title = `Settings | ${AppName}`
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard title="Settings">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ bgcolor: '#fffff' }}>
          <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
            <StyledTab label="My Profile" />
            <StyledTab label="Update Password" />
          </StyledTabs>
          <Divider />
          <Box sx={{ p: 1 }} />
          {value === 0 && <MyProfile />}
          {value === 1 && <UpdatePassword />}
        </Box>
      </Box>
    </MainCard>
  );
}
