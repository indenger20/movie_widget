import TextInput from 'components/TextInput';
import React, { useEffect } from 'react';
import styles from './search.module.css';
import { useImmer } from 'use-immer';
import { usePrevious } from 'hooks';
import { useTranslation } from 'react-i18next';
import { LanguageTypes } from 'interfaces';

interface ISearchProps {
  language: LanguageTypes;
  onChange(query: string): void;
}

function Search(props: ISearchProps) {
  const [query, setQuery] = useImmer('');
  const { onChange, language } = props;
  const prevQuery = usePrevious(query);
  const { t } = useTranslation();

  useEffect(() => {
    if (prevQuery !== query) {
      onChange(query);
    }
  }, [query]);

  useEffect(() => {
    setQuery('');
  }, [language]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <form className={styles.search}>
      <TextInput
        name='search'
        onChange={handleChange}
        value={query}
        placeholder={t('searchPlaceholder')}
      />
    </form>
  );
}

export default Search;
