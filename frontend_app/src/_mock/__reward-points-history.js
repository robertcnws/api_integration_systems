import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardPointsHistoryByRewardPointsId(rewardPointsId, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardPointsHistoryByRewardPointsId($rewardPointsId: String!) {
        rewardPointsHistoryById(rewardPointsId: $rewardPointsId) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
    variables: { rewardPointsId },
    skip: !rewardPointsId,
  });

  const value = data?.rewardPointsHistoryById || [];

  return { loading, error, data: value, refetch };
}


export function useRewardPointsHistoryByAction(action, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardPointsHistoryByAction($action: String!) {
        rewardPointsHistoryByAction(action: $action) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
    variables: { action },
    skip: !action,
  });

  const value = data?.rewardPointsHistoryByAction || [];

  return { loading, error, data: value, refetch };
}