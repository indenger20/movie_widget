import React, { useEffect, useState } from 'react';
import styles from '../../widget.module.css';
import { getMoviesAction } from 'actions';
import { IMovieList, resetListPaginatedModel } from 'interfaces';
import { IWidgetProps } from 'index';
import Search from 'components/Search';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from './components/MovieCard';

interface IWidgetState {
  movieList: IMovieList;
  searchQuery: string;
  hasMore: boolean;
}

const initialState: IWidgetState = {
  movieList: resetListPaginatedModel(),
  searchQuery: '',
  hasMore: false,
};

function MovieWidget(props: IWidgetProps) {
  const { filter, className = '' } = props;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const init = async () => {
      const movieList = await getMoviesAction({ page: 1 });
      const hasMore = movieList.total_pages > movieList.page;
      setState({ ...state, hasMore, movieList: movieList });
    };
    init();
  }, []);

  const handleSearch = _.debounce(async (query: string) => {
    const movieList = await getMoviesAction({ page: 1, query });
    const hasMore = movieList.total_pages > movieList.page;
    setState({ ...state, hasMore, movieList, searchQuery: query });
  }, 500);

  const fetchMoreData = async () => {
    const {
      searchQuery,
      movieList: { page, total_pages },
    } = state;
    const newPage = page + 1;
    if (newPage <= total_pages) {
      const movieList = await getMoviesAction({
        page: newPage,
        query: searchQuery,
      });
      const hasMore = movieList.total_pages > movieList.page;
      const updatedList = {
        ...movieList,
        results: [...state.movieList.results, ...movieList.results],
      };
      setState({ ...state, hasMore, movieList: updatedList });
    } else {
      setState({ ...state, hasMore: false });
    }
  };

  const {
    hasMore,
    movieList: { results },
  } = state;

  return (
    <div className={`${styles.widgetWrapper} ${className}`}>
      <span className={styles.widgetTitle}>Search Movies</span>
      <Search onChange={handleSearch} />
      <div className={styles.widgetList}>
        <InfiniteScroll
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

export default MovieWidget;
