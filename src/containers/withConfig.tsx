import clsx from 'clsx';
import { IProviderConfig, IWidgetConfig } from 'index';

import React, { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';

import styles from '../widget.module.css';

type IProps = IWidgetConfig & {
  config: IProviderConfig;
};

export const withConfig = (ChildComponent: any) => {
  const Wrapper: React.FC<IProps> = (props) => {
    const { config, className } = props;
    const { language, theme, i18n } = config;

    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      i18n.changeLanguage(language);
    }, [language]);

    useEffect(() => {
      const { colors = {} } = theme;

      Object.keys(colors).forEach((key) => {
        if (widgetRef.current) {
          widgetRef.current.style.setProperty(`--widget-${key}`, colors[key]);
        }
      });
    }, [theme, theme.colors]);

    return (
      <I18nextProvider i18n={config.i18n}>
        <div className={clsx(styles.widgetWrapper, className)} ref={widgetRef}>
          {<ChildComponent {...props} />}
        </div>
      </I18nextProvider>
    );
  };
  return Wrapper;
};
