import React from 'react';
import PropTypes from 'prop-types';
import MainCard from './MainCard';
import { Divider, Grid } from '@mui/material';
import { IconCalendarStats } from '@tabler/icons-react';

const AlgoCard = ({ title, data, sx }) => {
  return (
    <MainCard sx={sx}>
      <Grid container item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Grid item>{title}</Grid>
        <Grid item><IconCalendarStats sx={{color:'white'}} /></Grid>
      </Grid>

      <Grid item xs={12} sx={{ py: 1.5 }}>
        <Divider sx={{ borderBottomWidth: 1.8 }} />
      </Grid>

      <Grid container item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Grid item xs={6} md={3} lg={6}>
          Rtp: {data?.rtp}
        </Grid>
        <Grid item xs={6} md={3} lg={6}>
          Game Count: {data?.count}
        </Grid>
        <Grid item xs={6} md={3} lg={6}>
          Total Bet: {data?.bet}
        </Grid>
        <Grid item xs={6} md={3} lg={6}>
          Total Win: {data?.win}
        </Grid>
      </Grid>
    </MainCard>
  );
}

AlgoCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    rtp: PropTypes.number,
    count: PropTypes.number,
    bet: PropTypes.number,
    win: PropTypes.number,
  }),
  sx: PropTypes.object,
};

export default AlgoCard;
