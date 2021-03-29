import React, { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import MovieWidget from 'Widgets/MovieWidget';
import { ITheme } from './interfaces';

import 'react-toastify/dist/ReactToastify.css';

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTheme = merge(defaultTheme, theme);
    const { colors = {} } = currentTheme;

    Object.keys(colors).forEach((key) => {
      if (ref.current) {
        ref.current.style.setProperty(`--widget-${key}`, colors[key]);
      }
    });
  }, [props.theme]);

  return (
    <div ref={ref}>
      {props.children}
      <ToastContainer />
    </div>
  );
};

export const MovieWidgetComponent = (props: IWidgetProps) => {
  return <MovieWidget {...props} />;
};
