import { IWidgetProvider, Languages } from 'movie_widget';

export const lightTheme: IWidgetProvider['theme'] = {
  colors: { primary: 'green', dark: '#eee' },
};

export const darkTheme: IWidgetProvider['theme'] = {
  colors: { primary: 'green', dark: '#000' },
};

export interface ITheme {
  light: IWidgetProvider['theme'];
  dark: IWidgetProvider['theme'];
}

export const themes: ITheme = {
  light: lightTheme,
  dark: darkTheme,
};

export const options: Languages[] = ['ru', 'en'];
