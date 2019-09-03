import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
`;

function Items() {
  const { data, loading, error } = useQuery(ALL_ITEMS_QUERY);

  console.log({ data, loading, error });

  if (loading) {
    return (
      <Center>
        <p>Loading...</p>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <p>Error: {error.message}</p>
      </Center>
    );
  }

  return (
    <Center>
      <ItemsList>
        {data.items.map(item => (
          <Item key={item.id} item={item} />
        ))}
      </ItemsList>
    </Center>
  );
}

export default Items;
