import React from 'react';
import styles from '../../widget.module.css';

function EmptyImage() {
  return (
    <div className={styles.movieCardPosterEmpty}>
      <img src='https://www.flaticon.com/premium-icon/icons/svg/3875/3875433.svg' />
    </div>
  );
}

export default EmptyImage;
