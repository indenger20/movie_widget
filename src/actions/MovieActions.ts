import { MOVIE_API_PATH } from 'config/appConfig';
import { httpApi, prepareMovieDataToUrl } from 'helpers';
import { IMovieList, QueryParams, resetListPaginatedModel } from 'interfaces';

export const getMoviesAction = async (payload: QueryParams) => {
  let path = `/search/movie`;
  let params = { ...payload };

  if (payload.query) {
    path = `/search/movie`;
    params = { ...payload };
  } else if (!payload.query) {
    path = `/movie/popular`;
  }

  try {
    const result = await httpApi<IMovieList>({
      partUrl: `${path}?${prepareMovieDataToUrl(params)}`,
      method: 'GET',
      baseURL: MOVIE_API_PATH,
      data: {},
    });
    if (result.data) {
      return result.data;
    }

    return resetListPaginatedModel();
  } catch (err) {
    return resetListPaginatedModel();
  }
};