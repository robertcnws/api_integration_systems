import { useMemo } from 'react';

import { isClient } from 'src/utils/check-permissions';

export function useFilteredNotifications(notifications, projects, services, measurements, userLogged) {
  const projectsIds = useMemo(() => projects.map((project) => project.id), [projects]);

  const servicesIds = useMemo(() => services.map((service) => service.id), [services]);

  const measurementsIds = useMemo(() => measurements.map((measurement) => measurement.id), [measurements]);

  const allIds = useMemo(
    () => [...projectsIds, ...servicesIds, ...measurementsIds]
    , [projectsIds, servicesIds, measurementsIds]);

  
  // console.log('allIds', allIds);

  const isInstallerRole = isClient(userLogged?.data?.user_role?.name);

  const filteredNotifications = useMemo(() => {
    if (!notifications || !allIds.length) return [];

    if (!isInstallerRole && !userLogged) {
      return notifications;
    }
    return notifications.filter((notification) => {
      const itemId = notification.notification.info_id;
      if (!itemId || !allIds.includes(itemId)) return false;
      return true;
    });
  }, [notifications, allIds, isInstallerRole, userLogged]);

  return filteredNotifications;
}
