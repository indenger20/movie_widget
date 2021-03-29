import React from 'react';
import { IMovie } from 'interfaces';
import styles from '../../../../widget.module.css';
import { getImagePath } from 'helpers';
import EmptyImage from 'components/EmptyImage';

interface IMovieCardProps {
  movie: IMovie;
}

function MovieCard(props: IMovieCardProps) {
  const {
    movie: { title, poster_path },
  } = props;
  return (
    <div className={styles.movieCard}>
      <div className={styles.movieCardWrapper}>
        <span className={styles.movieCardTitle}>{title}</span>
        {poster_path ? (
          <img
            src={getImagePath(poster_path)}
            className={styles.movieCardPoster}
            alt={title}
          />
        ) : (
          <EmptyImage />
        )}
      </div>
    </div>
  );
}

export default MovieCard;
