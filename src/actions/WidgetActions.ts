import { MOVIE_API_PATH } from 'config/appConfig';
import { DEFAULT_PAGE, listWithPaginationInitialState } from 'const';
import { httpApi } from 'helpers';
import { ICredit, IPeopleList, QueryParams } from 'interfaces';

const api = httpApi(MOVIE_API_PATH);

export const getWidgetListActions = async <T>(payload: {
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

export const getPeopleByMovieActions = async (payload: {
  path: string;
  params: QueryParams;
}) => {
  const { params, path } = payload;

  try {
    const result = await api.get<ICredit>(path, { params });
    const list: IPeopleList = {
      results: result.data.credits.cast,
      page: DEFAULT_PAGE,
      total_results: result.data.credits.cast.length,
      total_pages: DEFAULT_PAGE,
    };
    return list;
  } catch (err) {
    return listWithPaginationInitialState();
  }
};
