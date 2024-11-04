import PropTypes from 'prop-types';
import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import { CardContent, Grid, TextField, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing    } from 'store/constant';
import Chart from 'react-apexcharts';

// assets
import {BackendURL} from '../../../store/constant';
import { useNavigate } from 'react-router';
import axios from 'axios';
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const status = [
  {
    value: 'today',
    label: 'dashboard.today'
  },
  {
    value: 'month',
    label: 'dashboard.thisMonth'
  },
  {
    value: 'all',
    label: 'dashboard.all'
  }
];

const TransactionOperations = ({ isLoading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation()
  const [value,setValue] = useState("all");
  const [chartState, setChartState] = useState({
    options: {
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
    fill: {
        colors: ['#F44336', '#E91E63', '#9C27B0']
      },
    series: [],
    colors: ['#FF5733', '#00FF00', '#9C27B0'], // Change colors as needed
  });

 

  useEffect(() => {
    
    fetchGraph();
  }, [value]);

  const fetchGraph = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    let inputparameters = {
      status: value,
    };

    try {
      let response = await axios.post(`${BackendURL}transactions/transactionChart`, inputparameters, { headers: headers });
      const categoryData = response.data.data.map(category => category._id);
      const categorySeriesData = response.data.data.map(category => category.count);

      setChartState(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          labels: categoryData,
        },
        series: categorySeriesData,
      }));

    } catch (error) { if (error.response && error.response.status === 401) {
     localStorage.removeItem('token');
    navigate('/login');
  }
      console.error('Error fetching user details:', error);
    }
  }

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h5"><b>{t('dashboard.transactionsMethods')}</b></Typography>
                  </Grid>
                  <Grid item>
                  <Grid item>
                  <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {chartState.series.length > 0 ? (
                <Chart
                  options={chartState.options}
                  series={chartState.series}
                  type="donut"
                  height={300}
                />
              ):(<Typography variant='subtitle1' alignContent="center">{t('dashboard.noGraphFound')}</Typography>)}
              
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

TransactionOperations.propTypes = {
  isLoading: PropTypes.bool
};

export default TransactionOperations;
