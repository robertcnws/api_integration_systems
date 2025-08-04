import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardPointsSettings } from 'src/_mock/__reward-points-settings';

import { fieldsRewardPointsSettings } from '../field-descriptors/field-descriptors-reward-points-settings';

const RewardPointsSettingsContext = createContext();
export const useRewardPointsSettings = () => useContext(RewardPointsSettingsContext);

export function RewardPointsSettingsProvider({ children }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);
  
    const roleName = useMemo(() => {
      const user = userLogged?.data;
      return user?.user_role ? user.user_role.name : '';
    }, [userLogged]);

  const fields = useMemo(() => fieldsRewardPointsSettings, []);

  const allPointsSettingsQuery = useAllRewardPointsSettings(fields);

  const loadedAllRewardPointsSettings = useMemo(
    () => roleName !== 'client' ?
    allPointsSettingsQuery.data : [],
    [allPointsSettingsQuery, roleName]
  );

  const refetchAllRewardPointsSettings = useMemo(
    () => (roleName !== 'client') ? allPointsSettingsQuery.refetch : () => {},
    [allPointsSettingsQuery, roleName]
  );

  const loadingAllRewardPointsSettings = roleName !== 'client' ?
    allPointsSettingsQuery.loading : false;

  const errorRewardPointsSettings = roleName !== 'client' ?
    allPointsSettingsQuery.error : null;

  const value = useMemo(
    () => ({
      loadedAllRewardPointsSettings,
      refetchAllRewardPointsSettings,
      loadingAllRewardPointsSettings,
      errorRewardPointsSettings,
    }),
    [
      loadedAllRewardPointsSettings,
      refetchAllRewardPointsSettings,
      loadingAllRewardPointsSettings,
      errorRewardPointsSettings,
    ]
  );

  return (
    <RewardPointsSettingsContext.Provider value={value}>
      {children}
    </RewardPointsSettingsContext.Provider>
  );
}