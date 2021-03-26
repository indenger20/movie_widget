import { QueryParams } from 'interfaces';

export const DEFAULT_PAGE = 1;

export const resetQueryParamsModel = (params: QueryParams): QueryParams => ({
  query: '',
  limit: 10,
  page: DEFAULT_PAGE,
  filter: null,
  language: 'en',
  ...params,
});
