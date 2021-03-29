import React, { useEffect } from 'react';
import { getWidgetListActions } from 'actions';
import clsx from 'clsx';
import styles from '../widget.module.css';
import Search from 'components/Search';
import {
  DEFAULT_PAGE,
  listWithPaginationInitialState,
  SEARCH_DELAY_TIMER,
  widgetTitles,
} from 'const';
import { IWidgetWrapperProps } from 'index';
import { IMovieList, IPeopleList, WidgetTypes } from 'interfaces';
import debounce from 'lodash.debounce';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useImmer } from 'use-immer';

export interface IListWidgetProps<T> {
  list: T;
}

interface IListWidgetState<T> {
  list: T;
  searchQuery: string;
  hasMore: boolean;
}

const initialState: IListWidgetState<IMovieList | IPeopleList> = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
};

export const withListWidget = (type: WidgetTypes, ChildComponent: any) => {
  const Wrapper: React.FC<IWidgetWrapperProps> = (
    props: IWidgetWrapperProps,
  ) => {
    const [state, setState] = useImmer(initialState);

    const {
      list,
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
      const dataList = await getWidgetListActions<IMovieList | IPeopleList>({
        type,
        params: { page, query: newQuery },
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
      loadList({ page: DEFAULT_PAGE });
    }, []);

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

    const params: IListWidgetProps<IMovieList | IPeopleList> = {
      list,
    };

    const widgetTitle = widgetTitles[type];

    return (
      <div className={clsx(styles.widgetWrapper, props.className)}>
        <span className={styles.widgetTitle}>{widgetTitle}</span>
        <Search onChange={handleSearch} />
        <div className={styles.widgetList}>
          <InfiniteScroll
            height={500}
            className={styles.widgetListScroll}
            dataLength={results.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <ChildComponent {...params} />;
          </InfiniteScroll>
        </div>
      </div>
    );
  };

  return Wrapper;
};
