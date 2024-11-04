import * as React from 'react';
import {Paper, Table,TableBody,TableContainer,TableHead,TableRow,Box,TextField,Button,MenuItem,Grid,Pagination,IconButton,Switch,Dialog,DialogActions,DialogContent,DialogTitle,styled} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { IconEye, IconEdit } from '@tabler/icons';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AgentSignup from './AgentSignup';
import { BackendURL } from '../../../store/constant';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';

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

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

const Column1 = [
  { id: 1, value: 'name', label: 'Name' },
  { id: 2, value: 'mobile', label: 'Mobile' },
  { id: 3, value: 'email', label: 'Email' },
  { id: 4, value: 'uniqueId', label: 'UniqueId' },
  { id: 5, value: 'type', label: 'Role' },
  { id: 6, value: 'status', label: 'Status' },
  { id: 6, value: 'createdDate', label: 'Created Date' },
  { id: 7, value: 'action', label: 'Action' },
  
];

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Agents', value: 'AGENT' },
  { label: 'Operators', value: 'OPERATOR' },
  { label: 'APK Manger', value: 'APK_MANGER' },
  { label: 'APK Dealers', value: 'APK_DEALER' }
];

export default function AgentTableComponent() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [field, setField] = React.useState('createdDate');
  const [sortby, setSortby] = React.useState(-1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [openAddUserForm, setOpenAddUserForm] = React.useState(false);
  const [filterType, setFilterType] = React.useState('');

  React.useEffect(() => {
    getAgentDetails();
  }, [page, rowsPerPage, search, field, sortby, filterType]);

  const getAgentDetails = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const inputparameters = {
      page,
      rowsperpage: rowsPerPage,
      search,
      field,
      sortby,
      type: filterType // Add type filter if filterType is defined
    };

    try {
      const response = await axios.post(`${BackendURL}agents/agent_list`, inputparameters, { headers });
      const { agents, totalAgents, pagination } = response.data; // Extract agents, totalRecords, and pagination from the response
      setRows(agents);
      setTotalPages(pagination.totalPages);
      setTotalRecords(totalAgents);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching agent details:', error);
    }
  };

  const sortingMethod = (columnname) => {
    if (columnname !== 'action') {
      setField(columnname);
      setSortby(-sortby);
    }
  };

  const UpdateStatus = async (e, id) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const inputparameters = {
      userID: id,
      isVerified: e.target.checked
    };

    try {
      const response = await axios.post(`${BackendURL}agents/updatestatus`, inputparameters, { headers });

      if (e.target.checked) {
        toast.success("Agent is activated");
      } else {
        toast.success("Agent is deactivated");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error updating agent status:', error);
    }
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      event.preventDefault();
    }
  };

  const toggleAddUserForm = () => {
    setOpenAddUserForm(prevState => !prevState);
  };
  const CloseModel = data => {
    toggleAddUserForm();
    getAgentDetails();
  }

  return (
    <>
      <Paper>
        <Grid container justifyContent="flex-end">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={toggleAddUserForm} sx={{ marginRight: "10px", marginTop: "10px", marginBottom: '20px', fontWeight: 'bold', borderRadius: '10px' }}>
            Add User
          </Button>
        </Grid>

        <Dialog open={openAddUserForm} onClose={toggleAddUserForm} maxWidth="md" fullWidth>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <AgentSignup CloseModel={CloseModel}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleAddUserForm}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
          <Grid item xs={6}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 0.3, width: '20%' }
              }}
              noValidate
              autoComplete="off"
            >
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
                  {[10, 20, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 0.3, width: '80%' } // Adjust the width here
              }}
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
          <Grid item xs={3}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 0.3, width: '80%' } // Adjust the width here
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                select
                label="Filter Type"
                value={filterType}
                onChange={(event) => {
                  setFilterType(event.target.value);
                  setPage(1);
                }}
                size="small"
                color="success"
                fullWidth
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer sx={{ maxHeight: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Column1?.map((column) => (
                    <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }} onClick={() => sortingMethod(column.value)}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.mobile}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.uniqueId}</StyledTableCell>
                    <StyledTableCell>{row.type}</StyledTableCell> 
                    <StyledTableCell><IOSSwitch defaultChecked={row.status}onChange={(e) => { UpdateStatus(e, row._id); }}/></StyledTableCell>
                    <StyledTableCell>{moment(row.createdDate).format('DD/MM/YYYY')}</StyledTableCell> 
                    <StyledTableCell>
                    <IconButton aria-label="fingerprint" color="success">
                        <Link to={`/agents/view/${row?.type?.toLowerCase()}/${row._id}/${row?.uniqueId}`}>
                          <IconEye />
                        </Link>
                      </IconButton>
                      <IconButton aria-label="edit" color="secondary">
                        <Link to={`/agents/edit/${row._id}`}>
                          <IconEdit />
                        </Link>
                      </IconButton>
                    </StyledTableCell>
                   
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={6}>
            <p>Total records: {totalRecords}</p>
          </Grid>
          <Grid item xs={6}>
            <Pagination
              count={totalPages}
              shape="rounded"
              color="success"
              onChange={(event, newPage) => setPage(newPage)}
              style={{ float: 'right' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
