import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { Item } from '../types';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

function CreateItem() {
  const [values, setValues] = useState({
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  });

  const [createItem, { loading, error }] = useMutation<
    { createItem: Item },
    Omit<Item, 'id'>
  >(CREATE_ITEM_MUTATION);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    const val = type === 'number' ? parseFloat(value) || 0 : value;

    setValues({ ...values, [name]: val });
  };

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files) {
      return;
    }

    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/kuhelbeher/image/upload',
      { method: 'POST', body: data }
    );

    const file = await res.json();

    setValues({
      ...values,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  return (
    <Form
      data-test="form"
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        // stop form from submitting
        e.preventDefault();
        // call the mutation
        const res = await createItem({ variables: values });
        // change them to the single item page
        Router.push({
          pathname: '/item',
          query: { id: res?.data?.createItem.id },
        });
      }}
    >
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Upload an image"
            required
            onChange={uploadFile}
          />
          {values.image && (
            <img
              data-test="uploaded-image"
              width="200"
              src={values.image}
              alt="Upload Preview"
            />
          )}
        </label>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            value={values.title}
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
            value={values.price}
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
            value={values.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}

export default CreateItem;
