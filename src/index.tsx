import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import React, { useEffect } from 'react';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { ITheme } from './interfaces';

export interface IWidgetProvider {
  theme?: ITheme;
  children: React.ReactElement;
}

export interface IWidgetProps {
  filter?: number;
  className?: string;
}

export const WidgetProvider: React.FC<IWidgetProvider> = (props) => {
  const { theme } = props;

  useEffect(() => {
    const currentTheme = merge(defaultTheme, theme);
    const { colors = {} } = currentTheme;

    Object.keys(colors).forEach((key) => {
      document.body.style.setProperty(`--widget-${key}`, colors[key]);
    });
  }, [props.theme]);

  return props.children;
};

export const PeopleWidgetComponent = (props: IWidgetProps) => {
  return <PeopleWidget {...props} />;
};

export const MovieWidgetComponent = (props: IWidgetProps) => {
  return <MovieWidget {...props} />;
};
