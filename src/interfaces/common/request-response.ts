export interface IPagination {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface PaginationWrapper<T = any> extends IPagination {
  results: T[];
}

export const resetListPaginatedModel = (): PaginationWrapper => ({
  results: [],
  page: 1,
  total_pages: 1,
  total_results: 1,
});
