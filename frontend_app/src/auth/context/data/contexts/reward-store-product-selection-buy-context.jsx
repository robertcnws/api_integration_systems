import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardStoreProductSelectionBuys } from 'src/_mock/__reward-store-product-selection-buys';

import { fieldsRewardStoreProductSelectionBuys } from '../field-descriptors/field-descriptors-reward-store-product-selection';


const RewardStoreProductSelectionBuyContext = createContext();
export const useRewardStoreProductSelectionBuy = () => useContext(RewardStoreProductSelectionBuyContext);

export function RewardStoreProductSelectionBuyProvider({ children }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);
  
    const roleName = useMemo(() => {
      const user = userLogged?.data;
      return user?.user_role ? user.user_role.name : '';
    }, [userLogged]);

  const fields = useMemo(() => fieldsRewardStoreProductSelectionBuys, []);

  const allQuery = useAllRewardStoreProductSelectionBuys(fields);

  const loadedAll = useMemo(
    () => roleName !== 'client' ?
    allQuery.data : [],
    [allQuery, roleName]
  );

  const refetchAll = useMemo(
    () => (roleName !== 'client') ? allQuery.refetch : () => {},
    [allQuery, roleName]
  );

  const loadingAll = roleName !== 'client' ?
    allQuery.loading : false;

  const errorAll = roleName !== 'client' ?
    allQuery.error : null;

  const value = useMemo(
    () => ({
      loadedAll,
      refetchAll,
      loadingAll,
      errorAll,
    }),
    [
      loadedAll,
      refetchAll,
      loadingAll,
      errorAll,
    ]
  );

  return (
    <RewardStoreProductSelectionBuyContext.Provider value={value}>
      {children}
    </RewardStoreProductSelectionBuyContext.Provider>
  );
}