
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TableComponent from './TransactionsTable';
import { gridSpacing, AppName } from 'store/constant';

// ==============================|| Transactions ||============================== //

const Transactions = () => {
  document.title = `Transactions | ${AppName}`
  const Column = [
    { id: 1, value: 'username', label: 'Username' },
    { id: 2, value: 'transactionId', label: 'Transaction ID' },
    { id: 3, value: 'transactionType', label: 'Transaction Type' },
    { id: 4, value: 'operation', label: 'Operation' },
    { id: 5, value: 'amount', label: 'Spend Amt.' },
    { id: 6, value: 'balance', label: 'Remain Bal.' },
    { id: 7, value: 'createdDate', label: 'Created Date' }
  ];
  return (
    <MainCard title="Transactions">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <TableComponent
            Column={Column}
            GET_API_URL={'transactions/transactionsDetails'}
            UPDATE_STATU_URL={'transactions/updatestatus'}
            DELETE_USER_URL={'transactions/deleteDispute'}
            STATUS_UPDATE_MSG_TRUE={'Dispute is resolved !'}
            STATUS_UPDATE_MSG_FALSE={'Dispute is ignore !'}
            DELETE_USER_STATUS={'Dispute is deleted !'}
            VIEW_URL={'/transactions/'}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Transactions;
