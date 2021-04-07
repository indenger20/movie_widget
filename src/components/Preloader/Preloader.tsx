import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './preloader.module.css';

function Preloader() {
  const { t } = useTranslation();
  return <h4 className={styles.preloader}>{t('loading')}</h4>;
}

export default Preloader;
