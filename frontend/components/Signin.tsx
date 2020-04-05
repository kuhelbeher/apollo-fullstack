import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from '../hooks';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

type SignInRes = {
  signin: {};
};

type SignInVars = {
  email: string;
  password: string;
};

function Signin() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [signin, { loading, error }] = useMutation<SignInRes, SignInVars>(
    SIGNIN_MUTATION,
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
          await signin({ variables: values });

          setValues({ email: '', password: '' });
        } catch (error) {}
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in for an account</h2>
        <Error error={error} />
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}

export default Signin;
