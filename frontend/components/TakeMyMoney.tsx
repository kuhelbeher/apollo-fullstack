import React, { ReactNode } from 'react';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import { useMutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';

import calcTotalPrice from '../lib/calcTotalPrice';
import { useUser, CURRENT_USER_QUERY } from '../hooks';
import { Order, CartItem } from '../types';

function totalItems(cart: CartItem[]): number {
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

type Props = {
  children: ReactNode;
};

type CreateOrderRes = {
  createOrder: Order;
};

type CreateOrderVars = {
  token: string;
};

function TakeMyMoney({ children }: Props) {
  const { data: { me } = {}, loading } = useUser();

  const [createOrder] = useMutation<CreateOrderRes, CreateOrderVars>(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const handleToken = async (res: Token) => {
    NProgress.start();
    try {
      const { data } = await createOrder({
        variables: { token: res.id },
      });

      if (data) {
        Router.push({
          pathname: '/order',
          query: { id: data.createOrder.id },
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !me) {
    return null;
  }

  return (
    <StripeCheckout
      amount={calcTotalPrice(me.cart)}
      name="Sick Fits"
      description={`Order of ${totalItems(me.cart)} items`}
      image={me.cart.length ? me.cart[0].item.image : ''}
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
