import { useMemo } from 'react';

import { isSuperAdmin, listRolesAndSubroles } from 'src/utils/check-permissions';

export function usePossibleUserRoles(userRoles, userLogged) {
    return useMemo(() => {
        if (!isSuperAdmin(userLogged?.data?.user_role?.name)) {
            const possibleRoles = listRolesAndSubroles(userLogged?.data?.user_role?.name).filter(
                (role) => role !== userLogged?.data?.user_role?.name
            );
            return userRoles?.filter((role) => possibleRoles.includes(role.name));
        }
        return userRoles;
    }, [userRoles, userLogged]);
}