import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

function Signup() {
  const [values, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        try {
          await signup({ variables: values });

          setValues({ email: '', name: '', password: '' });
        } catch (error) {}
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign up for an account</h2>
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
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="name"
            value={values.name}
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
        <button type="submit">Signup</button>
      </fieldset>
    </Form>
  );
}

export default Signup;
