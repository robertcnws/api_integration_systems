import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardPointsByUsername(username, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardPointsByUsername($username: String!) {
        rewardPointsByUsername(username: $username) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
    variables: { username },
    skip: !username,
  });

  const value = data?.rewardPointsByUsername || {};

  return { loading, error, data: value, refetch };
}


export function useAllRewardPoints(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardPoints {
        allRewardPoints {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
  });

  const value = data?.allRewardPoints || [];

  return { loading, error, data: value, refetch };
}