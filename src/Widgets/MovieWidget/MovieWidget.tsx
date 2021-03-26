import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import clsx from 'clsx';
import styles from '../../widget.module.css';
import { getMoviesAction } from 'actions';
import { IMovieList } from 'interfaces';
import { IWidgetProps } from 'index';
import Search from 'components/Search';
import debounce from 'lodash.debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from './components/MovieCard';
import {
  DEFAULT_PAGE,
  resetListPaginatedModel,
  SEARCH_DELAY_TIMER,
} from 'const';

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
  const { filter, className } = props;
  const [state, setState] = useImmer(initialState);

  const {
    movieList: { page, total_pages, results },
    searchQuery,
    hasMore,
  } = state;

  const loadMovies = async ({
    page,
    query,
    isConcat,
  }: {
    page: number;
    query?: string;
    isConcat?: boolean;
  }) => {
    const newQuery = query !== undefined ? query : searchQuery;
    const movieList = await getMoviesAction({ page, query: newQuery });
    const hasMore = movieList.total_pages > movieList.page;
    let updatedList = movieList;
    if (isConcat) {
      updatedList = {
        ...movieList,
        results: [...state.movieList.results, ...movieList.results],
      };
    }
    setState((draft) => {
      draft.hasMore = hasMore;
      draft.searchQuery;
      draft.movieList = updatedList;
    });
  };

  useEffect(() => {
    loadMovies({ page: DEFAULT_PAGE });
  }, []);

  const handleSearch = debounce(async (query: string) => {
    loadMovies({ page: DEFAULT_PAGE, query });
  }, SEARCH_DELAY_TIMER);

  const loadMoreData = async () => {
    const newPage = page + 1;
    if (newPage > total_pages) {
      setState({ ...state, hasMore: false });
      return;
    }
    loadMovies({ page: newPage, isConcat: true });
  };

  return (
    <div className={clsx(styles.widgetWrapper, className)}>
      <span className={styles.widgetTitle}>Search Movies</span>
      <Search onChange={handleSearch} />
      <div className={styles.widgetList}>
        <InfiniteScroll
          className={styles.widgetListScroll}
          dataLength={results.length}
          next={loadMoreData}
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
