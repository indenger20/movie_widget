import React from 'react';

import { WidgetProvider, MovieWidgetComponent } from 'movie_widget';
import 'movie_widget/dist/index.css';

const App = () => {
  return (
    <WidgetProvider theme={{}}>
      <>
        <h1>My website title</h1>
        <MovieWidgetComponent />
      </>
    </WidgetProvider>
  );
};

export default App;
