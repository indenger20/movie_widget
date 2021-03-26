import React, { useState } from 'react';

import {
  WidgetProvider,
  IWidgetProvider,
  MovieWidgetComponent,
  PeopleWidgetComponent,
} from 'movie_widget';
import 'movie_widget/dist/index.css';

const lightTheme: IWidgetProvider['theme'] = {
  colors: { primary: 'green', dark: '#eee' },
};

const darkTheme: IWidgetProvider['theme'] = {
  colors: { primary: 'green', dark: '#000' },
};

interface ITheme {
  light: IWidgetProvider['theme'];
  dark: IWidgetProvider['theme'];
}

const themes: ITheme = {
  light: lightTheme,
  dark: darkTheme,
};

const App = () => {
  const [theme, setTheme] = useState<keyof ITheme>('light');
  const handleChange = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };
  return (
    <WidgetProvider theme={themes[theme]}>
      <div className='wrapper'>
        <h1 className='title'>My website title</h1>
        <button onClick={handleChange} className='btn'>
          Change Theme
        </button>
        <div className='widget-box'>
          <MovieWidgetComponent className='movie-widget' />
          <PeopleWidgetComponent className='actors-widget' />
        </div>
      </div>
    </WidgetProvider>
  );
};

export default App;
