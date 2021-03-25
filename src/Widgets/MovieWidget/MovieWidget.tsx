import React, { useEffect, useState } from 'react';
import styles from '../../widget.module.css';
import { getMoviesAction } from 'actions';
import { IMovieList, resetListPaginatedModel } from 'interfaces';
import { IWidgetProps } from 'index';
import Search from 'components/Search';
import debounce from 'lodash.debounce';
import MovieCard from '../components/MovieCard';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IWidgetState {
  movieList: IMovieList;
  searchQuery: string;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: IWidgetState = {
  movieList: resetListPaginatedModel(),
  searchQuery: '',
  hasMore: false,
  isLoading: false,
};

function MovieWidget(props: IWidgetProps) {
  const { filter, className = '' } = props;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const init = async () => {
      setState({ ...state, isLoading: true });
      const movieList = await getMoviesAction({ page: 1 });
      const hasMore = movieList.total_pages > movieList.page;
      setState({ ...state, hasMore, movieList, isLoading: false });
    };
    init();
  }, []);

  const handleSearch = debounce(async (query: string) => {
    setState({ ...state, isLoading: true });
    const movieList = await getMoviesAction({ page: 1, query });
    const hasMore = movieList.total_pages > movieList.page;
    setState({
      ...state,
      hasMore,
      movieList,
      searchQuery: query,
      isLoading: false,
    });
  }, 500);

  const fetchMoreData = async () => {
    const {
      searchQuery,
      movieList: { page, total_pages },
    } = state;
    const newPage = page + 1;
    if (newPage <= total_pages) {
      setState({ ...state, isLoading: true });
      const movieList = await getMoviesAction({
        page: newPage,
        query: searchQuery,
      });
      const hasMore = movieList.total_pages > movieList.page;
      const updatedList = {
        ...movieList,
        results: [...state.movieList.results, ...movieList.results],
      };
      setState({ ...state, hasMore, movieList: updatedList, isLoading: false });
    } else {
      setState({ ...state, hasMore: false });
    }
  };

  const {
    hasMore,
    isLoading,
    movieList: { results },
  } = state;

  return (
    <div className={`${styles.widgetWrapper} ${className}`}>
      <span className={styles.widgetTitle}>Search Movies</span>
      <Search onChange={handleSearch} />
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

export default MovieWidget;
