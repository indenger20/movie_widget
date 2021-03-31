import React, { useCallback, useEffect } from 'react';
import {
  IListState,
  IMovie,
  IMovieList,
  IPeople,
  IPeopleList,
  LanguageTypes,
  PaginationWrapper,
} from 'interfaces';
import { useImmer } from 'use-immer';
import { DEFAULT_PAGE, SEARCH_DELAY_TIMER } from 'const';
import debounce from 'lodash.debounce';

type List = IPeopleList | IMovieList;
type StateList = IListState<List>;
const wrapperState = () => useImmer<StateList | null>(null);

interface IProps {
  state: StateList;
  language: LanguageTypes;
  filter?: IMovie | IPeople | null;
  onSelect?(widget: IMovie | IPeople | null): void;
  loadList(params: {
    page: number;
    query?: string;
    resetFilter?: boolean;
  }): void;
  scrollTop(position: number): void;
  setState: ReturnType<typeof wrapperState>[1];
}

export const useListLoad = (props: IProps) => {
  const {
    state,
    state: {
      selectedId,
      list: { results, total_pages, page },
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
      if (!filter) {
        loadList({ page: DEFAULT_PAGE, query });
        return;
      }
      setState((draft) => {
        if (!draft) return;
        draft.searchQuery = query;
      });
      loadList({ page: DEFAULT_PAGE, query });
    }, SEARCH_DELAY_TIMER),
    [language, filter?.id],
  );

  const handleUpdateState = (dataList: PaginationWrapper<any>) => {
    const hasMore = dataList.total_pages > dataList.page;
    let updatedList = dataList;
    if (updatedList.page > DEFAULT_PAGE) {
      updatedList = {
        ...dataList,
        results: [...state.list.results, ...dataList.results],
      };
    }
    setState((draft) => {
      if (!draft) return;
      draft.hasMore = hasMore;
      draft.searchQuery;
      draft.list = updatedList;
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
    scrollToTop();
  }, [language]);

  useEffect(() => {
    if (filter?.id) {
      loadList({ page: DEFAULT_PAGE, query: '' });
      scrollToTop();
    }
  }, [filter?.id]);

  useEffect(() => {
    if (!selectedId) return;
    const selectedIndex = results.findIndex(
      (r: IPeople | IMovie) => r.id === selectedId,
    );
    if (selectedIndex === -1) return;
    handleSelect(null)();
  }, [results]);

  return { handleUpdateState, handleSelect, handleSearch, loadMoreData };
};
