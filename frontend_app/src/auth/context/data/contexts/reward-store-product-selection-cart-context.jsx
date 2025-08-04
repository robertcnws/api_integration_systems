import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardStoreProductSelectionCarts } from 'src/_mock/__reward-store-product-selection-carts';

import { fieldsRewardStoreProductSelectionCarts } from '../field-descriptors/field-descriptors-reward-store-product-selection';


const RewardStoreProductSelectionCartContext = createContext();
export const useRewardStoreProductSelectionCart = () => useContext(RewardStoreProductSelectionCartContext);

export function RewardStoreProductSelectionCartProvider({ children }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);
  
    const roleName = useMemo(() => {
      const user = userLogged?.data;
      return user?.user_role ? user.user_role.name : '';
    }, [userLogged]);

  const fields = useMemo(() => fieldsRewardStoreProductSelectionCarts, []);

  const allQuery = useAllRewardStoreProductSelectionCarts(fields);

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
    <RewardStoreProductSelectionCartContext.Provider value={value}>
      {children}
    </RewardStoreProductSelectionCartContext.Provider>
  );
}