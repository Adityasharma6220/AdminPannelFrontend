import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
// import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing    } from 'store/constant';
import { useNavigate } from 'react-router';
import {BackendURL} from '../../../store/constant'
import axios from 'axios';


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

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [value, setValue] = useState('all');
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [responseData,setResponseData] = useState([])

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
 
  useEffect(() => {
    fetchGraph()
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500,value]);

  const fetchGraph = async() => {
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    let inputparameters = {
      status: value,
     
    };

    try {
      let response = await axios.post(`${BackendURL}user/getAreaGraph`, inputparameters, { headers: headers });
      const sortedData = response.data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setResponseData(sortedData)
     
    } catch (error) { if (error.response && error.response.status === 401) {
     localStorage.removeItem('token');
    navigate('/login');
  }
      console.error('Error fetching user details:', error);
    }
  }
  const series = [
    {
      name: t('dashboard.usersCount'),
      data: responseData.map((entry) => [new Date(entry.date).getTime(), entry.count]),
    },
  ];

  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      // toolbar: {
      //   autoSelected: 'zoom',
      // },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: t('dashboard.users'),
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [10, 90,100],
      },
    },
    yaxis: {
      title: {
        text: t('dashboard.counts'),
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          // Adjust the formatter as needed
          return val.toFixed(0);
        },
      },
    },
    colors: ['#00c853'],
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('dashboard.totalGrowth')}</Typography>
                    </Grid>
                   
                  </Grid>
                </Grid>
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
            <Grid item xs={12}>
              {/* <Chart {...chartData} /> */}
              <Chart
        options={options} series={series} type="area"
        height={400}
      />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
