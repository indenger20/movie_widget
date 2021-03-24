import TextInput from 'components/TextInput';
import React, { useState } from 'react';
import styles from './search.module.css';

interface ISearchProps {
  onChange(query: string): void;
}

function Search(props: ISearchProps) {
  const [query, setQuery] = useState('');
  const { onChange } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onChange(event.target.value);
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
