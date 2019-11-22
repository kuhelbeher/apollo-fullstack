import React from 'react';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import { useCart, useUser } from '../hooks';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

function Cart() {
  const [cartOpen, toggleCart] = useCart();
  const {
    data: { me },
  } = useUser();

  if (!me) {
    return null;
  }

  return (
    <CartStyles open={cartOpen}>
      <header>
        <CloseButton title="close" onClick={toggleCart}>
          &times;
        </CloseButton>
        <Supreme>{me.name}'s Cart</Supreme>
        <p>
          You Have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in
          your cart.
        </p>
      </header>
      <ul>
        {me.cart.map(cartItem => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  );
}

export default Cart;
