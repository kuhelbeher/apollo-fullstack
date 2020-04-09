import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from '../hooks';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

type Props = {
  resetToken: string;
};

type ResetVars = {
  resetToken: string;
  password: string;
  confirmPassword: string;
};

function Reset({ resetToken }: Props) {
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });

  const [reset, { loading, error }] = useMutation<{ reset: {} }, ResetVars>(
    RESET_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: value });
  };

  return (
    <Form
      method="post"
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await reset({
            variables: {
              ...values,
              resetToken,
            },
          });

          setValues({ password: '', confirmPassword: '' });
        } catch (error) {}
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset Password</h2>
        <Error error={error} />
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={values.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  );
}

export default Reset;
