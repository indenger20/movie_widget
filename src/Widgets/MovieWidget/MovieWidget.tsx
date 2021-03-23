import React, { useEffect, useState } from 'react';
import styles from '../../widget.module.css';
import { getMoviesAction } from 'actions';
import { IMovie, resetQueryParamsModel } from 'interfaces';

function MovieWidget() {
  const [movies, updateMovie] = useState<IMovie[]>([]);

  useEffect(() => {
    const init = async () => {
      const movies = await getMoviesAction(resetQueryParamsModel());
      updateMovie(movies);
    };
    init();
  }, []);

  return <div className={styles.widgetWrapper}>Movie2</div>;
}

export default MovieWidget;
