import React, { useCallback, useEffect, useState } from 'react';
import {
  IListState,
  IMovie,
  IMovieList,
  IPeople,
  IPeopleList,
  LanguageTypes,
  PaginationWrapper,
} from 'interfaces';
import { Draft } from 'immer';
import { DEFAULT_PAGE, SEARCH_DELAY_TIMER } from 'const';
import debounce from 'lodash.debounce';

type List = IPeopleList | IMovieList;
type StateList = IListState<List>;
type SetState = (
  f: ((draft: Draft<StateList> | StateList) => void) | StateList,
) => void;

interface IProps {
  state: StateList;
  language?: LanguageTypes;
  filter?: IMovie | IPeople | null;
  onSelect?(widget: IMovie | IPeople | null): void;
  loadList(params: {
    page: number;
    query?: string;
    resetFilter?: boolean;
  }): void;
  scrollTop(position: number): void;
  setState: SetState;
}

export const useListLoad = (props: IProps) => {
  const {
    state,
    state: {
      list: { total_pages, page },
    },
    language,
    filter,
    setState,
    scrollTop,
    loadList,
    onSelect,
  } = props;

  const scrollToTop = () => {
    scrollTop(0);
  };

  const handleSelect = (widget: IMovie | IPeople | null) => () => {
    if (!onSelect) return;
    setState((draft) => {
      if (!draft) return;
      draft.selectedId = widget?.id || null;
    });
    onSelect(widget);
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      scrollToTop();
      setState((draft) => {
        if (!draft) return;
        draft.searchQuery = query;
      });
      if (!filter) {
        loadList({ page: DEFAULT_PAGE, query });
        return;
      }
    }, SEARCH_DELAY_TIMER),
    [language, filter?.id],
  );

  const handleUpdateState = (
    dataList: PaginationWrapper<any>,
    isNewList: boolean,
  ) => {
    const hasMore = dataList.total_pages > dataList.page;
    let updatedList = dataList;
    if (updatedList.page > DEFAULT_PAGE) {
      const prevResults = isNewList ? [] : state.list.results;
      updatedList = {
        ...dataList,
        results: [...prevResults, ...dataList.results],
      };
    }
    setState((draft) => {
      if (!draft) return;
      draft.hasMore = hasMore;
      draft.searchQuery;
      draft.list = updatedList;
      draft.isLoading = false;
    });
  };

  const loadMoreData = async () => {
    const newPage = page + 1;
    if (newPage > total_pages) {
      setState((draft) => {
        if (!draft) return;
        draft.hasMore = false;
      });
      return;
    }
    loadList({ page: newPage });
  };

  useEffect(() => {
    loadList({ page: DEFAULT_PAGE, query: '', resetFilter: true });
    handleSelect(null)(); // reset filters
    scrollToTop();
  }, [language]);

  useEffect(() => {
    if (filter) {
      loadList({ page: DEFAULT_PAGE, query: '' });
      handleSelect(null)();
      scrollToTop();
    }
  }, [filter?.id]);

  return { handleUpdateState, handleSelect, handleSearch, loadMoreData };
};
