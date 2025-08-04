import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { buildSelection } from 'src/utils/graphql-client';

export function useRewardStoreProductById(storeProductId, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardStoreProductById($storeProductId: String!) {
        rewardStoreProductById(storeProductId: $storeProductId) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
    variables: { storeProductId },
    skip: !storeProductId,
  });

  const value = data?.rewardStoreProductById || {};

  return { loading, error, data: value, refetch };
}


export function useRewardStoreProductDetailsById(storeProductId, fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query RewardStoreProductDetailsById($storeProductId: String!) {
        rewardStoreProductDetailsById(storeProductId: $storeProductId) {
          ${selection}
        }
      }
    `;
  }, [fieldsDescriptor]);

  const { loading, error, data, refetch } = useQuery(QUERY, {
    context: {
      clientName: 'RewardPoints',
    },
    variables: { storeProductId },
    skip: !storeProductId,
  });

  const value = data?.rewardStoreProductDetailsById || {};

  return { loading, error, data: value, refetch };
}


export function useAllRewardStoreProducts(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardStoreProducts {
        allRewardStoreProducts {
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

  const value = data?.allRewardStoreProducts || [];

  return { loading, error, data: value, refetch };
}

export function useAllRewardStoreProductDetails(fieldsDescriptor) {
  const QUERY = useMemo(() => {
    const selection = buildSelection(fieldsDescriptor).join('\n      ');
    return gql`
      query AllRewardStoreProductDetails {
        allRewardStoreProductDetails {
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

  const value = data?.allRewardStoreProductDetails || [];

  return { loading, error, data: value, refetch };
}