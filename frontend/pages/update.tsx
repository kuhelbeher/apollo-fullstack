import React from 'react';

import UpdateItem from '../components/UpdateItem';

type Props = {
  query: {
    id: string;
  };
};

function Update({ query }: Props) {
  return (
    <div>
      <UpdateItem id={query.id} />
    </div>
  );
}

export default Update;
