import React from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from '../hooks';

const SIGNOUT = gql`
  mutation SIGNOUT {
    signout {
      message
    }
  }
`;

function Signout() {
  const [signOut] = useMutation<{ signout: {} }, {}>(SIGNOUT, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button type="button" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}

export default Signout;
