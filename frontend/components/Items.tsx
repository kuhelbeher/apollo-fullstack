import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';
import { Item as ItemType } from '../types';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
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

type Props = {
  page: number;
};

type AllItemsData = {
  items: ItemType[];
};

type AllItemsVars = {
  skip: number;
};

function Items({ page }: Props) {
  const { data, loading, error } = useQuery<AllItemsData, AllItemsVars>(
    ALL_ITEMS_QUERY,
    {
      variables: { skip: page * perPage - perPage },
      // fetchPolicy: 'network-only',
    }
  );

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
      <Pagination page={page} />
      <ItemsList>
        {data?.items.map(item => (
          <Item key={item.id} item={item} />
        ))}
      </ItemsList>
      <Pagination page={page} />
    </Center>
  );
}

export default Items;
export { ALL_ITEMS_QUERY };
