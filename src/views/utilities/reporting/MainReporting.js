import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { BackendURL } from "store/constant";
import {
  Card, Typography, CardContent, Button, Stack, Chip, Divider, FormControl,
  InputLabel, Select, MenuItem, Grid, Box, styled, Table, TableBody,
  TableContainer, TableHead, TableRow
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { IconTrash, IconArrowLeft } from "@tabler/icons";

import moment from "moment";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";

import SummaryReporting from "./SummaryReporting";
import AdminReporting from "./AdminReporting";
import AgentReporting from "./AgentReporting";
import OperatorReporting from "./OperatorReporting";
import SubAgentReporting from "./SubAgentReporting";

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

const MainReporting = () => {
  // const [reportingType, setReportingType] = React.useState("summary");

  // const handleChange = (event) => {
  //   setReportingType(event.target.value);
  // };

  // const ReturningComponent = (name) => {
  //   if(name == 'summary'){
  //       return <SummaryReporting/>
  //   }else if(name == 'admin'){
  //       return <AdminReporting/>
  //   }else if(name == 'agent'){
  //       return <AgentReporting/>
  //   }else if(name == 'operator'){
  //       return <OperatorReporting/>
  //   }
  // }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Reporting" xs={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ bgcolor: "#fffff" }}>
              {/* <Grid container spacing={2} style={{marginBottom:"10px"}} alignItems="center">
                <Grid item xs={3}>
                  <InputLabel htmlFor="reporting-type" style={{ fontWeight: "bold" }}> Reporting type:{" "} </InputLabel>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Select id="reporting-type" value={reportingType} onChange={handleChange}>
                      <MenuItem value="summary">Summary Report</MenuItem>
                      <MenuItem value="admin">Admin Report</MenuItem>
                      <MenuItem value="agent">Agent Report</MenuItem>
                      <MenuItem value="operator">Operator Report</MenuItem>
                      <MenuItem value="apkmanager">Apk Manager </MenuItem>
                      <MenuItem value="apkdealer">Apk Dealer </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid> */}
              {/* <Divider /> */}
              <br/>
              {/* {ReturningComponent(reportingType)} */}
              <SummaryReporting/>
            </Box>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default MainReporting;
