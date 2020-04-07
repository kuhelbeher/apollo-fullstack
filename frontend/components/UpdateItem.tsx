import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { Item } from '../types';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      price
      description
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
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

type UpdateItemRes = {
  updateItem: {
    item: Item;
  };
};

type UpdateItemVars = {
  id: string;
  title?: string;
  description?: string;
  price?: string;
};

function UpdateItem({ id }: Props) {
  const [values, setValues] = useState<Omit<UpdateItemVars, 'id'>>({});

  const { data, loading: fetching } = useQuery<SingleItemRes, SingleItemVars>(
    SINGLE_ITEM_QUERY,
    {
      variables: { id },
    }
  );

  const [updateItem, { loading, error }] = useMutation<
    UpdateItemRes,
    UpdateItemVars
  >(UPDATE_ITEM_MUTATION);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    const val = type === 'number' ? parseFloat(value) || 0 : value;

    setValues({ ...values, [name]: val });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // stop form from submitting
    e.preventDefault();
    // call the mutation
    await updateItem({
      variables: {
        id,
        ...values,
      },
    });
  };

  if (fetching) {
    return <p>Loading...</p>;
  }

  if (!data || !data.item) {
    return <p>No item found for ID: {id}</p>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            defaultValue={data.item.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            required
            defaultValue={data.item.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            required
            defaultValue={data.item.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
      </fieldset>
    </Form>
  );
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
