import React from 'react';
import Link from 'next/link';

import NavStyles from './styles/NavStyles';
import { useUser } from '../hooks';

function Nav() {
  const {
    data: { me },
  } = useUser();

  return (
    <NavStyles>
      <Link href="/items">
        <a>Shop</a>
      </Link>
      {me && (
        <>
          <Link href="/sell">
            <a>Sell</a>
          </Link>
          <Link href="/orders">
            <a>Orders</a>
          </Link>
          <Link href="/me">
            <a>Account</a>
          </Link>
        </>
      )}
      {!me && (
        <Link href="/signup">
          <a>Sign In</a>
        </Link>
      )}
    </NavStyles>
  );
}

export default Nav;
