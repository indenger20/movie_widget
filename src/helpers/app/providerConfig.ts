import { MOVIE_API_PATH } from 'config/appConfig';
import { defaultTheme } from 'const';
import { createLocalization } from 'i18n/config';
import { IProviderConfig, ITheme, IWidgetProvider, LanguageTypes } from 'index';
import { httpApi } from './httpApi';

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
