import React, { useState, useEffect } from "react";
import { Grid, Divider, Button, Stack } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconTrash, IconArrowLeft } from "@tabler/icons";
import { useNavigate, useParams } from "react-router";

import { BackendURL } from "../../../store/constant";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewModel() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [gameDetails, setGameDetails] = useState({});
  useEffect(() => {
    getGameDetails(id);
  }, []);

  const getGameDetails = async (id) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    let inputparameters = {
      gameId: id,
    };

    try {
      let response = await axios.post(
        `${BackendURL}game-history/getgamedetails`,
        inputparameters,
        { headers: headers }
      );
      console.log("===========");
      setGameDetails(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("Error fetching user details:", error);
    }
  };

  const backBtn = () => {
    navigate(-1);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="View Game History" xs={12}>
          <Grid item xs={12} mt={2} mb={2}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>ID:</strong> {gameDetails?._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Username:</strong>
                      <Link to={`/admin/users/view/${gameDetails.userId}`}>
                        <a>{gameDetails.username}</a>
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Game Mode:</strong> {gameDetails.gameMode}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Total Bet Value:</strong>{" "}
                      {gameDetails.total_Bet_Value}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Any Dispute ? :</strong>
                      {gameDetails.disputeId === "" ? (
                        "No"
                      ) : (
                        <Link to={`/admin/disputes/view/${gameDetails.disputeId}`}>
                          Yes
                        </Link>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Total Win:</strong> {gameDetails.total_Win}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Divider>Animal Values</Divider>

          {gameDetails?.animalValues?.map((el) => (
            <Card variant="outlined" mt={2}>
              <CardContent>
                <Stack direction={"row"} spacing={12}>
                  <Typography align={"left"}>
                    <strong>Bet Value : </strong>
                    {el?.betValue}
                  </Typography>
                  <Typography align={"right"}>
                    <strong>Animal Point : </strong>
                    {el?.animalPoints}
                  </Typography>
                </Stack>

                <Divider />
                <br />
                <Stack direction="row" spacing={1}>
                  {el?.animalData?.map((el) => (
                    <Grid item xs={3}>
                      <Card variant="outlined" mt={2}>
                        <CardContent>
                          <Typography
                            align="center"
                            variant="h3"
                            component="h3"
                          >
                            {el?.animalName}
                          </Typography>
                          {/* <Typography align='center' variant="h4" component="h4">{el?.detectPoint}</Typography> */}
                          <Typography
                            align="center"
                            variant="h5"
                            component="h5"
                          >
                            {el?.activeAnimal}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Divider mt={2}>Random Animal</Divider>
          <Grid item xs={12} mt={2}>
            <Stack direction="row" spacing={2}>
              {gameDetails?.randomAnimalData?.map((el) => (
                <Grid item xs={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography>{el?.randomAnimalName}</Typography>
                      <Typography>{el?.randomAnimalNumber}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} mt={3}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconArrowLeft />}
                onClick={backBtn}
              >
                Back
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ViewModel;
