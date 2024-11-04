// import React,{useState} from 'react';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TableComponent from './DisputeTable';
import { gridSpacing } from 'store/constant';

// ==============================|| Users ||============================== //

const Users = () => {
  
  const Column = [
    { id: 1, value: 'username', label: 'Username' },
    { id: 7, value: 'gameId', label: 'Game ID' },
    { id: 2, value: 'gamemode', label: 'Game Mode' },
    { id: 3, value: 'subject', label: 'Subject' },
    { id: 4, value: 'message', label: 'Message' },
    { id: 5, value: 'isResolved', label: 'Status' },
    { id: 6, value: 'action', label: 'Actions' }
  ];
  return (
    <MainCard title="Disputes">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <TableComponent
            Column={Column}
            // key={key}
            GET_API_URL={'dispute/disputesDetails'}
            UPDATE_STATU_URL={'dispute/updatestatus'}
            DELETE_USER_URL={'dispute/deleteDispute'}
            STATUS_UPDATE_MSG_TRUE={'Dispute is resolved !'}
            STATUS_UPDATE_MSG_FALSE={'Dispute is ignore !'}
            DELETE_USER_STATUS={'Dispute is deleted !'}
            VIEW_URL={'/admin/disputes/view/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Users;
