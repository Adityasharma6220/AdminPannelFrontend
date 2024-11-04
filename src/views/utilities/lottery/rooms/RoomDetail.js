import React,{useState,useEffect} from 'react'
import { BackendURL } from 'store/constant';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { Card, Grid, Typography, CardContent, Button, Stack, Chip } from '@mui/material';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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

const RoomDetail = ({roomId}) => {
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState({});
    useEffect(() => {
      // setLoading(false);
      getRoomDetails(roomId);
    }, []);
  
    const getRoomDetails = async (roomId) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
  
      let inputparameters = {
        roomId: roomId
      };
  
      try {
        let response = await axios.post(`${BackendURL}v2/lottery/lottery-rooms/gettingRoomDetails`, inputparameters, { headers: headers });
        setUserDetails(response.data.data[0]);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Error fetching user details:', error);
      }
    };
  return (
    <>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Room ID:</strong> {userDetails?._id}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Draw:</strong> {userDetails?.draw}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Lottery time:</strong> {moment(userDetails?.time).format('hh:mm A')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Total Tickets:</strong> {userDetails?.totalTickets}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Is Result Added ? :</strong>{' '}
                {userDetails?.isResultAdded ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Is Completed ? :</strong>{' '}
                {userDetails?.isFinshed ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Total Bet Amount:</strong>{' '}
                {userDetails?.lotteryBetValue}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Total Win Amount :</strong>{' '}
                {userDetails?.lotteryWinningValue}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>Lottery Date :</strong>{' '}
                {moment(userDetails?.lotteryDate).format('YYYY-MM-DD')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12}>
        {
            userDetails?.isResultAdded == false? <Stack direction="row" spacing={2}>
            <Link to={`/admin/lottery/rooms/add-result/${userDetails?._id}`}>
             <Button variant="contained" color="secondary">Add Result</Button>
    
            </Link>
           
          </Stack> : <>
          
          <TableContainer sx={{ maxHeight: 'auto' }}>
                 <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                            <StyledTableCell > Animal Name</StyledTableCell>
                            <StyledTableCell > Values</StyledTableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userDetails?.selectedAnimals?.map((row,i) => (
                          <StyledTableRow hover role="checkbox" tabIndex={-1} key={i}>
                            <StyledTableCell>{row?.name}</StyledTableCell>
                            <StyledTableCell>{row?.code}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                </TableContainer>
          
          </>
        }
     
    </Grid>
  </>
  )
}

export default RoomDetail