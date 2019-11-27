import React from 'react';
import Link from 'next/link';

import NavStyles from './styles/NavStyles';
import { useUser, useCart } from '../hooks';
import Signout from './Signout';
import CartCount from './CartCount';

function Nav() {
  const {
    data: { me },
  } = useUser();
  const [, toggleCart] = useCart();

  return (
    <NavStyles data-test="nav">
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
          <Signout />
          <button type="button" onClick={toggleCart}>
            My Cart
            <CartCount
              count={me.cart.reduce(
                (tally, cartItem) => tally + cartItem.quantity,
                0
              )}
            />
          </button>
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
