import React from 'react';
import Reset from '../components/Reset';

type Props = {
  query: {
    resetToken: string;
  };
};

function ResetPage({ query }: Props) {
  return (
    <div>
      <Reset resetToken={query.resetToken} />
    </div>
  );
}

export default ResetPage;
