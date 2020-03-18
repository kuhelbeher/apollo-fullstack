import React from 'react';

import Items from '../components/Items';

interface Props {
  query: any;
}

function Home({ query }: Props) {
  return (
    <div>
      <Items page={parseInt(query.page, 10) || 1} />
    </div>
  );
}

export default Home;
