import React, { useMemo, useContext, createContext } from 'react';

import { useAllRewardUserRoles } from 'src/_mock/__reward-user-roles';

import { useFilteredUserRoles } from '../hooks/use-filtered-user-roles';
import { fieldsUserRoles } from '../field-descriptors/field-descriptors-user-roles';

const RewardUserRolesContext = createContext();
export const useRewardUserRoles = () => useContext(RewardUserRolesContext);

export function RewardUserRolesProvider({ children }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => {
    const user = userLogged?.data;
    return user?.user_role ? user.user_role.name : '';
  }, [userLogged]);

  const fields = useMemo(() => fieldsUserRoles, []);

  const allUserRolesQuery = useAllRewardUserRoles(fields);

  const listAllRewardUserRoles = roleName === 'admin' || roleName === 'superadmin' ?
    allUserRolesQuery.data : []

  const refetchAllRewardUserRoles = useMemo(
    () => (roleName === 'admin' || roleName === 'superadmin') ? allUserRolesQuery.refetch : () => {},
    [allUserRolesQuery, roleName]
  );

  const loadingAllRewardUserRoles = roleName === 'admin' || roleName === 'superadmin' ?
    allUserRolesQuery.loading : false;

  const errorRewardUserRoles = roleName === 'admin' || roleName === 'superadmin' ?
    allUserRolesQuery.error : null;

  const loadedAllRewardUserRoles = useFilteredUserRoles(listAllRewardUserRoles);

  const value = useMemo(
    () => ({
      loadedAllRewardUserRoles,
      refetchAllRewardUserRoles,
      loadingAllRewardUserRoles,
      errorRewardUserRoles,
    }),
    [
      loadedAllRewardUserRoles,
      refetchAllRewardUserRoles,
      loadingAllRewardUserRoles,
      errorRewardUserRoles,
    ]
  );

  return (
    <RewardUserRolesContext.Provider value={value}>
      {children}
    </RewardUserRolesContext.Provider>
  );
}