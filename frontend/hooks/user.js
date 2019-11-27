import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
      orders {
        id
      }
      cart {
        id
        quantity
        item {
          id
          title
          price
          image
          description
        }
      }
    }
  }
`;

export const useUser = () => {
  const payload = useQuery(CURRENT_USER_QUERY);

  return payload;
};
