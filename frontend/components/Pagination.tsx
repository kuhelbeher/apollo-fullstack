import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

type Props = {
  page: number;
};

type PaginationData = {
  itemsConnection: {
    aggregate: {
      count: number;
    };
  };
};

function Pagination({ page }: Props) {
  const { loading, data } = useQuery<PaginationData>(PAGINATION_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return null;
  }

  const { count } = data.itemsConnection.aggregate;
  const pages = Math.ceil(count / perPage);

  return (
    <PaginationStyles data-test="pagination">
      <Head>
        <title>
          Sick Fits! Page {page} of {pages}
        </title>
      </Head>
      <Link href={{ pathname: 'items', query: { page: page - 1 } }}>
        <a className="prev" aria-disabled={page <= 1}>
          Prev
        </a>
      </Link>
      <p>
        Page {page} of <span className="total-pages">{pages}</span>
      </p>
      <p>{count} Items Total</p>
      <Link href={{ pathname: 'items', query: { page: page + 1 } }}>
        <a className="next" aria-disabled={page >= pages}>
          Next
        </a>
      </Link>
    </PaginationStyles>
  );
}

export default Pagination;
