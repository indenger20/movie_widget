import React, { useEffect, useRef } from 'react';
import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { IMovie, IPeople, ITheme, LanguageTypes } from './interfaces';
import { ConfigContext } from 'context';
import { useConfig } from 'hooks';

import './i18n/config';

export type Languages = LanguageTypes;
export type Movie = IMovie;
export type People = IPeople;

export interface IWidgetProvider {
  theme?: ITheme;
  language?: LanguageTypes;
  children: React.ReactElement;
}

export interface IListWrapperProps<T, V> {
  filter?: T | null;
  onClick?(filter: V | null): void;
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
      <div ref={ref}>{props.children}</div>
    </ConfigContext.Provider>
  );
};

export const PeopleWidgetComponent = (
  props: IListWrapperProps<IMovie, IPeople>,
) => {
  return <PeopleWidget {...props} />;
};

export const MovieWidgetComponent = (
  props: IListWrapperProps<IPeople, IMovie>,
) => {
  return <MovieWidget {...props} />;
};
