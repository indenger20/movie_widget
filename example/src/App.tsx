import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  WidgetProvider,
  MovieWidgetComponent,
  PeopleWidgetComponent,
  LanguageTypes,
  IMovie,
  IPeople,
} from 'movie_widget';
import 'movie_widget/dist/index.css';

import './index.css';
import { ITheme, options, themes } from './const';
import { MOVIE_API_KEY } from './config';

const App = () => {
  const [theme, setTheme] = useState<keyof ITheme>('light');
  const [language, setLanguage] = useState<LanguageTypes>('en');
  const [selectedMovie, selectMovie] = useState<IMovie | null>(null);
  const [selectedPeople, selectPeople] = useState<IPeople | null>(null);

  const handleChange = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageTypes);
  };

  const handleError = (err: string) => {
    toast.error(err);
  };

  return (
    <>
      <WidgetProvider
        apiKey={MOVIE_API_KEY}
        theme={themes[theme]}
        language={language}
        onError={handleError}
      >
        {(config) => {
          return (
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
                  config={config}
                />
                <PeopleWidgetComponent
                  className='actors-widget'
                  filter={selectedMovie}
                  onSelect={selectPeople}
                  config={config}
                />
              </div>
            </div>
          );
        }}
      </WidgetProvider>
      <ToastContainer />
    </>
  );
};

export default App;
