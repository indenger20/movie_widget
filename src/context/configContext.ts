import { IConfig } from 'hooks';
import { LanguageTypes } from 'interfaces';
import { createContext } from 'react';

export const ConfigContext = createContext({
  setLanguage: (_language: LanguageTypes) => {},
  config: <IConfig>{},
});
