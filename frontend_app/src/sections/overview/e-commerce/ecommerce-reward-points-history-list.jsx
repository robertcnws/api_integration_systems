import dayjs from 'dayjs';
import React, { useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Typography, LinearProgress } from '@mui/material';

import { wsEndpoints } from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export function EcommerceRewardPointsHistoryList({
  title,
  subheader,
  loadedRewardPoints,
  refetchRewardPoints,
  ...other
}) {

  const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));
  const username = userLogged?.data?.username;

  const {
    loadedRewardPointsHistory,
    refetchRewardPointsHistory,
    loadingRewardPointsHistory,
    errorRewardPointsHistory
  } = useDataContext();


  useEffect(() => {
    const url = wsEndpoints.rewardPoints.rewardPointsHistory.byUsername(username);
    const socket = new WebSocket(url);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'created' || msg.type === 'updated' || msg.type === 'deleted') {
        refetchRewardPointsHistory().catch(console.error);
        refetchRewardPoints().catch(console.error);
      }
    };
    socket.onerror = console.error;

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, [username, refetchRewardPointsHistory, refetchRewardPoints]);

  const list = useMemo(() => {
    if (!loadedRewardPointsHistory || !Array.isArray(loadedRewardPointsHistory)) {
      return [];
    }
    const rewardPointsHistory = loadedRewardPointsHistory ?? [];
    // console.log('Reward Points History:', rewardPointsHistory?.length);
    const pointsHistory = [...rewardPointsHistory].sort((a, b) => {
      if (a.createdTime && b.createdTime) return dayjs(b.createdTime).diff(dayjs(a.createdTime));
      if (!a.createdTime && b.createdTime) return 1;
      if (a.createdTime && !b.createdTime) return -1;
      return 0;
    });
    return pointsHistory || [];
  }, [loadedRewardPointsHistory]);

  return (
    <Card {...other} sx={{ height: 1, ...other.sx }}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ maxHeight: 1 }}>
        {loadingRewardPointsHistory ? (
          <Box
            sx={{
              width: 350,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Loading reward points history...
            </Typography>
            <LinearProgress
              sx={{
                mb: 2,
                width: '100%',
                '& .MuiLinearProgress-bar': { backgroundColor: 'black' },
                backgroundColor: '#e0e0e0',
              }}
            />
          </Box>
        ) : errorRewardPointsHistory ? (
          <Typography color="error" sx={{ p: 3 }}>
            {errorRewardPointsHistory.message || 'Error loading history'}
          </Typography>
        ) : (
          <Box
            sx={{
              p: 3,
              gap: 3,
              minWidth: 360,
              maxHeight: 380,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {list?.map((item) => (
              <Item key={item.id} item={item} />
            ))}
            {list.length === 0 && (
              <Typography sx={{ textAlign: 'center' }}>No history yet</Typography>
            )}
          </Box>
        )}
      </Scrollbar>
    </Card>
  );
}

function Item({ item, sx, ...other }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      {/* <Avatar
        variant="rounded"
        alt={item.name}
        src={item.coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      /> */}



      <Iconify
        icon={
          item?.action === 'gained' ?
            'streamline-stickies-color:reward' :
            item?.action === 'refunded' ?
              'streamline-stickies-color:money-briefcase' :
              item?.action === 'assigned' ?
                'fluent-color:reward-24' :
                item?.action === 'substracted' ?
                  'fluent-color:error-circle-16' :
                  'streamline-ultimate-color:warehouse-cart-packages-2'
        }
        width={48}
        height={48}
        sx={{ flexShrink: 0 }}
      />

      <Box
        sx={{ gap: 0.5, minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      >
        <Link noWrap sx={{ color: 'text.primary', typography: 'subtitle2' }}>
          {item.description}
        </Link>

        <Box sx={{ gap: 0.5, display: 'flex', typography: 'body2', color: 'text.secondary' }}>
          {(!!item.spentPoints) && (
            <Box component="span" sx={{ textDecoration: 'line-through', color: 'error.main' }}>
              - {fNumber(item.spentPoints)} points
            </Box>
          )}
          {(!!item.gainedPoints) && (
            <Box component="span" sx={{ color: 'success.main' }}>
              + {fNumber(item.gainedPoints)} points
            </Box>
          )}

          <Box component="span" sx={{ color: 'text.disabled' }}>
            {fDateTime(item.createdTime)}
          </Box>
        </Box>
      </Box>

      {/* <ColorPreview limit={3} colors={item.colors} /> */}
    </Box>
  );
}
