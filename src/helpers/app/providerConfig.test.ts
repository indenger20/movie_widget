import { defaultTheme } from 'const';
import { ITheme } from 'index';
import { ProviderConfig } from './providerConfig';

describe('ProviderConfig', () => {
  let configService: ProviderConfig;

  beforeEach(() => {
    configService = new ProviderConfig({ apiKey: '123', language: 'en' });
  });

  test('Language is changed', () => {
    const config = configService.getCongig();

    configService.updateLanguage('ru');

    expect(configService.getCongig()).toEqual(
      Object.assign(config, { language: 'ru' }),
    );
  });

  test('Theme is changed', () => {
    const updatedColors: ITheme['colors'] = {
      dark: 'green',
      secondary: 'red',
    };
    const expectTheme: ITheme = {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        ...updatedColors,
      },
    };

    configService.updateTheme({ colors: updatedColors });

    expect(configService.getCongig().theme).toEqual(expectTheme);
  });
});
