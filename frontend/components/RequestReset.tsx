import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

type RequestResetType = {
  email: string;
};

function RequestReset() {
  const [email, setEmail] = useState('');

  const [requestReset, { loading, error, called }] = useMutation<
    {
      requestReset: {};
    },
    RequestResetType
  >(REQUEST_RESET_MUTATION);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
  };

  return (
    <Form
      data-test="form"
      method="post"
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await requestReset({ variables: { email } });

          setEmail('');
        } catch (error) {}
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset</h2>
        <Error error={error} />
        {!error && !loading && called && (
          <p>Success! Check your email for a reset link</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}

export default RequestReset;
