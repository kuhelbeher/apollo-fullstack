import React from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../hooks';

type Props = {
  id: string;
};

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

function AddToCart({ id }: Props) {
  const [addToCart, { loading }] = useMutation<{ id: string }>(
    ADD_TO_CART_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  return (
    <button type="button" onClick={() => addToCart()} disabled={loading}>
      Add{loading ? 'ing' : ''} To Cart 🛒
    </button>
  );
}

export default AddToCart;
