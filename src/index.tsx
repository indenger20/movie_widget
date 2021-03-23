import * as React from 'react';
import ActorsWidget from './Widgets/ActorsWidget';
import MovieWidget from './Widgets/MovieWidget';
import { ITheme } from './interfaces';
import { defaultTheme } from './const';
import { useEffect } from 'react';
import _ from 'lodash';

interface IWidgetProvider {
  theme?: ITheme;
  children: React.ReactElement;
}

export const WidgetProvider: React.FC<IWidgetProvider> = (props) => {
  const { theme } = props;

  useEffect(() => {
    const currentTheme = _.merge(defaultTheme, theme);
    const { colors = {} } = currentTheme;
    Object.keys(colors).forEach((key) => {
      document.body.style.setProperty(`--widget-${key}`, colors[key]);
    });
  }, [props.theme]);

  return props.children;
};

export const ActorsWidgetComponent = () => {
  return <ActorsWidget />;
};

export const MovieWidgetComponent = () => {
  return <MovieWidget />;
};
