import { MOVIE_API_PATH } from 'config/appConfig';
import { DEFAULT_PAGE, listWithPaginationInitialState } from 'const';
import { httpApi } from 'helpers';
import {
  ICredit,
  IMovie,
  IMovieList,
  IPeopleList,
  QueryParams,
} from 'interfaces';

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

export const getMoviesByPeopleActions = async (payload: {
  path: string;
  params: QueryParams;
}) => {
  const { params, path } = payload;

  try {
    const result = await api.get<IMovieList>(path, { params });
    const movies = result.data.results;

    for (
      let index = result.data.page + 1;
      index <= result.data.total_pages;
      index++
    ) {
      const updatedParams: QueryParams = {
        ...params,
        page: index,
      };
      const result = await api.get<IMovieList>(path, { params: updatedParams });
      movies.push(...result.data.results);
    }

    const list: IMovieList = {
      results: movies,
      page: DEFAULT_PAGE,
      total_results: movies.length,
      total_pages: DEFAULT_PAGE,
    };
    return list;
  } catch (err) {
    return listWithPaginationInitialState();
  }
};
