import TextInput from 'components/TextInput';
import React, { useEffect } from 'react';
import styles from './search.module.css';
import { useImmer } from 'use-immer';
import { usePrevious } from 'hooks';

interface ISearchProps {
  onChange(query: string): void;
}

function Search(props: ISearchProps) {
  const [query, setQuery] = useImmer('');
  const { onChange } = props;
  const prevQuery = usePrevious(query);

  useEffect(() => {
    if (prevQuery !== query) {
      onChange(query);
    }
  }, [query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <form className={styles.search}>
      <TextInput
        name='search'
        onChange={handleChange}
        value={query}
        placeholder='Enter search query'
      />
    </form>
  );
}

export default Search;
