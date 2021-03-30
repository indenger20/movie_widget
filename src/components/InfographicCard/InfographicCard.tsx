import React from 'react';
import styles from '../../widget.module.css';
import { getImagePath } from 'helpers';
import ImagePlaceholder from 'components/ImagePlaceholder';
import { useTranslation } from 'react-i18next';

interface IInfographicCardProps {
  title: string;
  ratingPersent: number;
  imagePath: string | null;
}

function InfographicCard(props: IInfographicCardProps) {
  const { imagePath, ratingPersent, title } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetCardWrapper}>
        <span className={styles.widgetCardTitle}>{title}</span>
        <div className={styles.widgetCardRating}>
          <span className={styles.widgetCardRatingTitle}>
            {t('list.rating')}
          </span>
          <div className={styles.widgetCardRatingProgress}>
            <span className={styles.widgetCardRatingText}>{ratingPersent}</span>
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

export default InfographicCard;
