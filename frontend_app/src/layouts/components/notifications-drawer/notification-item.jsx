import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export function NotificationItem({ notification, drawer }) {

  const { loadedProjects } = useDataContext();

  const projectExists = useMemo(
    () => loadedProjects?.find((project) => project.id === notification.notification.info_id),
    [loadedProjects, notification]);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const router = useRouter();

  const handleLink = useCallback(
    async (module, element = 'list', type = '') => {
      if (module === 'projects' && element !== 'list' && projectExists) {
        localStorage.setItem('projectId', element);
      }
      router.push(
        module === 'projects' && element === 'list' ? paths.dashboard.project.list :
          module === 'projects' && element !== 'list' && projectExists ? paths.dashboard.project.details(element) :
            module === 'projects' && element !== 'list' && !projectExists ? paths.dashboard.project.list :
              module === 'users' ? paths.dashboard.user.list :
                module === 'stages' ? paths.dashboard.stage.list :
                  module === 'stage_tasks' ? paths.dashboard.stageTask.list :
                    module === 'project_tasks' ? paths.dashboard.task.list :
                      module === 'default_tasks' ? paths.dashboard.task.list :
                        module === 'user_roles' ? paths.dashboard.role.list : ''
      );
      if (!notification.read) {
        await axiosInstanceBackend.post(endpoints.user.notifications.markAsRead, {
          userReporter: userLogged?.data,
          notificationIds: [notification.id],
        });
      }
      drawer.onFalse();
    },
    [router, notification, drawer, userLogged, projectExists]
  );

  const renderAvatar = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'background.neutral' }}
      >
        <Box
          component="img"
          src={
            `${CONFIG.assetsDir}/assets/icons/notification/${notification.notification.module.replace(/_/g, '-')}/ic-${notification.notification.type.replace(/_/g, '-')}.svg`
          }
          alt={notification.notification.type}
          sx={{ width: 44, height: 44 }}
        />
      </Stack>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(`User ${notification.username} ${notification.notification.info}`)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.createdTime)}
          {notification.notification.module}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  const projectAction = (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {reader(
          `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`
        )}
      </Box>

      <Button size="small" variant="contained">
        Reply
      </Button>
    </Stack>
  );

  const fileAction = (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <FileThumbnail file="http://localhost:8080/httpsdesign-suriname-2015.mp3" />

      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} flexGrow={1} sx={{ minWidth: 0 }}>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }} noWrap>
              design-suriname-2015.mp3
            </Typography>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.disabled' }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  }}
                />
              }
            >
              <span>2.3 GB</span>
              <span>30 min ago</span>
            </Stack>
          }
        />

        <Button size="small" variant="outlined">
          Download
        </Button>
      </Stack>
    </Stack>
  );

  const tagsAction = (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">
        Design system
      </Label>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Pay
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  const notificationAction = (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color={projectExists ? 'info' : 'secondary'} sx={{ cursor: 'pointer' }}
        onClick={() => handleLink(
          notification.notification.module, notification.notification.info_id, notification.notification.type
        )}>
        See in {projectExists ? 'Details' : 'List'}
      </Label>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notificationAction}
        {/* {notification.type === 'friend' && friendAction}
        {notification.type === 'project' && projectAction}
        {notification.type === 'file' && fileAction}
        {notification.type === 'tags' && tagsAction}
        {notification.type === 'payment' && paymentAction} */}
      </Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        ml: 1,
        mr: 1,
        mb: 0.5,
        fontSize: '0.875rem',
        // '& p': { typography: 'subtitle2', m: 0 },
        // '& a': { color: 'inherit', textDecoration: 'none' },
        // '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
