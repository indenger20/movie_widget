import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';

export const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
} as const;

export const createLocalization = () => {
  const newInstance = i18n.createInstance();
  newInstance.use(initReactI18next).init({
    lng: 'en',
    resources,
  });
  return newInstance;
};
