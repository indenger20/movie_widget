import { getMoviesAction, getPeoplesAction } from 'actions';
import { IWidgetWrapperProps } from 'index';
import { IMovieList, IPeopleList, resetListPaginatedModel } from 'interfaces';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';

export enum WidgetType {
  MOVIE,
  PEOPLE,
}

export interface IWidgetProps<T> extends IWidgetState<T> {
  className?: string;
  onSearch(query: string): void;
  fetchMoreData(): void;
}

interface IWidgetState<T> {
  list: T;
  searchQuery: string;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: IWidgetState<IMovieList | IPeopleList> = {
  list: resetListPaginatedModel(),
  searchQuery: '',
  hasMore: false,
  isLoading: false,
};

export const withWidget = (type: WidgetType, ChildComponent: any) => {
  const Wrapper: React.FC<any> = (props: IWidgetWrapperProps) => {
    const [state, setState] = useState(initialState);

    const action =
      type === WidgetType.MOVIE ? getMoviesAction : getPeoplesAction;

    const handleUpdateList = useCallback(
      (updatedList: IMovieList | IPeopleList, query?: string) => {
        const hasMore = updatedList.total_pages > updatedList.page;
        const searchQuery = query === undefined ? state.searchQuery : query;
        setState({
          ...state,
          searchQuery,
          hasMore,
          list: updatedList,
          isLoading: false,
        });
      },
      [state],
    );

    useEffect(() => {
      const init = async () => {
        setState({ ...state, isLoading: true });
        const list = await action({ page: 1 });
        handleUpdateList(list);
      };
      init();
    }, []);

    const handleSearch = debounce(async (query: string) => {
      setState({ ...state, isLoading: true });
      const list = await action({ page: 1, query });
      handleUpdateList(list, query);
    }, 500);

    const fetchMoreData = async () => {
      const {
        searchQuery,
        list: { page, total_pages },
      } = state;
      const newPage = page + 1;
      if (newPage <= total_pages) {
        setState({ ...state, isLoading: true });
        const list = await action({
          page: newPage,
          query: searchQuery,
        });
        const updatedList = {
          ...list,
          results: [...state.list.results, ...list.results],
        };
        handleUpdateList(updatedList);
      } else {
        setState({ ...state, hasMore: false });
      }
    };

    const { hasMore, isLoading, list, searchQuery } = state;

    const params: IWidgetProps<IMovieList | IPeopleList> = {
      hasMore,
      isLoading,
      list,
      searchQuery,
      onSearch: handleSearch,
      fetchMoreData,
    };

    return <ChildComponent {...props} {...params} />;
  };

  return Wrapper;
};
