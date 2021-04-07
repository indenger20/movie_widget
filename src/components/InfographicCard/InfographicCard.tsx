import React from 'react';
import styles from '../../widget.module.css';
import { getImagePath } from 'helpers';
import ImagePlaceholder from 'components/ImagePlaceholder';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface IInfographicCardProps {
  title: string;
  ratingPersent: number;
  imagePath: string | null;
  id: number;
  selectedId: number | null;
  onClick(): void;
}

function InfographicCard(props: IInfographicCardProps) {
  const { imagePath, ratingPersent, title, onClick, selectedId, id } = props;
  const { t } = useTranslation();
  const isActive = id === selectedId;
  return (
    <div className={clsx(styles.widgetCard)} onClick={onClick}>
      <div
        className={clsx(
          styles.widgetCardWrapper,
          isActive && styles.widgetCardActive,
        )}
      >
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
