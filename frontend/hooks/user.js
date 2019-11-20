import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
    }
  }
`;

export const useUser = () => {
  const payload = useQuery(CURRENT_USER_QUERY);

  return payload;
};
