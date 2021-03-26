import { DEFAULT_PAGE } from 'const';

export interface IPagination {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface PaginationWrapper<T = any> extends IPagination {
  results: T[];
}
