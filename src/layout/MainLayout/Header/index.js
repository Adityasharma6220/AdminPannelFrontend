import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Select, MenuItem, IconButton, Menu } from '@mui/material';
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import { useDispatch } from 'react-redux';
import { changeLanguage } from 'store/actions';
import i18n from '../../../i18n';
import { IconMenu2 } from '@tabler/icons';

// context 
import { useGame } from 'context/GameContext';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' }
];

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [value, setValue] = useState('default');
  const [data, setData] = useState(null);

  // to control from context 
  const { selectedGame, setSelectedGame } = useGame();

  const handleLanguageChange = (language) => {
    dispatch(changeLanguage(language));
    setSelectedLanguage(language);
    handleClose();
    i18n.changeLanguage(language);
  };
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const fetchData = async (selection) => {
  //   try {
  //     const response = await axios.get(`${selection}/data`);
  //     setData(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedGame(selectedValue);

    // Trigger fetch only if a valid database is selected
    // if (selectedValue === 'dice' || selectedValue === 'gamedatabase') {
    //   fetchData(selectedValue);
    // } else {
    //   setData(null); // Clear data for non-database options
    // }
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.success.light,
              color: theme.palette.success.dark,
              '&:hover': {
                background: theme.palette.success.dark,
                color: theme.palette.success.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Box>
        <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
          <Select value={selectedGame} onChange={handleDropdownChange}>
            <MenuItem value="default" disabled>
              Pick your favorite Simpson
            </MenuItem>
            <MenuItem value="dice">🎲Dice</MenuItem>
            <MenuItem value="gamedatabase">Game Database</MenuItem>
            <MenuItem value="Bart">Bart</MenuItem>
            <MenuItem value="Lisa">Lisa</MenuItem>
            <MenuItem value="Maggie">Maggie</MenuItem>
          </Select>
          {/* Render fetched data */}
          <Box>
            {data && (
              <div>
                {JSON.stringify(data)}
              </div>
            )}
          </Box>
        </div>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={handleClick} aria-label="language" size="large">
        <Avatar sx={{ background: theme.palette.success.light, color: theme.palette.success.dark }}>
          {selectedLanguage.toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 200,
            width: '20ch',
          },
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => handleLanguageChange(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
