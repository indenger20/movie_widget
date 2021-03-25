import React from 'react';
import styles from '../../widget.module.css';
import Search from 'components/Search';
import { IPeopleList } from 'interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../components/PeopleCard';
import { IWidgetProps, WidgetType, withWidget } from 'containers';

function PeopleWidget(props: IWidgetProps<IPeopleList>) {
  const {
    hasMore,
    isLoading,
    list: { results },
    onSearch,
    fetchMoreData,
    className,
  } = props;

  return (
    <div className={`${styles.widgetWrapper} ${className}`}>
      <span className={styles.widgetTitle}>Search Peoples</span>
      <Search onChange={onSearch} />
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

export default withWidget(WidgetType.PEOPLE, PeopleWidget);
