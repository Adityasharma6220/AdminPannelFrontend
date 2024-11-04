import React,{useState} from 'react';
import { Grid,Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TableComponent from './RewardsTable';
import { gridSpacing } from 'store/constant';
import AddRewardsCard from '../../../ui-component/cards/AddRewardsCard';

// ==============================|| Rewards ||============================== //

const Rewards = () => {
    const [key, setKey] = useState(0);

  const UpdateKey = (newstate) => {
    console.log(newstate)
    setKey(key + 1);
  };
  
  const Column = [
    { id: 1, value: 'type', label: 'Type' },
    { id: 7, value: 'amount', label: 'Targeted Amount' },
    { id: 2, value: 'rewardamount', label: 'Reward Amount' },
    { id: 3, value: 'content', label: 'Content' },
    { id: 6, value: 'action', label: 'Actions' }
  ];
  return (
    <MainCard title="Rewards" secondary={<AddRewardsCard keydata={UpdateKey}/>}>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <TableComponent
            Column={Column}
            key={key}
            GET_API_URL={'rewards/get-rewards'}
            UPDATE_STATU_URL={'rewards/updatestatus'}
            DELETE_USER_URL={'rewards/delete-rewards'}
            VIEW_URL={'/rewards/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Rewards;
