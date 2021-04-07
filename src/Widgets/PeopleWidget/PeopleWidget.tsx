import React, { useRef } from 'react';
import { IListState, IMovie, IPeople, IPeopleList } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import Search from 'components/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';
import { getPeopleByMovieAction, getWidgetListAction } from 'actions';
import { listWithPaginationInitialState } from 'const';
import clsx from 'clsx';

import styles from '../../widget.module.css';
import { useListLoad, useScrollTop } from 'hooks';

import { filterListItem } from 'helpers';
import { IListWrapperProps } from 'index';
import Preloader from 'components/Preloader';
import { withConfig } from 'containers';

interface IPeopleWidgetState extends IListState<IPeopleList> {}

const initialState: IPeopleWidgetState = {
  list: listWithPaginationInitialState(),
  searchQuery: '',
  hasMore: false,
  selectedId: null,
  isLoading: false,
};

const peoplePaths = {
  with_query: '/search/person',
  without_query: '/person/popular',
  with_filter: (movie_id: number) => `/movie/${movie_id}`,
};

function PeopleWidget(props: IListWrapperProps<IMovie, IPeople>) {
  const { filter, onSelect, config } = props;
  const [state, setState] = useImmer(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTop = useScrollTop(scrollRef);

  const { api: axios, language } = config;

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
      ? peoplePaths.with_query
      : peoplePaths.without_query;

    startLoading();
    let isNewList = false;
    let dataList = listWithPaginationInitialState();
    if (!resetFilter && filter) {
      path = peoplePaths.with_filter(filter.id);
      params['append_to_response'] = 'credits';
      dataList = await getPeopleByMovieAction(axios, {
        path,
        params,
      });
      isNewList = true;
    } else {
      dataList = await getWidgetListAction<IPeopleList>(axios, {
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
    ? t('peopleTitleWithFilter', { title: filter.title })
    : t('peopleTitle');

  const filteredPeople = filter
    ? results.filter(filterListItem(searchQuery))
    : results;

  return (
    <React.Fragment>
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
          dataLength={filteredPeople.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={null}
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
                onClick={handleSelect(people)}
                selectedId={selectedId}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
}

export default withConfig(PeopleWidget);
