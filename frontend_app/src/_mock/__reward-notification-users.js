import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardAllNotificationUsers(creator, user, page, pageSize, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query GetAllNotificationUsers($creator: String, $user: String, $page: Int, $pageSize: Int) {
        allNotificationUsers(creator: $creator, user: $user, page: $page, pageSize: $pageSize) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardUsers',
    },
    variables: { creator, user, page, pageSize },
    skip: !creator && !user && !page && !pageSize,
    fetchPolicy: 'network-only',
  });

  const value = data?.allNotificationUsers?.results || [];

  return { loading, error, data: value, refetch };
}