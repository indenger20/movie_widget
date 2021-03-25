import React from 'react';
import styles from '../../widget.module.css';

import { IMovieList } from 'interfaces';
import Search from 'components/Search';
import MovieCard from '../components/MovieCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IWidgetProps, WidgetType, withWidget } from 'containers';

function MovieWidget(props: IWidgetProps<IMovieList>) {
  const {
    hasMore,
    isLoading,
    list: { results },
    onSearch,
    fetchMoreData,
    className,
  } = props;

  return (
    <div className={`${styles.widgetWrapper} ${className}`}>
      <span className={styles.widgetTitle}>Search Movies</span>
      <Search onChange={onSearch} />
      <div className={styles.widgetList}>
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={results.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {results.map((card) => (
            <MovieCard key={card.id} movie={card} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default withWidget(WidgetType.MOVIE, MovieWidget);
