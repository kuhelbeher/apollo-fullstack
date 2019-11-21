import React from 'react';
import styled from 'styled-components';

import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CastItemStyles = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
    width: 100px;
  }
  h3,
  p {
    margin: 0;
  }
`;

function CartItem({
  item: {
    item: { image, title, price },
    quantity,
    id,
  },
}) {
  return (
    <CastItemStyles>
      <img src={image} alt={title} />
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(price * quantity)}
          {' - '}
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </CastItemStyles>
  );
}

export default CartItem;
