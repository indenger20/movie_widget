import React, { useContext, useEffect, useCallback, useRef } from 'react';
import { IListState, IMovie, IMovieList, IPeople } from 'interfaces';
import InfographicCard from 'components/InfographicCard';
import { filterListItem, getPersentage } from 'helpers';
import { IListWrapperProps } from 'index';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from 'context';
import { getMoviesByPeopleActions, getWidgetListActions } from 'actions';
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
  selectedId: null,
};

const moviePaths = {
  with_query: '/search/movie',
  without_query: '/movie/popular',
  with_filter: '/discover/movie',
};

function MovieWidget(props: IListWrapperProps<IPeople, IMovie>) {
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
      ? moviePaths.with_query
      : moviePaths.without_query;

    let dataList = listWithPaginationInitialState();
    if (!resetFilter && filter) {
      path = moviePaths.with_filter;
      params['with_people'] = filter.id;
      dataList = await getMoviesByPeopleActions({
        path,
        params,
      });
    } else {
      dataList = await getWidgetListActions<IMovieList>({
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
      const selectedMovie = results.find((r) => r.id === selectedId);
      if (selectedMovie) {
        handleClick(null)();
      }
    }
  }, [results]);

  const handleSearch = useCallback(
    debounce((query: string) => {
      scrollToTop();
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

  const loadMoreData = () => {
    const newPage = page + 1;
    if (newPage > total_pages) {
      setState((draft) => {
        draft.hasMore = false;
      });
      return;
    }
    loadList({ page: newPage });
  };

  const handleClick = (movie: IMovie | null) => () => {
    if (onClick) {
      setState((draft) => {
        draft.selectedId = movie?.id || null;
      });
      onClick(movie);
    }
  };

  const title = filter
    ? t('movieTitleWithFilter', { title: filter.name })
    : t('movieTitle');

  const filteredMovie = filter
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
          dataLength={filteredMovie.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<h4>{t('loading')}</h4>}
        >
          {filteredMovie.map((movie) => {
            const { title, id, backdrop_path, vote_average } = movie;
            return (
              <InfographicCard
                key={id}
                id={id}
                imagePath={backdrop_path}
                ratingPersent={getPersentage(vote_average)}
                title={title}
                onClick={handleClick(movie)}
                selectedId={selectedId}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default MovieWidget;
