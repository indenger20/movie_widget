import { DEFAULT_PAGE } from 'const';
import { PaginationWrapper } from 'interfaces';

export const resetListPaginatedModel = (): PaginationWrapper => ({
  results: [],
  page: DEFAULT_PAGE,
  total_pages: 1,
  total_results: 1,
});
