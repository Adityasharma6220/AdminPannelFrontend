import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { IconLogout, IconSettings } from '@tabler/icons';
import { BackendURL   } from 'store/constant';
import axios from 'axios';
import { addValue } from 'store/actions';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('pr');

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate('/login')
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    getUserDetails();
    
  }, []);
  const getUserDetails = async() => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };


    try {
      let response = await axios.get(`${BackendURL}admin/loggeduser`, { headers: headers });
      
      setUserDetails(response.data.user)
      dispatch(addValue(response.data.user?.role))
    
    } catch (error) {
       if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
  }
      console.error('Error fetching user details:', error);
    }
  }

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Night');
      }
    };

    getCurrentGreeting(); // Set initial greeting

    // Update greeting every minute
    const intervalId = setInterval(getCurrentGreeting, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const settingPage = () => {
    navigate('/settings')
  }
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  return (
    <>
      <Chip
        sx={{
          height: '48px',
          border:1, borderColor:'red',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.success.light,
          backgroundColor: theme.palette.success.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.success.main,
            background: `${theme.palette.success.main}!important`,
            color: theme.palette.success.light,
            '& svg': {
              stroke: theme.palette.success.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            {...stringAvatar(userDetails?.name || "Admin Project")}
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.dark.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">{greeting},</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {userDetails?.name}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">Project Admin</Typography>
                    </Stack>
                  
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p:2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => {handleListItemClick(event, 0, '#');settingPage()}}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2"> Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
