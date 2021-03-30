import React, { useContext, useEffect } from 'react';
import { IListState, IPeopleList } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import Search from 'components/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';
import {
  DEFAULT_PAGE,
  listWithPaginationInitialState,
  SEARCH_DELAY_TIMER,
} from 'const';
import { ConfigContext } from 'context';
import { getWidgetListActions } from 'actions';
import debounce from 'lodash.debounce';
import { IWidgetWrapperProps } from 'index';
import clsx from 'clsx';

import styles from '../../widget.module.css';

interface IPeopleWidgetState extends IListState<IPeopleList> {}

const initialState: IPeopleWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
};

const peoplePaths = {
  with_query: '/search/person',
  without_query: '/person/popular',
};

function PeopleWidget(props: IWidgetWrapperProps) {
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
      ? peoplePaths.with_query
      : peoplePaths.without_query;

    const dataList = await getWidgetListActions<IPeopleList>({
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
          {results.map(({ name, popularity, id, profile_path }) => {
            return (
              <InfographicCard
                key={id}
                imagePath={profile_path}
                ratingPersent={popularity}
                title={name}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default PeopleWidget;
