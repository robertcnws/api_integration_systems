import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

// By ID
export function useRewardLoginUserById(id, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardLoginUserById($id: String!) {
        loginUserById(id: $id) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardAuthorization',
    },
    variables: { id },
    skip: !id,
  });

  const value = data?.loginUserById || {};

  return { loading, error, data: value, refetch };
}

// By Username
export function useRewardLoginUserByUsername(username, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardLoginUserByUsername($username: String!) {
        loginUserByUsername(username: $username) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardAuthorization',
    },
    variables: { username },
    skip: !username,
  });

  const value = data?.loginUserByUsername || {};

  return { loading, error, data: value, refetch };
}


// By User Role
export function useRewardLoginUserByUserRole(userRoleId, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardLoginUserByUserRole($userRoleId: String!) {
        loginUsersByUserRole(userRoleId: $userRoleId) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardAuthorization',
    },
    variables: { userRoleId },
    skip: !userRoleId,
  });

  const value = data?.loginUsersByUserRole || [];

  return { loading, error, data: value, refetch };
}


// All Reward Users
export function useAllRewardLoginUsers(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardLoginUsers {
        allLoginUsers {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardAuthorization',
    },
  });

  const value = data?.allLoginUsers || [];

  return { loading, error, data: value, refetch };
}