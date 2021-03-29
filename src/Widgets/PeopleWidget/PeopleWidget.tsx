import React from 'react';
import { IPeopleList, WidgetTypes } from 'interfaces';
import { IListWidgetProps, withListWidget } from 'containers';
import Card from 'components/Card';

function PeopleWidget(props: IListWidgetProps<IPeopleList>) {
  const {
    list: { results },
  } = props;

  return results.map(({ name, popularity, id, profile_path }) => {
    return (
      <Card
        key={id}
        imagePath={profile_path}
        ratingPersent={popularity}
        voteAvarage={popularity}
        title={name}
      />
    );
  });
}

export default withListWidget(WidgetTypes.PEOPLE, PeopleWidget);
