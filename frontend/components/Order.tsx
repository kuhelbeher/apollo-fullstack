import React from 'react';
import { useQuery } from 'react-apollo';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';

import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import { Order as OrderType } from '../types';

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

type Props = {
  id: string;
};

type OrderData = {
  order: OrderType;
};

type OrderVars = {
  id: string;
};

function Order({ id }: Props) {
  const { data: { order } = {}, loading, error } = useQuery<
    OrderData,
    OrderVars
  >(SINGLE_ORDER_QUERY, {
    variables: { id },
  });

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return null;
  }

  return (
    <OrderStyles data-test="order">
      <Head>
        <title>Sick Fits - Order {order?.id}</title>
      </Head>
      <p>
        <span>Order ID:</span>
        <span>{order?.id}</span>
      </p>
      <p>
        <span>Date:</span>
        <span>{format(parseISO(order?.createdAt), 'd MMMM yyyy, H:mm')}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order?.total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{order?.items.length}</span>
      </p>
      <div className="items">
        {order?.items.map(item => (
          <div key={item.id} className="order-item">
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h2>{item.title}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

export default Order;
