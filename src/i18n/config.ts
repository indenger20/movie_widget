import i18n from 'i18next';
import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
});
