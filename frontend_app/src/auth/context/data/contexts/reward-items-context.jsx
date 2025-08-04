import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardItems } from 'src/_mock/__reward-items';

import { useFilteredItems } from '../hooks/use-filtered-items';
import { fieldsRewardItems } from '../field-descriptors/field-descriptors-reward-items';

const RewardItemsContext = createContext();
export const useRewardItems = () => useContext(RewardItemsContext);

export function RewardItemsProvider({ children }) {

  const fields = useMemo(() => fieldsRewardItems, []);

  const allItemsQuery = useAllRewardItems(fields);

  const loadedAllRewardItems = allItemsQuery.data;

  const refetchAllRewardItems = allItemsQuery.refetch;

  const loadingAllRewardItems = allItemsQuery.loading || false;

  const errorRewardItems = allItemsQuery.error || null;

  const loadedFilteredRewardItems = useFilteredItems(loadedAllRewardItems);

  const value = useMemo(
    () => ({
      loadedAllRewardItems,
      loadedFilteredRewardItems,
      refetchAllRewardItems,
      loadingAllRewardItems,
      errorRewardItems,
    }),
    [
      loadedAllRewardItems,
      loadedFilteredRewardItems,
      refetchAllRewardItems,
      loadingAllRewardItems,
      errorRewardItems,
    ]
  );

  return (
    <RewardItemsContext.Provider value={value}>
      {children}
    </RewardItemsContext.Provider>
  );
}