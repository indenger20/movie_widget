import React, { useContext, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { ITheme, LanguageTypes } from './interfaces';
import { ConfigContext } from 'context';
import { useConfig } from 'hooks';

import './i18n/config';

import 'react-toastify/dist/ReactToastify.css';

export type Languages = LanguageTypes;

export interface IWidgetProvider {
  theme?: ITheme;
  language?: LanguageTypes;
  children: React.ReactElement;
}

export interface IWidgetWrapperProps {
  filter?: string;
  className?: string;
}

export const WidgetProvider: React.FC<IWidgetProvider> = (props) => {
  const { theme, language } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTheme = merge(defaultTheme, theme);
    const { colors = {} } = currentTheme;

    Object.keys(colors).forEach((key) => {
      if (ref.current) {
        ref.current.style.setProperty(`--widget-${key}`, colors[key]);
      }
    });
  }, [theme]);

  const { config, setLanguage } = useConfig({ language });

  return (
    <ConfigContext.Provider value={{ config, setLanguage }}>
      <div ref={ref}>
        {props.children}
        <ToastContainer />
      </div>
    </ConfigContext.Provider>
  );
};

export const PeopleWidgetComponent = (props: IWidgetWrapperProps) => {
  return <PeopleWidget {...props} />;
};

export const MovieWidgetComponent = (props: IWidgetWrapperProps) => {
  return <MovieWidget {...props} />;
};
