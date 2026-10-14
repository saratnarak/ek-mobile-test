import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import km from './km.json';

const i18nInstance = i18n;

i18nInstance.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    km: { translation: km },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
