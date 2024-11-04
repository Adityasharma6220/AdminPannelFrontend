import React, { useState, useEffect } from "react";
import { BackendURL } from "store/constant";
import axios from "axios";
import {
  Card,
  Grid,
  Typography,
  CardContent,
  TextField,
} from "@mui/material";
import { IconAngle, IconPlayCard,IconCreditCard ,IconCash} from "@tabler/icons";
import { styled } from "@mui/material/styles";

import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";


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

const SummaryReporting = () => {
    const navigate = useNavigate();
    const Column = [
        { id: 1, value: '_id', label: 'Game Mode' },
        { id: 4, value: 'TotalGamePlay', label: 'Total Game Play' },
        { id: 6, value: 'TotalBetValue', label: 'Total Bet Amount' },
        { id: 7, value: 'TotalWin', label: 'Total Win Amount' },
        { id: 2, value: 'GGR', label: 'GGR' },
      ];
  // Function to get the default start date (first day of last month)
  const getDefaultStartDate = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return formatDate(lastMonth);
  };

  // Function to format date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(formatDate(new Date())); // Current date
  const [field,setField] = useState("_id");
  const [sortby,setSortby] = useState(-1);
  const [rows,setRows] = useState([])
  const [sums,setsums] = useState({})

  useEffect(()=>{
    getUserDetails(startDate,endDate)
  },[startDate,endDate,field,sortby])

  const getUserDetails = async (startDate,endDate) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    let inputparameters = {
      field: field,
      sortby: sortby,
      fromDate:startDate,
      toDate:endDate
    };

    try {
      let response = await axios.post(`${BackendURL}v2/lottery/reporting/getSummaryReportDateWise`, inputparameters, { headers: headers });
      
      setRows(response.data.data);
      setsums(response.data.Sums)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching user details:', error);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const sortingMethod = (columnname) => {
    
    if (columnname !== 'action') {
      setField(columnname);
      setSortby(-sortby); // Toggle between ascending and descending order
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Summary Report" xs={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ bgcolor: "#fffff" }}>
                {/* =========Date Filter======= */}
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-end"
              >
                <Grid item xs={3}>
                  <TextField
                    id="start-date"
                    label="From Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="end-date"
                    label="To Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                  />
                </Grid>
              </Grid>
                {/* =========Cards Details */}
              <Grid container spacing={3} style={{marginTop:"10px"}}>
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ backgroundColor: '#FA7070', color: 'white' }}>
          <CardContent>
            <IconAngle size={32} />
            <Typography variant="h4" component="h2" gutterBottom color={"#FFC94A"}>
              Total GGR
            </Typography>
            <Typography variant="h4" color={"#FFC94A"}>{sums?.ggrSum?.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ backgroundColor: '#9AC8CD', color: 'white' }}>
          <CardContent>
            <IconPlayCard size={32} />
            <Typography variant="h4" component="h2" gutterBottom color={"#1C1678"}>
              Total Gameplay
            </Typography>
            <Typography variant="h4" color={"#1C1678"}>{sums?.totalGamePlaySum}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ backgroundColor: '#C6EBC5', color: 'white' }}>
          <CardContent>
            <IconCreditCard size={32} />
            <Typography variant="h4" component="h2" gutterBottom color={"#ED9455"}>
              Total Bet Amount
            </Typography>
            <Typography variant="h4" color={"#ED9455"}>{sums?.totalBetValueSum?.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ backgroundColor: '#A1C398', color: 'white' }}>
          <CardContent>
            <IconCash size={32} />
            <Typography variant="h4" component="h2" gutterBottom color={"#C5FF95"}>
              Total Winning Amount
            </Typography>
            <Typography variant="h4" color={"#C5FF95"}>{sums?.totalWinSum?.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
                </Grid>
                 {/* ============Table============ */}

<>
<Grid item xs={12} style={{marginTop:"25px"}}>
          <TableContainer sx={{ maxHeight: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Column?.map((column) => (
                    <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }} onClick={() => sortingMethod(column.value)}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                
                {rows?.map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <StyledTableCell>{row?._id}</StyledTableCell>
                    <StyledTableCell>{row?.TotalGamePlay}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.lotteryBetValue) % 1 === 0) ? row?.lotteryBetValue.toFixed(2) : (Math.floor(row?.lotteryBetValue)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.lotteryWinningValue) % 1 === 0) ? row?.lotteryWinningValue.toFixed(2) : (Math.floor(row?.lotteryWinningValue)).toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{(Math.floor(row?.GGR) % 1 === 0) ? row?.GGR.toFixed(2) : (Math.floor(row?.GGR)).toFixed(2)}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={6}>
            {/* Display total pages or records */}
            {/* <p>Total records: {totalRecords}</p> */}
          </Grid>
          <Grid item xs={6}>
            {/* Pagination component */}
            {/* <Pagination
              count={totalPages}
              shape="rounded"
              color="success"
              onChange={(event, newPage) => setPage(newPage)}
              style={{ float: 'right' }}
            /> */}
          </Grid>
        </Grid>
</>
            </Box>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default SummaryReporting;
