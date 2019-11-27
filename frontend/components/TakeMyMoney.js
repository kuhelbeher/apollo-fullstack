import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';

import calcTotalPrice from '../lib/calcTotalPrice';
import { useUser, CURRENT_USER_QUERY } from '../hooks';

function totalItems(cart) {
  return cart.reduce((tally, item) => tally + item.quantity, 0);
}

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function TakeMyMoney({ children }) {
  const {
    data: { me },
    loading,
  } = useUser();

  const [createOrder, data] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const handleToken = async res => {
    NProgress.start();
    const order = await createOrder({ variables: { token: res.id } }).catch(
      err => alert(err.message)
    );

    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    });
  };

  if (loading) {
    return null;
  }

  return (
    <StripeCheckout
      amount={calcTotalPrice(me.cart)}
      name="Sick Fits"
      description={`Order of ${totalItems(me.cart)} items`}
      image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
      stripeKey="pk_test_CpKPaAnh2rV2KGRlYZaHbv4s00FDEK5dLK"
      currency="USD"
      email={me.email}
      token={handleToken}
    >
      {children}
    </StripeCheckout>
  );
}

export default TakeMyMoney;
