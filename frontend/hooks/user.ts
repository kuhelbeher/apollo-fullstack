import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { Permissions } from '../types/common';

export type CurrentUserType = {
  me: {
    id: string;
    email: string;
    name: string;
    permissions: Permissions;
    cart: {
      id: string;
      quantity: number;
      item: {
        id: string;
        title: string;
        price: number;
        image: string;
        description: string;
      };
    };
  };
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
