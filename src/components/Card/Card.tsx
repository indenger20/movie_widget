import React from 'react';
import styles from '../../widget.module.css';
import { getImagePath } from 'helpers';
import ImagePlaceholder from 'components/ImagePlaceholder';

interface ICardProps {
  title: string;
  ratingPersent: number;
  imagePath: string | null;
  voteAvarage: number;
}

function Card(props: ICardProps) {
  const { imagePath, ratingPersent, title, voteAvarage } = props;
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetCardWrapper}>
        <span className={styles.widgetCardTitle}>{title}</span>
        <div className={styles.widgetCardRating}>
          <span className={styles.widgetCardRatingTitle}>Rating</span>
          <div className={styles.widgetCardRatingProgress}>
            <span className={styles.widgetCardRatingText}>{voteAvarage}</span>
            <div
              className={styles.widgetCardRatingProgressBar}
              style={{ width: `${ratingPersent}%` }}
            />
          </div>
        </div>
        {imagePath ? (
          <img
            src={getImagePath(imagePath)}
            className={styles.widgetCardPoster}
            alt={title}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
    </div>
  );
}

export default Card;
