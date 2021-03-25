import React, { useState } from 'react';

import {
  WidgetProvider,
  IWidgetProvider,
  MovieWidgetComponent,
  PeopleWidgetComponent,
} from 'movie_widget';
import 'movie_widget/dist/index.css';

const App = () => {
  const [theme, setTheme] = useState<IWidgetProvider['theme']>({});
  const handleChange = () => {
    setTheme({ colors: { primary: 'green', dark: '#000' } });
  };
  return (
    <WidgetProvider theme={theme}>
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
