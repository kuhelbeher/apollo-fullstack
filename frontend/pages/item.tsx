import React from 'react';

import SingleItem from '../components/SingleItem';

type Props = {
  query: {
    id: string;
  };
};

function Item({ query }: Props) {
  return <SingleItem id={query.id} />;
}

export default Item;
