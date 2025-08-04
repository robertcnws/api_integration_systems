import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardStoreProductSelectionCartByUsername(username, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardStoreProductSelectionCartByUsername($username: String!) {
        rewardStoreProductSelectionCartByUsername(username: $username) {
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
    fetchPolicy: 'network-only',
  });

  const value = data?.rewardStoreProductSelectionCartByUsername || [];

  return { loading, error, data: value, refetch };
}


export function useAllRewardStoreProductSelectionCarts(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardStoreProductSelectionCarts {
        allRewardStoreProductSelectionCarts {
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

  const value = data?.allRewardStoreProductSelectionCarts || [];

  return { loading, error, data: value, refetch };
}