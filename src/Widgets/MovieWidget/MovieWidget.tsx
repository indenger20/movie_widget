import React from 'react';
import { IMovieList, WidgetTypes } from 'interfaces';
import { IWidgetProps, withWidget } from 'containers';
import Card from 'components/Card';

function MovieWidget(props: IWidgetProps<IMovieList>) {
  const {
    list: { results },
  } = props;

  return results.map(({ title, id, backdrop_path, vote_average }) => {
    return (
      <Card
        key={id}
        imagePath={backdrop_path}
        ratingPersent={vote_average * 10}
        voteAvarage={vote_average}
        title={title}
      />
    );
  });
}

export default withWidget(WidgetTypes.MOVIE, MovieWidget);
