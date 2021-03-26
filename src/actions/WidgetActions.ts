import { MOVIE_API_PATH } from 'config/appConfig';
import { resetListPaginatedModel, widgetPaths } from 'const';
import { httpApi } from 'helpers';
import { QueryParams, WidgetTypes } from 'interfaces';

const api = httpApi(MOVIE_API_PATH);

const getWidgetApiPath = (type: WidgetTypes, query?: string): string => {
  return widgetPaths[type][String(Boolean(query))];
};

export const getWidgetListActions = async <T = any>(payload: {
  type: WidgetTypes;
  params: QueryParams;
}) => {
  const { params, type } = payload;
  const path = getWidgetApiPath(type, params.query);

  try {
    const result = await api.get<T>(path, { params });

    return result.data;
  } catch (err) {
    return resetListPaginatedModel();
  }
};
