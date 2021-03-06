import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import Head from 'next/head';

import Error from './ErrorMessage';
import { Item } from '../types';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

type Props = {
  id: string;
};

type SingleItemRes = {
  item: Item;
};

type SingleItemVars = {
  id: string;
};

function SingleItem({ id }: Props) {
  const { loading, error, data } = useQuery<SingleItemRes, SingleItemVars>(
    SINGLE_ITEM_QUERY,
    {
      variables: { id },
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return null;
  }

  const { item } = data;

  if (!item) {
    return <p>No item found for this id: {id}</p>;
  }

  return (
    <SingleItemStyles>
      <Head>
        <title>Sick Fits | {item.title}</title>
      </Head>
      <img src={item.largeImage} alt={item.title} />
      <div className="details">
        <h2>Viewing {item.title}</h2>
        <p>{item.description}</p>
      </div>
    </SingleItemStyles>
  );
}

export default SingleItem;
