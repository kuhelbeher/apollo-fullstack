import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

type Props = {
  query: {
    id: string;
  };
};

function OrderPage({ query }: Props) {
  return (
    <div>
      <PleaseSignIn>
        <Order id={query.id} />
      </PleaseSignIn>
    </div>
  );
}

export default OrderPage;
