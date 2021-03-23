export interface QueryParams {
  query: string;
  filter: string | null;
  limit: number;
  page: number;
  language: 'en' | 'uk'; // ISO 639-1 standard language codes
}

export const resetQueryParamsModel = (): QueryParams => ({
  query: '',
  limit: 10,
  page: 1,
  filter: null,
  language: 'en',
});
