import React, { useState, ChangeEvent } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import { User } from '../types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

type AllUsersRes = {
  users: User[];
};

function Permissions() {
  const { data, error, loading } = useQuery<AllUsersRes>(ALL_USERS_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <Error error={error} />
      </div>
    );
  }

  return (
    <div>
      <h2>Manage Permissions</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {possiblePermissions.map(permission => (
              <th key={permission}>{permission}</th>
            ))}
            <th>👇</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map(user => (
            <UserPermissionsItem key={user.id} user={user} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

type UserPermissionsItemProps = {
  user: User;
};

type UpdatePermissionsRes = {
  updatePermissions: User;
};

type UpdatePermissionsVars = {
  permissions: string[];
  userId: string;
};

function UserPermissionsItem({ user }: UserPermissionsItemProps) {
  const [permissions, setPermissions] = useState(user.permissions);

  const [updatePermissions, { loading, error }] = useMutation<
    UpdatePermissionsRes,
    UpdatePermissionsVars
  >(UPDATE_PERMISSIONS_MUTATION, {
    variables: {
      permissions,
      userId: user.id,
    },
  });

  const handleChange = ({
    target: { value, checked },
  }: ChangeEvent<HTMLInputElement>) => {
    const updatedPermissions = checked
      ? [...permissions, value]
      : permissions.filter(permission => permission !== value);

    setPermissions(updatedPermissions);
  };

  return (
    <>
      {error && (
        <tr>
          <td colSpan={8}>
            <Error error={error} />
          </td>
        </tr>
      )}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={permissions.includes(permission)}
                value={permission}
                onChange={handleChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            type="button"
            disabled={loading}
            onClick={updatePermissions}
          >
            Updat{loading ? 'ing' : 'e'}
          </SickButton>
        </td>
      </tr>
    </>
  );
}

export default Permissions;
