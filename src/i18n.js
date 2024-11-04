// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/english.json';
import spTranslations from './locales/spanish.json';
import prTranslations from './locales/portuguese.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: prTranslations },
      es: { translation: spTranslations },
      // Add more languages as needed
    },
    fallbackLng: 'pt', // Default language
    detection: {
      order: ['navigator'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
