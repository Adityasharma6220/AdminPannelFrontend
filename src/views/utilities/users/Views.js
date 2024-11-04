import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Grid, Tabs, Tab, Box, Divider, styled } from '@mui/material';
import { IconPigMoney, IconReport, IconDeviceGamepad2, IconTrophy } from '@tabler/icons';
import { BackendURL } from '../../../store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import InfoCard from '../InfoCard';
import ViewUserDetails from './ViewUserDetails';
import UserTransactions from './UserTransactions';
import GameDetails from './GameDetails';
import UserDispute from './UserDispute';

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

function Views() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  console.log(userDetails)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    console.log(id)
    getUserDetails(id);
  }, []);

  const getUserDetails = async (id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      userId: id
    };

    try {
      let response = await axios.post(`${BackendURL}user/getUserDetailscount`, inputparameters, { headers: headers });
      setUserDetails(response.data.data);
      console.log(response.data.data)
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <InfoCard
              isLoading={false}
              title="Wallet balance"
              icon={<IconPigMoney />}
              value={userDetails.userWalletBalance?.balance || 0}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <InfoCard isLoading={false} title="Total Win" icon={<IconTrophy />} value={userDetails.userDesputes} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <InfoCard isLoading={false} title="Total Bet" icon={<IconReport />} value={userDetails.userDesputes} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <InfoCard isLoading={false} title="Total Game play" icon={<IconDeviceGamepad2 />} value={userDetails.userGamePlay} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <MainCard xs={12}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ bgcolor: '#fffff' }}>
              <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                <StyledTab label="User Details" />
                <StyledTab label="Transaction Details" />
                <StyledTab label="Game Details" />
                {/* <StyledTab label="Dispute Details" /> */}
              </StyledTabs>
              <Divider />
              <Box sx={{ p: 1 }} />
              {value === 0 && <ViewUserDetails userId={id} />}
              {value === 1 && <UserTransactions userId={id} />}
              {value === 2 && <GameDetails userId={id} />}
              {/* {value === 3 && <UserDispute userId={id} />} */}
            </Box>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Views;
