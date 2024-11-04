import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard'; 
// assets
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalIncomeDarkCard = ({ isLoading, counts }) => {
  const theme = useTheme();
  const { t } = useTranslation()
  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            {/* <List sx={{ py: 0 }}> */}
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.primary[800],
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <SportsEsportsIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems='center'>
                  <Grid item>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{counts}</Typography>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.grey[300]
                    // color:'primary.light',
                  }}
                >
                  {t('dashboard.totalGamePlay')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalIncomeDarkCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalIncomeDarkCard;
