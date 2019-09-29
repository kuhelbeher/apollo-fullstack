import React from 'react';

import Items from '../components/Items';

function Home({ query }) {
  return (
    <div>
      <Items page={parseInt(query.page, 10) || 1} />
    </div>
  );
}

export default Home;
