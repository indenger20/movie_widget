import { WidgetTypes } from 'interfaces';

export const widgetPaths = {
  [WidgetTypes.MOVIE]: {
    true: '/search/movie',
    false: '/movie/popular',
  },
  [WidgetTypes.PEOPLE]: {
    true: '/search/person',
    false: '/person/popular',
  },
};

export const widgetTitles = {
  [WidgetTypes.MOVIE]: 'Search Movies',
  [WidgetTypes.PEOPLE]: 'Search Peoples',
};
