import React from 'react';

import Header from './Header';
import Meta from './Meta';

function Page({ children }) {
  return (
    <div>
      <Meta />
      <Header />
      {children}
    </div>
  );
}

export default Page;
