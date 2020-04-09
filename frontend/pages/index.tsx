import React from 'react';

import Items from '../components/Items';

type Props = {
  query: {
    page?: string;
  };
};

function Home({ query: { page = '1' } }: Props) {
  return (
    <div>
      <Items page={parseInt(page, 10)} />
    </div>
  );
}

export default Home;
