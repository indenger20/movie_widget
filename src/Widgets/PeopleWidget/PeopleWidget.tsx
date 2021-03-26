import React from 'react';
import { IPeopleList, WidgetTypes } from 'interfaces';
import { IWidgetProps, withWidget } from 'containers';
import Card from 'components/Card';

function PeopleWidget(props: IWidgetProps<IPeopleList>) {
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

export default withWidget(WidgetTypes.PEOPLE, PeopleWidget);
