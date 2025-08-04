import { m } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { isClient } from 'src/utils/check-permissions';
import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

import { useDataContext } from 'src/auth/context/data/data-context';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

export function NotificationsDrawer({ sx, ...other }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);
  const username = userLogged?.data?.username;
  const roleName = userLogged?.data?.user_role?.name;

  const clientModules = useMemo(
    () => [
      'points_settings',
      'reward_points',
      'store_products',
      'store_product_review_reactions',
      'store_product_reviews',
    ],
    []
  );

  const clientTypes = useMemo(
    () => [
      'manage_store_product_selection_buy_use',
      'manage_store_product_selection_buy_refund',
    ],
    []
  );

  const {
    loadedNotifications = [],
    refetchNotifications,
  } = useDataContext();

  useEffect(() => {
    refetchNotifications?.().catch(console.error);
  }, [refetchNotifications]);

  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.users.notificationUsers);
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (['created', 'updated', 'deleted'].includes(msg.type)) {
        refetchNotifications?.().catch(console.error);
      }
    };
    socket.onerror = console.error;
    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, [refetchNotifications]);

  const [myNotifications, setMyNotifications] = useState([]);

  useEffect(() => {
    setMyNotifications(
      loadedNotifications.filter((n) => n.user.username === username)
    );
  }, [loadedNotifications, username]);

  // const myNotifications = useMemo(
  //   () => loadedNotifications.filter(
  //     (n) => n.user.username === username
  //   ),
  //   [loadedNotifications, username]
  // );

  const roleFilteredNotifications = useMemo(() => {
    if (isClient(roleName)) {
      return myNotifications.filter(
        (n) =>
          clientModules.includes(n.notification.module) ||
          clientTypes.includes(n.notification.type)
      );
    }
    return myNotifications;
  }, [myNotifications, roleName, clientModules, clientTypes]);
  

  const [currentTab, setCurrentTab] = useState('all');
  const handleChangeTab = useCallback((_, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // Filter according to tab
  const filteredNotifications = useMemo(() => {
    if (currentTab === 'unread') {
      return roleFilteredNotifications.filter((n) => !n.read);
    }
    if (currentTab === 'archived') {
      return roleFilteredNotifications.filter((n) => n.read);
    }
    return roleFilteredNotifications;
  }, [roleFilteredNotifications, currentTab]);

  const totalAll = roleFilteredNotifications.length;
  const totalUnRead = roleFilteredNotifications.filter((n) => !n.read).length;
  const totalRead = roleFilteredNotifications.filter((n) => n.read).length;

  const handleMarkAllAsRead = useCallback(async () => {
    const ids = roleFilteredNotifications.map((n) => n.id);
    await axiosInstanceBackend.post(endpoints.user.notifications.markAsRead, {
      userReporter: userLogged.data,
      notificationIds: ids,
    });
    refetchNotifications?.().catch(console.error);
  }, [roleFilteredNotifications, userLogged, refetchNotifications]);


  const handleDeleteNotifications = useCallback(async () => {
    const toDelete = (currentTab === 'all'
      ? roleFilteredNotifications
      : currentTab === 'unread'
      ? roleFilteredNotifications.filter((n) => !n.read)
      : roleFilteredNotifications.filter((n) => n.read)
    ).map((n) => n.id);
    await axiosInstanceBackend.delete(endpoints.user.notifications.deleteAll, {
      data: { userReporter: userLogged.data, notificationIds: toDelete }
    });
    setCurrentTab('all');
    refetchNotifications?.().catch(console.error);
  }, [roleFilteredNotifications, currentTab, userLogged, refetchNotifications]);

  const drawer = useBoolean();

  const TABS = [
    { value: 'all', label: 'All', count: totalAll },
    { value: 'unread', label: 'Unread', count: totalUnRead },
    { value: 'archived', label: 'Archived', count: totalRead },
  ];

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 50 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={drawer.onFalse} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:settings-bold-duotone" />
      </IconButton>
    </Stack>
  );

  const renderTabs = (
    <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
        />
      ))}
    </CustomTabs>
  );

  const renderList = (
    <Scrollbar>
      <Box component="ul">
        {filteredNotifications?.map((notification) => (
          <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
            <NotificationItem notification={notification} drawer={drawer} />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <SvgIcon>
            {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420, maxHeight: '96%' } }}
      >
        {renderHead}

        {renderTabs}

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large" color='error' variant="outlined" onClick={handleDeleteNotifications} disabled={filteredNotifications?.length === 0}>
            Delete {currentTab === 'all' ? 'All' : currentTab === 'unread' ? 'Unread' : 'Archived'} Notifications
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
