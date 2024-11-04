import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TableComponent from './VersionTable';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';


// ==============================|| Versions ||============================== //

const Versions = () => {
  const Column = [
    { id: 1, value: 'versionnumber', label: 'Version' },
    { id: 7, value: 'url', label: 'URL' },
    { id: 2, value: 'createdDate', label: 'Launch Date' },
    { id: 6, value: 'action', label: 'Actions' }
  ];

  return (
    <MainCard title="Versions">
      <Grid container spacing={gridSpacing} justifyContent="flex-end" alignItems="center">
        <Grid item>
         <Link to="/admin/versions/add-version"><Button variant="contained" color="warning">Add Version</Button></Link> 
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableComponent
            Column={Column}
            GET_API_URL={'version/get-version'}
            UPDATE_STATU_URL={'version/updatestatus'}
            DELETE_USER_URL={'version/delete-version'}
            VIEW_URL={'/version/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Versions;
