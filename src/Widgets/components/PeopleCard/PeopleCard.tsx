import React from 'react';
import { IMovie, IPeople } from 'interfaces';
import styles from '../../../widget.module.css';
import { MOVIE_IMAGE_PATH } from 'config/appConfig';

interface IMovieCardProps {
  people: IPeople;
}

const path = MOVIE_IMAGE_PATH;

function PeopleCard(props: IMovieCardProps) {
  const {
    people: { name, profile_path, popularity },
  } = props;
  const ratingPersent = popularity;
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetCardWrapper}>
        <span className={styles.widgetCardTitle}>{name}</span>
        <div className={styles.widgetCardRating}>
          <span className={styles.widgetCardRatingTitle}>Rating</span>
          <div className={styles.widgetCardRatingProgress}>
            <span className={styles.widgetCardRatingText}>{popularity}</span>
            <div
              className={styles.widgetCardRatingProgressBar}
              style={{ width: `${ratingPersent}%` }}
            />
          </div>
        </div>
        {profile_path ? (
          <img
            src={`${path}/w500${profile_path}`}
            className={styles.widgetCardPoster}
            alt={name}
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

export default PeopleCard;
