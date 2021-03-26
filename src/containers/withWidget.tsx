import React, { useEffect } from 'react';
import { getWidgetListActions } from 'actions';
import clsx from 'clsx';
import styles from '../widget.module.css';
import Search from 'components/Search';
import {
  DEFAULT_PAGE,
  resetListPaginatedModel,
  SEARCH_DELAY_TIMER,
  widgetTitles,
} from 'const';
import { IWidgetWrapperProps } from 'index';
import { IMovieList, IPeopleList, WidgetTypes } from 'interfaces';
import debounce from 'lodash.debounce';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useImmer } from 'use-immer';

export interface IWidgetProps<T> {
  list: T;
}

interface IWidgetState<T> {
  list: T;
  searchQuery: string;
  hasMore: boolean;
}

const initialState: IWidgetState<IMovieList | IPeopleList> = {
  list: resetListPaginatedModel(),
  searchQuery: '',
  hasMore: false,
};

export const withWidget = (type: WidgetTypes, ChildComponent: any) => {
  const Wrapper: React.FC<any> = (props: IWidgetWrapperProps) => {
    const [state, setState] = useImmer(initialState);

    const {
      list,
      list: { page, total_pages, results },
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
      const movieList = await getWidgetListActions<IMovieList | IPeopleList>({
        type,
        params: { page, query: newQuery },
      });
      const hasMore = movieList.total_pages > movieList.page;
      let updatedList = movieList;
      if (isConcat) {
        updatedList = {
          ...movieList,
          results: [...state.list.results, ...movieList.results],
        };
      }
      setState((draft) => {
        draft.hasMore = hasMore;
        draft.searchQuery;
        draft.list = updatedList;
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

    const params: IWidgetProps<IMovieList | IPeopleList> = {
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
