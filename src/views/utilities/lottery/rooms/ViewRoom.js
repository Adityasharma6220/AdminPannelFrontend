import React, { useState } from 'react';
import { Grid , Button,Stack} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useParams } from 'react-router';
import { IconArrowLeft } from '@tabler/icons';


import LotteriesDetail from './LotteriesDetail';
import RoomDetail from './RoomDetail';

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

const ViewRoom = () => {
    const { id } = useParams();
  const navigate = useNavigate();
    
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const backBtn = () => {
        navigate(-1);
      };
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
            Back
          </Button>
          
        </Stack>
      </Grid>
  
        <Grid item xs={12}>
          <MainCard title="Room Details" xs={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ bgcolor: '#fffff' }}>
                <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                  <StyledTab label="Room Details" />
                  <StyledTab label="Ticket Details" />
                </StyledTabs>
                <Divider />
                <Box sx={{ p: 1 }} />
                {value === 0 && <RoomDetail roomId={id} />}
                {value === 1 && <LotteriesDetail roomId={id} />}
              </Box>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    );
}

export default ViewRoom