import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardUserRoleById(id, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardUserRoleById($id: String!) {
        userRoleById(id: $id) {
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

  const value = data?.userRoleById || {};

  return { loading, error, data: value, refetch };
}


export function useAllRewardUserRoles(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardUserRoles {
        allUserRoles {
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

  const value = data?.allUserRoles || [];

  return { loading, error, data: value, refetch };
}