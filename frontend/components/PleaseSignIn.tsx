import React, { ReactNode } from 'react';

import Signin from './Signin';
import { useUser } from '../hooks';

type Props = {
  children: ReactNode;
};

function PleaseSignIn({ children }: Props) {
  const { data, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data?.me) {
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
