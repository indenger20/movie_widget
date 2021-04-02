import React, { useContext, useRef } from 'react';
import { IListState, IMovie, IMovieList, IPeople } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import { getPersentage } from 'helpers';
import { IListWrapperProps } from 'index';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from 'context';
import { getWidgetListActions } from 'actions';
import { listWithPaginationInitialState } from 'const';
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from 'components/Search';
import clsx from 'clsx';

import styles from '../../widget.module.css';
import { useListLoad, useScrollTop } from 'hooks';

interface IMovieWidgetState extends IListState<IMovieList> {}

const initialState: IMovieWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
  selectedId: null,
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
  } = state;

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

    if (!resetFilter && filter) {
      path = moviePaths.with_filter;
      params['with_people'] = filter.id;
    }

    const dataList = await getWidgetListActions<IMovieList>({
      path,
      params,
    });
    handleUpdateState(dataList);
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

  return (
    <div className={clsx(styles.widgetWrapper, className)}>
      <span className={styles.widgetTitle}>{title}</span>
      <Search onChange={handleSearch} disabled={Boolean(filter)} />
      <div className={styles.widgetList} ref={scrollRef}>
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={results.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<h4>{t('loading')}</h4>}
        >
          {results.map((movie) => {
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
