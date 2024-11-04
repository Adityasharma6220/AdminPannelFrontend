import React,{useState,useEffect} from 'react'
import { BackendURL } from 'store/constant';
import axios from 'axios';
import { Card, Grid, Typography, CardContent, Button, Stack, Chip,Divider } from '@mui/material';
import { IconTrash, IconArrowLeft } from '@tabler/icons';
import { styled } from '@mui/material/styles';

import { useParams,useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import moment from 'moment';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.common.white,
      cursor: 'pointer'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }));
const ViewLotteryDetails = () => {
    const { id } = useParams();
  const navigate = useNavigate();
    
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    // setLoading(false);
    getRoomDetails(id);
  }, []);

  const getRoomDetails = async (id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      lotteryId: id
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/lottery-rooms/gettingTicketDetail`, inputparameters, { headers: headers });
      setUserDetails(response.data.data[0]);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };
    

    const backBtn = () => {
        navigate(-1);
      };
    return (
      <Grid container spacing={gridSpacing}>
        
  
        <Grid item xs={12}>
          <MainCard title="Ticket Details" xs={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ bgcolor: '#fffff' }}>
              <Card>
              <CardContent>
            <Typography variant="h2">User Details</Typography>
            <br/>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Username:</strong> <Link to={`/admin/users/view/${userDetails?.users?._id}`}>{userDetails?.users?.username}</Link>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Mobile:</strong> {userDetails?.users?.mobile}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Email:</strong> {userDetails?.users?.email}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Wallet Balance:</strong> {userDetails?.users?.walletBalance}
              </Typography>
            </Grid>
           
          </Grid>
        </CardContent>
        <Divider/>
        <CardContent>
            <Typography variant="h2">Ticket Details</Typography>
            <br/>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Ticket ID:</strong> {userDetails?._id}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Draw:</strong> {userDetails?.draw}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Lottery Mode:</strong> {userDetails?.lotteryModelType}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Lottery Rule:</strong> {userDetails?.lotterySubModelType}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Lottery time:</strong> {moment(userDetails?.time).format('hh:mm A')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Total Tickets:</strong> {userDetails?.userId}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Is Result Added ? :</strong>{userDetails?.rooms?.isResultAdded ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Is Claimed ? :</strong>{userDetails?.isClaimed ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Total Bet Amount:</strong>{userDetails?.lotteryBetValue}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Total Win Amount :</strong>{userDetails?.lotteryWinningValue}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Lottery Date :</strong>{moment(userDetails?.rooms?.lotteryDate).format('YYYY-MM-DD')}</Typography>
            </Grid>
            <Divider/>
            <br/>
            <br/>
            <Grid item xs={8}>
                <Typography variant='h4'><strong>Selected Animals : </strong></Typography>
                {
                    userDetails?.lotteryAnimalValues?.length != 0 ? <TableContainer sx={{ maxHeight: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                            <StyledTableCell > Order No.</StyledTableCell>
                            <StyledTableCell > Animals</StyledTableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        
                        {userDetails?.lotteryAnimalValues?.map((row,i) => (
                          <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                            <StyledTableCell>{i+1}</StyledTableCell>
                            <StyledTableCell>{row.animalName}</StyledTableCell>
                           
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer> :
                  <TableContainer sx={{ maxHeight: 'auto' }}>
                 <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                            <StyledTableCell > Order No.</StyledTableCell>
                            <StyledTableCell > Values</StyledTableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        
                        {userDetails?.lotteryNumberValues?.map((row,i) => (
                          <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                            <StyledTableCell>{i+1}</StyledTableCell>
                            <StyledTableCell>{row.lotteryNumber}</StyledTableCell>
                           
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                </TableContainer>

                }
                
               
            </Grid>
            <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<IconArrowLeft />} onClick={backBtn}>
            Back
          </Button>
          
        </Stack>
            </Grid>
  
          </Grid>
        </CardContent>
      </Card>
                </Box>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    );
}

export default ViewLotteryDetails