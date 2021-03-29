import React from 'react';
import { IMovieList, WidgetTypes } from 'interfaces';
import { IListWidgetProps, withListWidget } from 'containers';
import Card from 'components/Card';
import { getPersentage } from 'helpers';

function MovieWidget(props: IListWidgetProps<IMovieList>) {
  const {
    list: { results },
  } = props;

  return results.map(({ title, id, backdrop_path, vote_average }) => {
    return (
      <Card
        key={id}
        imagePath={backdrop_path}
        ratingPersent={getPersentage(vote_average)}
        voteAvarage={vote_average}
        title={title}
      />
    );
  });
}

export default withListWidget(WidgetTypes.MOVIE, MovieWidget);
