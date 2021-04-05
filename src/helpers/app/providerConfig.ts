import { AxiosInstance } from 'axios';
import { i18n } from 'i18next';
import { MOVIE_API_PATH } from 'config/appConfig';
import { defaultTheme } from 'const';
import { createLocalization } from 'i18n/config';
import { IWidgetProvider } from 'index';
import { ITheme, LanguageTypes } from 'interfaces';
import { httpApi } from './httpApi';

export type IProviderConfig = {
  theme: ITheme;
  language: LanguageTypes;
  api: AxiosInstance;
  i18n: i18n;
};

export class ProviderConfig {
  private config: IProviderConfig;
  constructor(config: IWidgetProvider) {
    const api = httpApi({
      apiKey: config.apiKey,
      baseURL: MOVIE_API_PATH,
      handleError: config.onError,
    });
    const i18n = createLocalization();
    this.config = {
      language: config.language || 'en',
      theme: {
        colors: {
          ...defaultTheme.colors,
          ...config.theme?.colors,
        },
      },
      api,
      i18n,
    };
  }

  updateLanguage(language: LanguageTypes) {
    this.config = {
      ...this.config,
      language,
    };
  }

  updateTheme(theme: ITheme) {
    this.config = {
      ...this.config,
      theme: {
        colors: {
          ...this.config.theme.colors,
          ...theme.colors,
        },
      },
    };
  }

  getCongig() {
    return this.config;
  }
}
