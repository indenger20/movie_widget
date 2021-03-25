import React from 'react';
import { IMovie } from 'interfaces';
import styles from '../../../widget.module.css';
import { MOVIE_IMAGE_PATH } from 'config/appConfig';

interface IMovieCardProps {
  movie: IMovie;
}

const path = MOVIE_IMAGE_PATH;

function MovieCard(props: IMovieCardProps) {
  const {
    movie: { title, poster_path, vote_average },
  } = props;
  const ratingPersent = vote_average * 10;
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetCardWrapper}>
        <span className={styles.widgetCardTitle}>{title}</span>
        <div className={styles.widgetCardRating}>
          <span className={styles.widgetCardRatingTitle}>Rating</span>
          <div className={styles.widgetCardRatingProgress}>
            <span className={styles.widgetCardRatingText}>{vote_average}</span>
            <div
              className={styles.widgetCardRatingProgressBar}
              style={{ width: `${ratingPersent}%` }}
            />
          </div>
        </div>
        {poster_path ? (
          <img
            src={`${path}/w500${poster_path}`}
            className={styles.widgetCardPoster}
            alt={title}
          />
        ) : (
          <div className={styles.widgetCardPosterEmpty}>
            <img src='https://www.flaticon.com/premium-icon/icons/svg/3875/3875433.svg' />
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
