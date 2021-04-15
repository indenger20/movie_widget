import { ITheme } from 'index';
import { ProviderConfig } from './providerConfig';
import { defaultTheme } from 'const';

describe('ProviderConfig', () => {
  let configService: ProviderConfig;

  beforeEach(() => {
    configService = new ProviderConfig({ apiKey: '123', language: 'en' });
  });

  test('Should change language', () => {
    const config = configService.getCongig();

    configService.updateLanguage('ru');

    expect(configService.getCongig()).toEqual(
      Object.assign(config, { language: 'ru' }),
    );
  });

  test('Should change theme', () => {
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
