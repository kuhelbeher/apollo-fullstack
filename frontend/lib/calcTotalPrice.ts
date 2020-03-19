import { Cart } from '../types';

export default function calcTotalPrice(cart: Cart): number {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.item) return tally;
    return tally + cartItem.quantity * cartItem.item.price;
  }, 0);
}
