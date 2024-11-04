import React, { useState, useEffect } from "react";
import { BackendURL, Rows,gridSpacing } from "store/constant";
import  { tableCellClasses } from '@mui/material/TableCell';
import axios from "axios";
import {
  MenuItem,
  Grid,
  Typography,
  Select,
  Button,
  TextField,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  FormControl
} from "@mui/material";
import { IconTrash, IconArrowLeft } from "@tabler/icons";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router";
import moment from "moment";
import MainCard from "ui-component/cards/MainCard";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    cursor: "pointer",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminReporting = () => {
  const navigate = useNavigate();
  const Column = [
    { id: 1, value: "", label: "" },
    { id: 1, value: "name", label: "Name" },
    { id: 1, value: "type", label: "Type" },
    { id: 4, value: "totalUsers", label: "Total Users" },
    { id: 3, value: "totalGamePlay", label: "Total Game Play" },
    { id: 6, value: "TotalBetValue", label: "Total Bet Amount" },
    { id: 7, value: "TotalWin", label: "Total Win Amount" },
    { id: 2, value: "GGR", label: "GGR" },
  ];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("name");
  const [sortby, setSortby] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openRowId, setOpenRowId] = useState(null);
  const [subTable,setSubTable] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin,setSelectedAdmin] = useState("0")

  useEffect(() => {
    getUserDetails();
    gettingListOfAdmin();
  }, [page, rowsPerPage, search, field, sortby]);

  //Getting admin list for filter
  const gettingListOfAdmin = async () => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
  
      const inputParameters = {
        type:"ADMIN"
      };
  
      try {
        const response = await axios.post( `${BackendURL}v2/lottery/reporting/gettingListForFilters`,inputParameters,{ headers });
        setAdminList(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching user details:", error);
      }
  }

  const getUserDetails = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const inputParameters = {
      page,
      rowsPerPage,
      search,
      field,
      sortby,
      fromDate:startDate,
      toDate:endDate,
      id:selectedAdmin
    };

    try {
      const response = await axios.post(
        `${BackendURL}v2/lottery/reporting/getAdminWiseReporting`,
        inputParameters,
        { headers }
      );
      setRows(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("Error fetching user details:", error);
    }
  };

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

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  const sortingMethod = (columnname) => {
    if (columnname !== "action") {
      setField(columnname);
      setSortby(-sortby); // Toggle between ascending and descending order
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value);
      event.preventDefault();
    }
  };

  const handleRowToggle = async(rowId) => {
    setOpenRowId(openRowId === rowId ? null : rowId);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
  
      const inputParameters = {_id:rowId?._id,fromDate:"",toDate:""};
  
      try {
        const response = await axios.post(`${BackendURL}v2/lottery/reporting/gettingAdminsInnerUserReporting`, inputParameters,{ headers });
        setSubTable(response.data.data);
        // setTotalPages(response.data.pagination.totalPages);
        // setTotalRecords(response.data.totalRecords);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching user details:", error);
      }

  };

  const handleChangeAdmin = (e) => {
    setSelectedAdmin(e.target.value)
  }

  const handleApplyFilters = async () => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
  
      const inputParameters = {
        page,
        rowsPerPage,
        search,
        field,
        sortby,
        fromDate:startDate,
        toDate:endDate,
        id:selectedAdmin
      };
  
      try {
        const response = await axios.post(
          `${BackendURL}v2/lottery/reporting/getAdminWiseReporting`,
          inputParameters,
          { headers }
        );
        setRows(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching user details:", error);
      }
  }

  const handleResetFilters = async () => {
    setStartDate(getDefaultStartDate());
    setEndDate(formatDate(new Date())); 
    setSelectedAdmin("0")
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
  
      const inputParameters = {
        page,
        rowsPerPage,
        search,
        field,
        sortby,
        fromDate:getDefaultStartDate(),
        toDate:formatDate(new Date()),
        id:"0"
      };
  
      try {
        const response = await axios.post(
          `${BackendURL}v2/lottery/reporting/getAdminWiseReporting`,
          inputParameters,
          { headers }
        );
        setRows(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching user details:", error);
      }
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Admin Report" xs={12}>
        <Box sx={{ width: "100%", padding: "10px" }}>
      <Box sx={{ bgcolor: "#ffffff", padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          {/* Date Filters */}
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <TextField
                  id="end-date"
                  label="To Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Search Field */}
          <Grid item xs={12} sm={4}>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 0.3, width: '100%' } }}
              noValidate
              autoComplete="off"
            >
                <FormControl fullWidth>
              <Select id="reporting-type" value={selectedAdmin} onChange={handleChangeAdmin}>
                      <MenuItem value="0">--Select Admin--</MenuItem>
                      {
                        adminList.map((el)=>(
                            <MenuItem key={el._id} value={el._id}>{el.name}</MenuItem>

                        ))
                      }
                    </Select>
                    </FormControl>
            </Box>
          </Grid>

          {/* Apply Filters Button */}
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              fullWidth
            >
              Apply Filters
            </Button>
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={6} sm={2}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Divider />
      </Box>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={6}>
          <Box component="form" sx={{ "& .MuiTextField-root": { m: 0.3, width: "20%" } }} noValidate autoComplete="off">
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="Rows"
                defaultValue="10"
                color="success"
                focused
                size="small"
                onChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(1);
                }}
              >
                {Rows.map((option) => (<MenuItem key={option} value={option}> {option}</MenuItem>))}
              </TextField>
            </div>
          </Box>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 0.3, width: "32%" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-search"
              label="Search"
              type="search"
              color="success"
              size="small"
              onBlur={(event) => setSearch(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Box>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "25px" }}>
          <TableContainer sx={{ maxHeight: "auto", marginBottom: "20px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Column?.map((column) => (
                    <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }} onClick={() => sortingMethod(column.value)}>{column.label}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row) => (
                  <React.Fragment key={row._id}>
                    <StyledTableRow hover role="checkbox" tabIndex={-1} sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => handleRowToggle(row._id)}>
                          {openRowId === row._id ? (<KeyboardArrowUpIcon /> ) : (<KeyboardArrowDownIcon />)}
                        </IconButton>
                      </TableCell>
                      <StyledTableCell>{row?.name}</StyledTableCell>
                      <StyledTableCell>{row?.type}</StyledTableCell>
                      <StyledTableCell>{row?.totalUsers}</StyledTableCell>
                      <StyledTableCell>{row?.totalGamePlay}</StyledTableCell>
                      <StyledTableCell>{Math.floor(row?.totalBetAmount) % 1 === 0? row?.totalBetAmount.toFixed(2): Math.floor(row?.totalBetAmount).toFixed(2)}</StyledTableCell>
                      <StyledTableCell>{Math.floor(row?.totalWinningAmount) % 1 ===0? row?.totalWinningAmount.toFixed(2): Math.floor(row?.totalWinningAmount).toFixed(2 )}</StyledTableCell>
                      <StyledTableCell>{Math.floor(row?.GGR) % 1 === 0? row?.GGR.toFixed(2): Math.floor(row?.GGR).toFixed(2)}</StyledTableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}colSpan={6}>
                        <Collapse in={openRowId === row._id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell align="right">Total Users</TableCell>
                                  <TableCell align="right">Total Game Play</TableCell>
                                  <TableCell align="right">Total Bet Amount</TableCell>
                                  <TableCell align="right">Total Winning Amount</TableCell>
                                  <TableCell align="right">GGR</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subTable?.map((row) => (
                                  <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell align="right">{row.totalUsers}</TableCell>
                                    <TableCell align="right">{row.totalGamePlay}</TableCell>
                                    <StyledTableCell>{Math.floor(row?.totalBetAmount) % 1 === 0? row?.totalBetAmount.toFixed(2): Math.floor(row?.totalBetAmount).toFixed(2)}</StyledTableCell>
                                    <StyledTableCell>{Math.floor(row?.totalWinningAmount) % 1 ===0? row?.totalWinningAmount.toFixed(2): Math.floor(row?.totalWinningAmount).toFixed(2 )}</StyledTableCell>
                                    <StyledTableCell>{Math.floor(row?.GGR) % 1 === 0? row?.GGR.toFixed(2): Math.floor(row?.GGR).toFixed(2)}</StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            {/* Display total pages or records */}
            <Typography>Total records: {totalRecords}</Typography>
          </Grid>
          <Grid item xs={6}>
            {/* Pagination component */}
            <Pagination
              count={totalPages}
              shape="rounded"
              color="success"
              onChange={(event, newPage) => setPage(newPage)}
              style={{ float: "right" }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default AdminReporting;
