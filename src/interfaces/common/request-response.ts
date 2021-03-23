export interface IPagination {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface PaginationWrapper<T = any> extends IPagination {
  result: T[];
}

export const resetListPaginatedModel = (): PaginationWrapper => ({
  result: [],
  page: 1,
  total_pages: 1,
  total_results: 1,
});
