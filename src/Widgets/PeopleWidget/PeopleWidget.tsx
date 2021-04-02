import React, { useContext, useRef } from 'react';
import { IListState, IMovie, IPeople, IPeopleList } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import Search from 'components/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';
import { AxiosContext, ConfigContext } from 'context';
import { getPeopleByMovieAction, getWidgetListAction } from 'actions';
import { listWithPaginationInitialState } from 'const';
import { getPeopleByMovieActions, getWidgetListActions } from 'actions';
import { IListWrapperProps } from 'index';
import clsx from 'clsx';

import styles from '../../widget.module.css';
import { useListLoad, useScrollTop } from 'hooks';

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
  const { className, filter, onSelect } = props;
  const [state, setState] = useImmer(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { axios } = useContext(AxiosContext);

  const scrollTop = useScrollTop(scrollRef);

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
      ? peoplePaths.with_query
      : peoplePaths.without_query;

    let dataList = listWithPaginationInitialState();
    if (!resetFilter && filter) {
      path = peoplePaths.with_filter(filter.id);
      params['append_to_response'] = 'credits';
      dataList = await getPeopleByMovieAction(axios, {
        path,
        params,
      });
    } else {
      dataList = await getWidgetListAction<IPeopleList>(axios, {
        path,
        params,
      });
    }

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
                onClick={handleSelect(people)}
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
