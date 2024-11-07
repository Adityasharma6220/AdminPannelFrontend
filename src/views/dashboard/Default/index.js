import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalOrderLineChartCard2 from './TotalOrderLineChartCard2';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalTransactionCrditAmount from './TotalTransactionCrditAmount';
import TotalTransactionDebitAmount from './TotalTransactionDebitAmt';
import TotalGGRAmount from './TotalGGRAmount';
import TransactionOperations from './TransactionOperation';
import { gridSpacing, BackendURL, AppName } from 'store/constant';
// ==============================|| DEFAULT DASHBOARD ||============================== //

// GameContext
import { useGame } from 'context/GameContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [DebitAmount, SetDebitAmount] = useState(0)
  const [CreditAmount, SetCreditAmount] = useState(0)

  const { selectedGame } = useGame();


  useEffect(() => {
    document.title = `Dashboard | ${AppName}`
    getUserDetails();
    getTransactionAmount();
  }, [selectedGame]);

  const getUserDetails = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    const url = selectedGame === "default"
      ? `${BackendURL}user/dashboardCounts`
      : `${BackendURL}${selectedGame}/user/dashboardCounts`;

    try {
      let response = await axios.post(url, {}, { headers: headers });
      setUserDetails(response.data.data)
      console.log('userdetails', response.data.data)
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }


      console.error('Error fetching user details:', error);
    }
  }

  const getTransactionAmount = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };


    try {
      let response = await axios.get(`${BackendURL}transactions/getTotalTransactionAmount`, { headers: headers });
      let data = response.data?.data;
      data.forEach((elem) => {
        if (elem?._id === 'debit') {
          SetDebitAmount(elem?.amount)
        } else {
          SetCreditAmount(elem?.amount)
        }
      })


      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }


      console.error('Error fetching user details:', error);
    }
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} sm={12} xs={12}>
            {/* Total Users */}
            <EarningCard isLoading={isLoading} counts={userDetails.userCountsTotal} />
          </Grid>

          <Grid item lg={4} sm={12} xs={12}>
            <TotalIncomeDarkCard isLoading={isLoading} counts={userDetails.userGamePlay} />
          </Grid>

          <Grid item lg={4} sm={12} xs={12}>
            <TotalIncomeLightCard isLoading={isLoading} counts={userDetails.transactions} />
          </Grid>

        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TotalTransactionCrditAmount isLoading={isLoading} totalWin={CreditAmount} />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TotalTransactionDebitAmount isLoading={isLoading} totalBet={DebitAmount} />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TotalGGRAmount isLoading={isLoading} totalWin={CreditAmount} totalBet={DebitAmount} />
          </Grid>

        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PopularCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TransactionOperations isLoading={isLoading} />
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
