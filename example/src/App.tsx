import React, { useState } from 'react';

import {
  WidgetProvider,
  IWidgetProvider,
  MovieWidgetComponent,
  PeopleWidgetComponent,
  Languages,
  Movie,
  People,
} from 'movie_widget';
import 'movie_widget/dist/index.css';

import './index.css';

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

const options: Languages[] = ['ru', 'en'];

const App = () => {
  const [theme, setTheme] = useState<keyof ITheme>('light');
  const [language, setLanguage] = useState<Languages>('en');
  const [selectedMovie, selectMovie] = useState<Movie | null>(null);
  const [selectedPeople, selectPeople] = useState<People | null>(null);

  const handleChange = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Languages);
  };

  return (
    <WidgetProvider theme={themes[theme]} language={language}>
      <div className='wrapper'>
        <h1 className='title'>My website title</h1>
        <div>
          <button onClick={handleChange} className='btn'>
            Change Theme
          </button>
          <select value={language} onChange={handleChangeLanguage}>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className='widget-box'>
          <MovieWidgetComponent
            className='movie-widget'
            onSelect={selectMovie}
            filter={selectedPeople}
          />
          <PeopleWidgetComponent
            className='actors-widget'
            filter={selectedMovie}
            onSelect={selectPeople}
          />
        </div>
      </div>
    </WidgetProvider>
  );
};

export default App;
