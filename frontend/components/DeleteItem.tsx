import React, { ReactNode } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';
import { Item } from '../types';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

type Props = {
  id: string;
  children: ReactNode;
};

type DeleteItem = {
  id: string;
};

type ItemsQueryType = {
  items: Item[];
};

function DeleteItem({ id, children }: Props) {
  const [deleteItem] = useMutation<{ deleteItem: DeleteItem }>(
    DELETE_ITEM_MUTATION,
    {
      update(cache, payload) {
        // manually update the cache on the client, so it matches the server
        // 1. read the cache for the items we want
        const data = cache.readQuery<ItemsQueryType>({
          query: ALL_ITEMS_QUERY,
        });

        if (data) {
          // 2. filter the deleted item out of the page
          data.items = data.items.filter(
            item => item.id !== payload.data.deleteItem.id
          );
        }

        // 3. put items back
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
      },
    }
  );

  return (
    <button
      type="button"
      onClick={() => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure you want to delete this?')) {
          deleteItem({ variables: { id } }).catch(err => {
            alert(err.message);
          });
        }
      }}
    >
      {children}
    </button>
  );
}

export default DeleteItem;
