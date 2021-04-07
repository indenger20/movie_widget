import {
  ICreateListBrowserWidget,
  IListWrapperProps,
  WidgetTypes,
} from 'index';
import { IMovie, IPeople } from 'interfaces';
import React from 'react';
import MovieWidget from 'Widgets/MovieWidget';
import PeopleWidget from 'Widgets/PeopleWidget';

const widgets: {
  [key in WidgetTypes]: (
    _props: ICreateListBrowserWidget['config'],
  ) => JSX.Element;
} = {
  movie: (props: IListWrapperProps<IPeople, IMovie>) => (
    <MovieWidget {...props} />
  ),
  people: (props: IListWrapperProps<IMovie, IPeople>) => (
    <PeopleWidget {...props} />
  ),
};

export const createSpesificWidget = (
  widget: ICreateListBrowserWidget,
): JSX.Element => {
  const { config, type } = widget;

  return widgets[type](config);
};
