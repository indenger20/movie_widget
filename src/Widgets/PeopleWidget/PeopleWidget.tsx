import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { IListState, IMovie, IPeople, IPeopleList } from 'interfaces';
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
import { getPeopleByMovieActions, getWidgetListActions } from 'actions';
import debounce from 'lodash.debounce';
import { IListWrapperProps } from 'index';
import clsx from 'clsx';

import styles from '../../widget.module.css';
import { filterListItem } from 'helpers';

interface IPeopleWidgetState extends IListState<IPeopleList> {}

const initialState: IPeopleWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
  selectedId: null,
};

const peoplePaths = {
  with_query: '/search/person',
  without_query: '/person/popular',
  with_filter: (movie_id: number) => `/movie/${movie_id}`,
};

function PeopleWidget(props: IListWrapperProps<IMovie, IPeople>) {
  const { className, filter, onClick } = props;
  const [state, setState] = useImmer(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    config: { language },
  } = useContext(ConfigContext);
  const { t } = useTranslation();

  const {
    list: { page, total_pages, results },
    searchQuery,
    hasMore,
    selectedId,
  } = state;

  const scrollToTop = () => {
    if (scrollRef.current) {
      const div = scrollRef.current.getElementsByClassName(
        'infinite-scroll-component',
      )[0];
      div.scrollTop = 0;
    }
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
      ? peoplePaths.with_query
      : peoplePaths.without_query;

    let dataList = listWithPaginationInitialState();
    if (!resetFilter && filter) {
      path = peoplePaths.with_filter(filter.id);
      params['append_to_response'] = 'credits';
      dataList = await getPeopleByMovieActions({
        path,
        params,
      });
    } else {
      dataList = await getWidgetListActions<IPeopleList>({
        path,
        params,
      });
    }

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
      draft.searchQuery = newQuery;
      draft.list = updatedList;
    });
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
    if (selectedId) {
      const selectedPeople = results.find((r) => r.id === selectedId);
      if (selectedPeople) {
        handleClick(null)();
      }
    }
  }, [results]);

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (!filter) {
        loadList({ page: DEFAULT_PAGE, query });
        return;
      }
      setState((draft) => {
        draft.searchQuery = query;
      });
    }, SEARCH_DELAY_TIMER),
    [language, filter?.id],
  );

  const loadMoreData = async () => {
    const newPage = page + 1;
    if (newPage > total_pages) {
      setState((draft) => {
        draft.hasMore = false;
      });
      return;
    }
    loadList({ page: newPage });
  };

  const handleClick = (people: IPeople | null) => () => {
    if (onClick) {
      setState((draft) => {
        draft.selectedId = people?.id || null;
      });
      onClick(people);
    }
  };

  const title = filter
    ? t('peopleTitleWithFilter', { title: filter.title })
    : t('peopleTitle');

  const filteredPeople = filter
    ? results.filter(filterListItem(searchQuery))
    : results;

  return (
    <div className={clsx(styles.widgetWrapper, className)}>
      <span className={styles.widgetTitle}>{title}</span>
      <Search onChange={handleSearch} />
      <div className={styles.widgetList} ref={scrollRef}>
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={filteredPeople.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<h4>{t('loading')}</h4>}
        >
          {filteredPeople.map((people) => {
            const { name, popularity, id, profile_path } = people;
            return (
              <InfographicCard
                key={id}
                id={id}
                imagePath={profile_path}
                ratingPersent={popularity}
                title={name}
                onClick={handleClick(people)}
                selectedId={selectedId}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default PeopleWidget;
