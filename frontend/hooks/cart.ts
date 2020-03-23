import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

type LocalStateData = {
  cartOpen: boolean;
};

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

export const useCart = (): [boolean | undefined, () => void] => {
  const { data: { cartOpen } = {} } = useQuery<LocalStateData>(
    LOCAL_STATE_QUERY
  );

  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  return [cartOpen, toggleCart];
};
