import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import App from 'App';
import { GameProvider } from '../src/context/GameContext';
import { store } from 'store';

// style + assets
import 'assets/scss/style.scss';
import config from './config';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/english.json';
import spTranslations from './locales/spanish.json';

// React query
const queryClient = new QueryClient();

// ==============================|| REACT DOM RENDER  ||============================== //

i18n
  .use(initReactI18next)
  // .use(languageDetector)
  .init({
    resources: {
      en: { translation: enTranslations },
      sp: { translation: spTranslations }
    },
    fallbackLng: 'en', // Default language
    detection: {
      order: ['navigator']
    },
    interpolation: {
      escapeValue: false
    }
  });

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
      <GameProvider>

        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />
          </GameProvider>,
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);


