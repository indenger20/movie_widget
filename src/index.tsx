import React, { useEffect, useMemo, useRef } from 'react';
import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { IMovie, IPeople, ITheme, LanguageTypes } from './interfaces';
import { AxiosContext, ConfigContext } from 'context';
import { useConfig } from 'hooks';

import './i18n/config';
import { MOVIE_API_PATH } from 'config/appConfig';
import { httpApi } from 'helpers/app/httpApi';

export type Languages = LanguageTypes;
export type Movie = IMovie;
export type People = IPeople;

export interface IWidgetProvider {
  apiKey: string;
  theme?: ITheme;
  language?: LanguageTypes;
  children: React.ReactElement;
  onError?(err: string): void;
}

export interface IListWrapperProps<T, V> {
  filter?: T | null;
  onSelect?(filter: V | null): void;
  className?: string;
}

export const WidgetProvider: React.FC<IWidgetProvider> = (props) => {
  const { theme, language, onError, apiKey } = props;

  const api = useMemo(
    () => httpApi({ apiKey, baseURL: MOVIE_API_PATH, handleError: onError }),
    [],
  );

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
    <AxiosContext.Provider value={{ axios: api }}>
      <ConfigContext.Provider value={{ config, setLanguage }}>
        <div ref={ref}>{props.children}</div>
      </ConfigContext.Provider>
    </AxiosContext.Provider>
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
