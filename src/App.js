import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useNavigate } from 'react-router';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/english.json';
import spTranslations from './locales/spanish.json';
import prTranslations from './locales/portuguese.json';


// ==============================|| APP ||============================== //
i18n
  .use(initReactI18next)
  // .use(languageDetector)
  .init({
    resources: {
      en: { translation: enTranslations },
      sp: { translation: spTranslations },
      pr: { translation: prTranslations },
    },
    fallbackLng: 'pr', // Default language
    detection: {
      order: ['navigator']
    },
    interpolation: {
      escapeValue: false
    }
  });
const App = () => {
  const navigate = useNavigate()
 
  const customization = useSelector((state) => state.customization);
  let authToken = localStorage.getItem("token");

  const getRoleFromURL = () => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    // Find the index of 'login'
    const loginIndex = urlParts.indexOf('login');
    // Get the value before 'login'
    const Role = urlParts[loginIndex - 1];
    // Check if the role is one of the specified roles
    const allowedRoles = ['admin', 'agent', 'operator', 'apkmanger', 'apkdealer'];
    if (allowedRoles.includes(Role)) {
      return Role;
    }else{
      return 'superadmin'
    }
  }

  useEffect(()=>{
    let Role = getRoleFromURL();
    localStorage.setItem("Role", Role);
  },[])

  useEffect(() => {
    console.log()
    if (authToken === null) {
      let Role = getRoleFromURL();
      console.log(Role)
      if(Role === 'admin'){

      }else if(Role === 'agent'){
        navigate('/agent/login');
      }else{
        // navigate('/login');
      }
    }
  }, [authToken, navigate]);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
