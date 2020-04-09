import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { User } from '../types';

export type CurrentUserType = {
  me: User;
};

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
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
  const payload = useQuery<CurrentUserType>(CURRENT_USER_QUERY);

  return payload;
};
