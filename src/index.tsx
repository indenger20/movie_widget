import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { createSpesificWidget } from 'helpers';
import { ProviderConfig } from 'helpers/app/providerConfig';
import { AxiosInstance } from 'axios';
import { i18n } from 'i18next';

export type WidgetTypes = 'movie' | 'people';
export type LanguageTypes = 'en' | 'ru';

export interface ITheme {
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    light?: string;
    dark?: string;
  };
}

export interface IMovie {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: LanguageTypes;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface IPeople {
  profile_path: string;
  adult: boolean;
  id: number;
  name: string;
  popularity: number;
}

export type IProviderConfig = {
  theme: ITheme;
  language: LanguageTypes;
  api: AxiosInstance;
  i18n: i18n;
};

export interface IWidgetProvider {
  apiKey: string;
  theme?: ITheme;
  language?: LanguageTypes;
  children?: (config: IProviderConfig) => React.ReactElement;
  className?: string;
  onError?(err: string): void;
}

export interface IListWrapperProps<T, V> {
  filter?: T | null;
  onSelect?(filter: V | null): void;
  className?: string;
  config: IProviderConfig;
}

export type IWidgetConfig =
  | IListWrapperProps<IPeople, IMovie>
  | IListWrapperProps<IMovie, IPeople>;

export interface ICreateListBrowserWidget {
  type: WidgetTypes;
  insertId: string;
  config: IWidgetConfig;
}

export interface IListBrowserWidget extends ICreateListBrowserWidget {
  id: string; // uuid
}

export type Languages = LanguageTypes;
export type Movie = IMovie;
export type People = IPeople;

export const WidgetProvider: React.FC<IWidgetProvider> = (props) => {
  if (!props.children) return null;

  const config = useMemo(() => {
    const configServise = new ProviderConfig(props);
    return configServise.getCongig();
  }, [props]);

  return props.children(config);
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
  private configServise: ProviderConfig;
  private widgets: IListBrowserWidget[] = [];
  constructor(providerProps: IWidgetProvider) {
    this.configServise = new ProviderConfig(providerProps);
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

    const domElement = document.getElementById(id);
    domElement?.remove();
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
    this.configServise.updateLanguage(language);
    this.render();
  }

  updateTheme(theme: ITheme) {
    this.configServise.updateTheme(theme);
    this.render();
  }

  render() {
    const widgets = this.widgets;
    const config = this.configServise.getCongig();

    for (let i = 0; i < widgets.length; i += 1) {
      const widget = widgets[i];
      const component = createSpesificWidget(widget);

      const widgetElement = React.cloneElement(component, {
        config,
      });

      ReactDOM.render(
        <div id={widget.id} key={widget.id}>
          {widgetElement}
        </div>,
        document.getElementById(widget.insertId),
      );
    }
  }
}
