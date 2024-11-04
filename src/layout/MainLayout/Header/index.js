import PropTypes from 'prop-types';
import { useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { MenuItem, Menu, IconButton } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import { useSelector,useDispatch } from 'react-redux';
import { changeLanguage } from 'store/actions';
import i18n from '../../../i18n';

// assets
import { IconMenu2 } from '@tabler/icons';

// Define your language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' }
];

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language

  const handleLanguageChange = (language) => {
    dispatch(changeLanguage(language))

        setSelectedLanguage(language);
        handleClose();
        i18n.changeLanguage(language);
        // You can perform any additional actions upon language change here
      };
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
  return (
    <>
      {/* logo & toggler button */}
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
      <Box sx={{ flexGrow: 1 }} />
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

// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material/styles';
// import { Avatar, Box, ButtonBase, MenuItem, Menu, IconButton } from '@mui/material';
// import { IconMenu2 } from '@tabler/icons';
// import LogoSection from '../LogoSection';
// import ProfileSection from './ProfileSection';



// const Header = ({ handleLeftDrawerToggle }) => {
//   const theme = useTheme();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//     handleClose();
//     // You can perform any additional actions upon language change here
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           [theme.breakpoints.down('md')]: {
//             justifyContent: 'space-between',
//             width: '100%',
//           },
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <LogoSection />
          
//         </Box>
//         <Box sx={{ flexGrow: 1 }} />
       
//         <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
//           <Avatar
//             variant="rounded"
//             sx={{
//               ...theme.typography.commonAvatar,
//               ...theme.typography.mediumAvatar,
//               transition: 'all .2s ease-in-out',
//               background: theme.palette.success.light,
//               color: theme.palette.success.dark,
//               '&:hover': {
//                 background: theme.palette.success.dark,
//                 color: theme.palette.success.light,
//               },
//             }}
//             onClick={handleLeftDrawerToggle}
//             color="inherit"
//           >
//             <IconMenu2 stroke={1.5} size="1.3rem" />
//           </Avatar>
//         </ButtonBase>
//       </Box>
//       <Box sx={{ flexGrow: 1 }} />
//       <ProfileSection />
//     </>
//   );
// };

// Header.propTypes = {
//   handleLeftDrawerToggle: PropTypes.func,
// };

// export default Header;
