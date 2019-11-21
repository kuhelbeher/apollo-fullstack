import React from 'react';
import { useQuery } from 'react-apollo';

import Signin from './Signin';
import { CURRENT_USER_QUERY } from '../hooks';

function PleaseSignIn({ children }) {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data.me) {
    return (
      <div>
        <p>Please Sign In before Continuing</p>
        <Signin />
      </div>
    );
  }

  return children;
}

export default PleaseSignIn;
