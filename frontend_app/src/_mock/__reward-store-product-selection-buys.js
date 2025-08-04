import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardStoreProductSelectionBuyByUsername(username, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardStoreProductSelectionBuyByUsername($username: String!) {
        rewardStoreProductSelectionBuyByUsername(username: $username) {
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

  const value = data?.rewardStoreProductSelectionBuyByUsername || [];

  return { loading, error, data: value, refetch };
}


export function useAllRewardStoreProductSelectionBuys(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardStoreProductSelectionBuys {
        allRewardStoreProductSelectionBuys {
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

  const value = data?.allRewardStoreProductSelectionBuys || [];

  return { loading, error, data: value, refetch };
}