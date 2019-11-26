import React from 'react';

import OrderList from '../components/OrderList';
import PleaseSignIn from '../components/PleaseSignIn';

function OrdersPage() {
  return (
    <div>
      <PleaseSignIn>
        <OrderList />
      </PleaseSignIn>
    </div>
  );
}

export default OrdersPage;
