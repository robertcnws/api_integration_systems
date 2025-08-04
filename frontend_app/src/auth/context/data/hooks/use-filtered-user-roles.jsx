import { useMemo } from 'react';

export function useFilteredUserRoles(items) {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.filter(item => item?.userRole?.name !== 'superadmin');
  }, [items]);
}
