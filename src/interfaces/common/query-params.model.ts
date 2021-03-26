import { LanguageTypes } from 'interfaces';

export interface QueryParams {
  query?: string;
  filter?: string | null;
  limit?: number;
  page?: number;
  language?: LanguageTypes; // ISO 639-1 standard language codes
}
