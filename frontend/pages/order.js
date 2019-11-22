import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

function OrderPage({ query }) {
  return (
    <div>
      <PleaseSignIn>
        <Order id={query.id} />
      </PleaseSignIn>
    </div>
  );
}

export default OrderPage;
