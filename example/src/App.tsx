import React, { useState } from 'react';

import {
  WidgetProvider,
  IWidgetProvider,
  MovieWidgetComponent,
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
        <MovieWidgetComponent className='movie-widget' />
      </div>
    </WidgetProvider>
  );
};

export default App;
