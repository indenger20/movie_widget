import { LanguageTypes } from 'interfaces';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

interface IProps {
  language?: LanguageTypes;
}

export interface IConfig {
  language: LanguageTypes;
}

const initialState: IConfig = {
  language: 'en',
};

export const useConfig = (props: IProps) => {
  const [state, setState] = useImmer(initialState);
  const { i18n } = useTranslation();

  useEffect(() => {
    const { language } = props;
    if (language) {
      setState((draf) => {
        draf.language = language;
      });
      i18n.changeLanguage(language);
    }
  }, [props.language]);

  const setLanguage = (language: LanguageTypes) => {
    setState((draf) => {
      draf.language = language;
    });
  };

  return {
    config: state,
    setLanguage,
  };
};
