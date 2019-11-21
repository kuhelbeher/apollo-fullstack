import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

export const useCart = () => {
  const {
    data: { cartOpen },
  } = useQuery(LOCAL_STATE_QUERY);

  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  return [cartOpen, toggleCart];
};
