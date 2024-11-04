import PropTypes from "prop-types";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { Avatar, Box, Grid, Typography } from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonTotalOrderCard from "ui-component/cards/Skeleton/EarningCard";

// assets
import ReportIcon from "@mui/icons-material/Report";
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { useTranslation } from "react-i18next";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.error.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: "50%",
    top: -30,
    right: -180,
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.error.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: "50%",
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading, counts }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 1.75 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.error.dark,
                        color: "#fff",
                        mt: 0.75,
                      }}
                    >
                      {/* <ReportIcon fontSize="inherit" /> */}
                      <HandshakeOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.7 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          sx={{
                            fontSize: "2.075rem",
                            fontWeight: 500,
                            mr: 1,
                            mt: 1.5,
                            mb: 0.125,
                          }}
                        >
                          {counts}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.error.light,
                          }}
                        >
                          {/* {t("dashboard.totalDisputes")} */}
                          Total Bet
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalOrderLineChartCard;
