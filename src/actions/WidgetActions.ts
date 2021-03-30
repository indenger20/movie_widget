import { MOVIE_API_PATH } from 'config/appConfig';
import { listWithPaginationInitialState } from 'const';
import { httpApi } from 'helpers';
import { IMovieList, IPeopleList, QueryParams } from 'interfaces';

const api = httpApi(MOVIE_API_PATH);

export const getWidgetListActions = async <
  T = IMovieList | IPeopleList
>(payload: {
  path: string;
  params: QueryParams;
}) => {
  const { params, path } = payload;

  try {
    const result = await api.get<T>(path, { params });

    return result.data;
  } catch (err) {
    return listWithPaginationInitialState();
  }
};
