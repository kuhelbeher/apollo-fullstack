import React from 'react';
import PropTypes from 'prop-types';

import SingleItem from '../components/SingleItem';

function Item({ query }) {
  return <SingleItem id={query.id} />;
}

Item.propTypes = {
  query: PropTypes.object.isRequired,
};

export default Item;
