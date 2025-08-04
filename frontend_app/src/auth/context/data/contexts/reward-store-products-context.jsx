import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardStoreProductDetails } from 'src/_mock/__reward-store-products';

import { fieldsRewardStoreProductDetails } from '../field-descriptors/field-descriptors-reward-store-products';

const RewardStoreProductsContext = createContext();
export const useRewardStoreProducts = () => useContext(RewardStoreProductsContext);

export function RewardStoreProductsProvider({ children }) {

  // const fields = useMemo(() => fieldsRewardStoreProducts, []);

  const fields = useMemo(() => fieldsRewardStoreProductDetails, []);

  // const allStoreProductsQuery = useAllRewardStoreProducts(fields);

  const allStoreProductsQuery = useAllRewardStoreProductDetails(fields);

  const loadedAllRewardStoreProducts = allStoreProductsQuery.data;

  const refetchAllRewardStoreProducts = allStoreProductsQuery.refetch;

  const loadingAllRewardStoreProducts = allStoreProductsQuery.loading || false;

  const errorRewardStoreProducts = allStoreProductsQuery.error || null;

  const value = useMemo(
    () => ({
      loadedAllRewardStoreProducts,
      refetchAllRewardStoreProducts,
      loadingAllRewardStoreProducts,
      errorRewardStoreProducts,
    }),
    [
      loadedAllRewardStoreProducts,
      refetchAllRewardStoreProducts,
      loadingAllRewardStoreProducts,
      errorRewardStoreProducts,
    ]
  );

  return (
    <RewardStoreProductsContext.Provider value={value}>
      {children}
    </RewardStoreProductsContext.Provider>
  );
}