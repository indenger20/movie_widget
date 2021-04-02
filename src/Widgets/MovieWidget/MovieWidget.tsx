import React, { useContext, useRef } from 'react';
import { IListState, IMovie, IMovieList, IPeople } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import { filterListItem, getPersentage } from 'helpers';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import { AxiosContext, ConfigContext } from 'context';
import { getMoviesByPeopleAction, getWidgetListAction } from 'actions';
import { listWithPaginationInitialState } from 'const';
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from 'components/Search';
import clsx from 'clsx';
import styles from '../../widget.module.css';
import { useListLoad, useScrollTop } from 'hooks';
import { IListWrapperProps } from 'index';
import Preloader from 'components/Preloader';

interface IMovieWidgetState extends IListState<IMovieList> {}

const initialState: IMovieWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
  selectedId: null,
  isLoading: false,
};

const moviePaths = {
  with_query: '/search/movie',
  without_query: '/movie/popular',
  with_filter: '/discover/movie',
};

function MovieWidget(props: IListWrapperProps<IPeople, IMovie>) {
  const { className, filter, onSelect } = props;
  const [state, setState] = useImmer(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { axios } = useContext(AxiosContext);
  const scrollTop = useScrollTop(scrollRef);

  const {
    config: { language },
  } = useContext(ConfigContext);
  const { t } = useTranslation();

  const {
    list: { results },
    searchQuery,
    hasMore,
    selectedId,
    isLoading,
  } = state;

  const startLoading = () => {
    setState((draft) => {
      draft.isLoading = true;
    });
  };

  const loadList = async ({
    page,
    query,
    resetFilter,
  }: {
    page: number;
    query?: string;
    resetFilter?: boolean;
  }) => {
    const newQuery = query !== undefined ? query : searchQuery;
    const params = { language, page, query: newQuery };

    let path = Boolean(newQuery)
      ? moviePaths.with_query
      : moviePaths.without_query;
    startLoading();
    let dataList = listWithPaginationInitialState();
    let isNewList = false;
    if (!resetFilter && filter) {
      path = moviePaths.with_filter;
      params['with_people'] = filter.id;
      dataList = await getMoviesByPeopleAction(axios, {
        path,
        params,
      });
      isNewList = true;
    } else {
      dataList = await getWidgetListAction<IMovieList>(axios, {
        path,
        params,
      });
    }

    handleUpdateState(dataList, isNewList);
  };

  const {
    handleUpdateState,
    handleSelect,
    handleSearch,
    loadMoreData,
  } = useListLoad({
    state,
    filter,
    language,
    setState,
    scrollTop,
    loadList,
    onSelect,
  });




  const title = filter
    ? t('movieTitleWithFilter', { title: filter.name })
    : t('movieTitle');

  const filteredMovie = filter
    ? results.filter(filterListItem(searchQuery))
    : results;

  return (
    <div className={clsx(styles.widgetWrapper, className)}>
      <span className={styles.widgetTitle}>{title}</span>
      <Search onChange={handleSearch} />
      <div
        className={clsx(
          styles.widgetList,
          isLoading && styles.widgetListLoading,
        )}
        ref={scrollRef}
      >
        {isLoading && <Preloader />}
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={filteredMovie.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={null}
        >
          {filteredMovie.map((movie) => {
            const { title, id, backdrop_path, vote_average } = movie;
            return (
              <InfographicCard
                key={id}
                id={id}
                imagePath={backdrop_path}
                ratingPersent={getPersentage(vote_average)}
                title={title}
                onClick={handleSelect(movie)}
                selectedId={selectedId}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default MovieWidget;
