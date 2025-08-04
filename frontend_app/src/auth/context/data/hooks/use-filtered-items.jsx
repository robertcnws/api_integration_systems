import { useMemo } from 'react';

export function useFilteredItems(items) {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.filter(item => item?.canBeBought && item?.assignedPoints > 0 && item?.item?.stock_on_hand > 0);
  }, [items]);
}
