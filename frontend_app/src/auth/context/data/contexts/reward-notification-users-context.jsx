import React, { useMemo, useContext, createContext } from 'react';

import { useRewardAllNotificationUsers } from 'src/_mock/__reward-notification-users';

import { fieldsNotificationUsers } from '../field-descriptors/field-descriptors-notification-users';


const RewardNotificationUsersContext = createContext();
export const useRewardNotificationUsers = () => useContext(RewardNotificationUsersContext);

export function RewardNotificationUsersProvider({ children }) {

    // const { userLogged } = useAuth();

    const userLogged = JSON.parse(sessionStorage.getItem('userLogged')) || null;

    // const { loadedProjects = [] } = useProjects() || {};

    // const { loadedServices = []} = useServices() || {};

    // const { loadedMeasurements =[] } = useMeasurements() || {};

    const fields = useMemo(() => fieldsNotificationUsers, []);

    const {
        data: notifications,
        loading: loadingNotifications,
        error: errorNotifications,
        refetch: refetchNotifications
    } = useRewardAllNotificationUsers(null, userLogged?.data.username, 1, 100, fields);


    // const filteredNotifications = useFilteredNotifications(
    //     notifications,
    //     loadedProjects,
    //     loadedServices,
    //     loadedMeasurements,
    //     userLogged
    // );

    const loadedNotifications = useMemo(() => notifications || null, [notifications]);

    const value = useMemo(() => ({
        loadedNotifications,
        refetchNotifications,
        loadingNotifications,
        errorNotifications
    }), [
        loadedNotifications,
        refetchNotifications,
        loadingNotifications,
        errorNotifications
    ]);

    return <RewardNotificationUsersContext.Provider value={value}>{children}</RewardNotificationUsersContext.Provider>;
}