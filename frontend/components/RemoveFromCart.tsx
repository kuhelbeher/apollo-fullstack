import React from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY, CurrentUserType } from '../hooks';

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

type Props = {
  id: string;
};

type RemoveFromCartRes = {
  __typename: 'Mutation';
  removeFromCart: {
    __typename: 'CartItem';
    id: string;
  };
};

type RemoveFromCartVars = {
  id: string;
};

function RemoveFromCart({ id }: Props) {
  const [removeFromCart, { loading }] = useMutation<
    RemoveFromCartRes,
    RemoveFromCartVars
  >(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update(cache, payload) {
      // first read the cache
      const data = cache.readQuery<CurrentUserType>({
        query: CURRENT_USER_QUERY,
      });

      if (data) {
        // remove that item from the cart
        const cartItemId = payload.data.removeFromCart.id;
        const cart = data.me.cart.filter(
          cartItem => cartItem.id !== cartItemId
        );

        // write it back to the cache
        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            ...data,
            me: { ...data.me, cart },
          },
        });
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id,
      },
    },
  });

  return (
    <BigButton
      disabled={loading}
      title="Delete Item"
      onClick={() => removeFromCart().catch(e => alert(e.message))}
    >
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
