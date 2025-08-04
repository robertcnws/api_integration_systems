import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardItemsById(itemId, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardItemsById($itemId: String!) {
        rewardItemById(itemId: $itemId) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardIntegration',
    },
    variables: { itemId },
    skip: !itemId,
  });

  const value = data?.rewardItemById || {};

  return { loading, error, data: value, refetch };
}


export function useAllRewardItems(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardItems {
        allRewardItems {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardIntegration',
    },
  });

  const value = data?.allRewardItems || [];

  return { loading, error, data: value, refetch };
}