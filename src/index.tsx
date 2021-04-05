import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';
import { defaultTheme } from 'const';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { IMovie, IPeople, ITheme, LanguageTypes } from 'interfaces';
import { AxiosContext, ConfigContext } from 'context';
import { useConfig } from 'hooks';

import './i18n/config';
import { MOVIE_API_PATH } from 'config/appConfig';
import { httpApi } from 'helpers/app/httpApi';
import clsx from 'clsx';
import { createSpesificWidget } from 'helpers';
import { IProviderConfig, ProviderConfig } from 'helpers/app/providerConfig';

const providerConfig = new ProviderConfig();

export type WidgetTypes = 'movie' | 'people';

export interface IWidgetProvider {
  apiKey: string;
  theme?: ITheme;
  language?: LanguageTypes;
  children: React.ReactElement;
  className?: string;
  onError?(err: string): void;
}

export interface IListWrapperProps<T, V> {
  filter?: T | null;
  onSelect?(filter: V | null): void;
  className?: string;
}

export interface ICreateListBrowserWidget {
  type: WidgetTypes;
  insertId: string;
  config:
    | IListWrapperProps<IPeople, IMovie>
    | IListWrapperProps<IMovie, IPeople>;
}

export interface IListBrowserWidget extends ICreateListBrowserWidget {
  id: string; // uuid
}

export interface IBrowserProvider extends IWidgetProvider {
  insertId: string;
}

export type Languages = LanguageTypes;
export type Movie = IMovie;
export type People = IPeople;

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

export class BrowserProvider {
  private configServise = providerConfig;
  private props: IProviderConfig;
  private widgets: IListBrowserWidget[] = [];
  constructor(providerProps: IBrowserProvider) {
    const updatedConfig = this.configServise.add(providerProps);
    this.props = {
      ...updatedConfig,
    };
  }

  private renderWidgets() {
    const widgets = this.widgets;
    const { className } = this.props;
    return (
      <div className={clsx(className)}>
        {widgets.map((widget, i) => {
          const component = createSpesificWidget(widget);
          const widgetElement = React.cloneElement(component, { key: i });

          return widgetElement;
        })}
      </div>
    );
  }

  createListWidget(props: ICreateListBrowserWidget) {
    const widget: IListBrowserWidget = {
      ...props,
      id: uuid(),
    };
    this.widgets.push(widget);
    return widget;
  }

  removeWidget(id: IListBrowserWidget['id']) {
    const updatedWidgets = this.widgets.filter((w) => w.id !== id);
    this.widgets = updatedWidgets;

    this.render();
  }

  updateWidget(props: IListBrowserWidget) {
    const updatedWidgets = this.widgets.map((w) => {
      if (w.id === props.id) {
        return merge(w, props);
      }
      return w;
    });

    this.widgets = updatedWidgets;
    this.render();
  }

  updateLanguage(language: Languages) {
    this.props.language = language;
    this.render();
  }

  updateTheme(theme: ITheme) {
    this.props.theme = merge(this.props.theme, theme);
    this.render();
  }

  render() {
    const { insertId, ...res } = this.props;
    ReactDOM.render(
      <WidgetProvider {...res}>{this.renderWidgets()}</WidgetProvider>,
      document.getElementById(insertId),
    );
  }
}
