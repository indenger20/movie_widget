import React, { useContext, useEffect } from 'react';
import { IListState, IMovieList } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import { getPersentage } from 'helpers';
import { IWidgetWrapperProps } from 'index';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from 'context';
import { getWidgetListActions } from 'actions';
import {
  DEFAULT_PAGE,
  listWithPaginationInitialState,
  SEARCH_DELAY_TIMER,
} from 'const';
import debounce from 'lodash.debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from 'components/Search';
import clsx from 'clsx';

import styles from '../../widget.module.css';

interface IMovieWidgetState extends IListState<IMovieList> {}

const initialState: IMovieWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
};

const moviePaths = {
  with_query: '/search/movie',
  without_query: '/movie/popular',
};

function MovieWidget(props: IWidgetWrapperProps) {
  const [state, setState] = useImmer(initialState);
  const {
    config: { language },
  } = useContext(ConfigContext);
  const { t } = useTranslation();

  const {
    list: { page, total_pages, results },
    searchQuery,
    hasMore,
  } = state;

  const loadList = async ({
    page,
    query,
  }: {
    page: number;
    query?: string;
  }) => {
    const newQuery = query !== undefined ? query : searchQuery;
    const path = Boolean(newQuery)
      ? moviePaths.with_query
      : moviePaths.without_query;

    const dataList = await getWidgetListActions<IMovieList>({
      path,
      params: { language, page, query: newQuery },
    });
    const hasMore = dataList.total_pages > dataList.page;
    let updatedList = dataList;
    if (updatedList.page > DEFAULT_PAGE) {
      updatedList = {
        ...dataList,
        results: [...state.list.results, ...dataList.results],
      };
    }
    setState((draft) => {
      draft.hasMore = hasMore;
      draft.searchQuery;
      draft.list = updatedList;
    });
  };

  useEffect(() => {
    loadList({ page: DEFAULT_PAGE, query: '' });
  }, [language]);

  const handleSearch = debounce(async (query: string) => {
    loadList({ page: DEFAULT_PAGE, query });
  }, SEARCH_DELAY_TIMER);

  const loadMoreData = async () => {
    const newPage = page + 1;
    if (newPage > total_pages) {
      setState({ ...state, hasMore: false });
      return;
    }
    loadList({ page: newPage });
  };

  return (
    <div className={clsx(styles.widgetWrapper, props.className)}>
      <span className={styles.widgetTitle}>{t('peopleTitle')}</span>
      <Search onChange={handleSearch} language={language} />
      <div className={styles.widgetList}>
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={results.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<h4>{t('loading')}</h4>}
        >
          {results.map(({ title, id, backdrop_path, vote_average }) => {
            return (
              <InfographicCard
                key={id}
                imagePath={backdrop_path}
                ratingPersent={getPersentage(vote_average)}
                title={title}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default MovieWidget;
