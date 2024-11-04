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

const SubAgentReporting = () => {
  return (
    <Grid container spacing={gridSpacing}>
        
  
    <Grid item xs={12}>
      <MainCard title="Sub Agent Report" xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#fffff' }}>
        
            </Box>
        </Box>
      </MainCard>
    </Grid>
  </Grid>
  )
}

export default SubAgentReporting