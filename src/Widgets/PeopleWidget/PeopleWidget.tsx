import React, { useEffect, useState } from 'react';
import styles from '../../widget.module.css';
import { IWidgetProps } from 'index';
import Search from 'components/Search';
import debounce from 'lodash.debounce';
import { IPeopleList, resetListPaginatedModel } from 'interfaces';
import { getMoviesAction, getPeoplesAction } from 'actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../components/PeopleCard';

interface IWidgetState {
  peopleList: IPeopleList;
  searchQuery: string;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: IWidgetState = {
  peopleList: resetListPaginatedModel(),
  searchQuery: '',
  hasMore: false,
  isLoading: false,
};

function PeopleWidget(props: IWidgetProps) {
  const [state, setState] = useState(initialState);
  const { className } = props;

  useEffect(() => {
    const init = async () => {
      setState({ ...state, isLoading: true });
      const peopleList = await getPeoplesAction({ page: 1 });
      const hasMore = peopleList.total_pages > peopleList.page;
      setState({ ...state, hasMore, peopleList, isLoading: false });
    };
    init();
  }, []);

  const handleSearch = debounce(async (query: string) => {
    setState({ ...state, isLoading: true });
    const peopleList = await getPeoplesAction({ page: 1, query });
    const hasMore = peopleList.total_pages > peopleList.page;
    setState({
      ...state,
      hasMore,
      peopleList,
      searchQuery: query,
      isLoading: false,
    });
  }, 500);

  const fetchMoreData = async () => {
    const {
      searchQuery,
      peopleList: { page, total_pages },
    } = state;
    const newPage = page + 1;
    if (newPage <= total_pages) {
      setState({ ...state, isLoading: true });
      const peopleList = await getPeoplesAction({
        page: newPage,
        query: searchQuery,
      });
      const hasMore = peopleList.total_pages > peopleList.page;
      const updatedList = {
        ...peopleList,
        results: [...state.peopleList.results, ...peopleList.results],
      };
      setState({
        ...state,
        hasMore,
        peopleList: updatedList,
        isLoading: false,
      });
    } else {
      setState({ ...state, hasMore: false });
    }
  };

  const {
    hasMore,
    isLoading,
    peopleList: { results },
  } = state;

  return (
    <div className={`${styles.widgetWrapper} ${className}`}>
      <span className={styles.widgetTitle}>Search Peoples</span>
      <Search onChange={handleSearch} />
      <div className={styles.widgetList}>
        <InfiniteScroll
          height={500}
          className={styles.widgetListScroll}
          dataLength={results.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {results.map((card) => (
            <PeopleCard key={card.id} people={card} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default PeopleWidget;
