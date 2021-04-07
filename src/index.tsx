import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';
import merge from 'lodash.merge';
import PeopleWidget from 'Widgets/PeopleWidget';
import MovieWidget from 'Widgets/MovieWidget';
import { IMovie, IPeople, ITheme, LanguageTypes } from 'interfaces';
import { createSpesificWidget } from 'helpers';
import { IProviderConfig, ProviderConfig } from 'helpers/app/providerConfig';

export type WidgetTypes = 'movie' | 'people';

export interface IWidgetProvider {
  apiKey: string;
  theme?: ITheme;
  language?: LanguageTypes;
  children: (config: IProviderConfig) => React.ReactElement;
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
