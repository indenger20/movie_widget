import { resetListPaginatedModel } from 'const';
import { httpApi } from 'helpers';
import { QueryParams } from 'interfaces';

const api = httpApi();

export const getMoviesAction = async (payload: QueryParams) => {
  const path = payload.query ? '/search/movie' : '/movie/popular';

  try {
    const result = await api.get(path, { params: payload });

    return result.data;
  } catch (err) {
    return resetListPaginatedModel();
  }
};
