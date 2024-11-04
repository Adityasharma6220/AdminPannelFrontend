// import React,{useState} from 'react';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import GameHistoryTable from './GameHistoryTable';
import { gridSpacing } from 'store/constant';

// ==============================|| GameHistory ||============================== //

const GameHistory = () => {
  const Column = [
    { id: 7, value: '_id', label: 'Game Id' },
    { id: 1, value: 'username', label: 'Username' },
    { id: 2, value: 'gameMode', label: 'Mode' },
    { id: 3, value: 'total_Bet_Value', label: 'Bet Value' },
    { id: 4, value: 'total_Win', label: 'Total Win' },
    { id: 5, value: 'createdDate', label: 'Created Date' },
    { id: 6, value: 'actions', label: 'Action' },
  ];
  return (
    <MainCard title="Game History">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <GameHistoryTable
            Column={Column}
            GET_API_URL={'game-history/gamesDetails'}
            UPDATE_STATU_URL={'game-history/updatestatus'}
            DELETE_USER_URL={'game-history/deleteDispute'}
            STATUS_UPDATE_MSG_TRUE={'Dispute is resolved !'}
            STATUS_UPDATE_MSG_FALSE={'Dispute is ignore !'}
            DELETE_USER_STATUS={'Dispute is deleted !'}
            VIEW_URL={'/game-history/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default GameHistory;
