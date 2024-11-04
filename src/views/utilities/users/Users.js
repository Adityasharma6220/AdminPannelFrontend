import React, { useState } from 'react';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Table from './UserTable';
import { gridSpacing, AppName } from 'store/constant';
import SecondaryAction from '../../../ui-component/cards/CardSecondaryAction';

// ==============================|| Users ||============================== //

const Users = () => {
  document.title = `Users | ${AppName}`
  const Column = [
    { id: 1, value: 'username', label: 'Username' },
    // { id: 2, value: 'mobile', label: 'Mobile' },
    // { id: 3, value: 'email', label: 'Email' },
    { id: 4, value: 'isVerified', label: 'Status' },
    { id: 5, value: 'action', label: 'Actions' }
  ];
  const [key, setKey] = useState(0);

  const UpdateKey = (newstate) => {
    setKey(key + 1);
  };

  return (
    <MainCard title="All Users"
    // secondary={<SecondaryAction keydata={UpdateKey} />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <Table
            Column={Column}
            key={key}
            GET_API_URL={'user/usersDetails'}
            UPDATE_STATU_URL={'user/updatestatus'}
            DELETE_USER_URL={'user/deleteuser'}
            STATUS_UPDATE_MSG_TRUE={'User is active !'}
            STATUS_UPDATE_MSG_FALSE={'User is inactive !'}
            DELETE_USER_STATUS={'User is deleted !'}
            VIEW_URL={'/admin/users/view/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Users;
