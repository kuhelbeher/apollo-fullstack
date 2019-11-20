import React from 'react';
import Reset from '../components/Reset';

function ResetPage({ query }) {
  return (
    <div>
      <Reset resetToken={query.resetToken} />
    </div>
  );
}

export default ResetPage;
