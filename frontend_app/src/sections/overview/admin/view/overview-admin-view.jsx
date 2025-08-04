import dayjs from 'dayjs';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, LinearProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { listRolesAndSubroles } from 'src/utils/check-permissions';
import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
  ServerErrorIllustration,
} from 'src/assets/illustrations';

import { toast } from 'src/components/snackbar';

import { AdminBooked } from '../admin-booked';
import { AdminDetails } from '../admin-details';
import { AdminAvailable } from '../admin-available';
import { AdminStatistics } from '../admin-statistics';
import { AdminTotalIncomes } from '../admin-total-incomes';
import { AdminWidgetSummary } from '../admin-widget-summary';
import { AdminCheckInWidgets } from '../admin-check-in-widgets';
import { AdminCustomerReviews } from '../admin-customer-reviews';


// ----------------------------------------------------------------------

export function OverviewAdminView({
  loadedRewardPoints,
  refetchRewardPoints,
  loadingRewardPoints,
  errorRewardPoints,
  loadedRewardPointsHistory,
  refetchRewardPointsHistory,
  loadingRewardPointsHistory,
  errorRewardPointsHistory,
  loadedRewardPointsGainedHistory,
  refetchRewardPointsGainedHistory,
  loadingRewardPointsGainedHistory,
  errorRewardPointsGainedHistory,
  loadedRewardPointsSpentHistory,
  refetchRewardPointsSpentHistory,
  loadingRewardPointsSpentHistory,
  errorRewardPointsSpentHistory,
  loadedUsers,
  loadedPendingUsers,
  refetchUsers,
  loadingUsers,
  errorUsers,
  loadedStoreProducts,
  refetchStoreProducts,
  loadingStoreProducts,
  errorStoreProducts,
}) {

  const confirmDeleteReview = useBoolean();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  const onDeleteReview = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.delete(endpoints.rewardPoints.delete.storeProductReview.item(id), {
          data: {
            userReporter: JSON.stringify(userLogged?.data),
          }
        });
        toast.success('Review deletion successfull!');
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    },
    [userLogged?.data]
  );

  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.rewardPoints.storeProductReview.all);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
        // console.log('WebSocket message received:', message);
        refetchStoreProducts?.().catch((error) => {
          console.error('Error refetching store products:', error);
        });
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [refetchStoreProducts]);


  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.rewardPoints.storeProductReviewReaction.all);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
        // console.log('WebSocket message received:', message);
        refetchStoreProducts?.().catch((error) => {
          console.error('Error refetching store products:', error);
        });
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [refetchStoreProducts]);


  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.rewardPoints.rewardPoints.all);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
        refetchRewardPoints?.().catch((error) => {
          console.error('Error refetching reward points:', error);
        });
        refetchRewardPointsHistory?.().catch((error) => {
          console.error('Error refetching reward points history:', error);
        });
        refetchRewardPointsGainedHistory?.().catch((error) => {
          console.error('Error refetching reward points gained history:', error);
        });
        refetchRewardPointsSpentHistory?.().catch((error) => {
          console.error('Error refetching reward points spent history:', error);
        });
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [
    refetchRewardPoints,
    refetchRewardPointsHistory,
    refetchRewardPointsGainedHistory,
    refetchRewardPointsSpentHistory
  ]);


  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.users.all);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
        refetchUsers?.().catch((error) => {
          console.error('Error refetching users:', error);
        });
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [refetchUsers]);


  const approvedRewardPoints = useMemo(
    () => loadedRewardPoints?.filter((point) => point.user?.isApproved) || [],
    [loadedRewardPoints]
  );

  const approvedRewardPointsHistory = useMemo(
    () => loadedRewardPointsHistory?.filter((point) => point.rewardPoints?.user?.isApproved) || [],
    [loadedRewardPointsHistory]
  );

  // console.log('loadedRewardPointsGainedHistory', loadedRewardPointsGainedHistory);

  const approvedRewardPointsGainedHistory = useMemo(
    () => loadedRewardPointsGainedHistory?.filter((point) => point.rewardPoints?.user?.isApproved) || [],
    [loadedRewardPointsGainedHistory]
  );

  const approvedRewardPointsSpentHistory = useMemo(
    () => loadedRewardPointsSpentHistory?.filter((point) => point.rewardPoints?.user?.isApproved) || [],
    [loadedRewardPointsSpentHistory]
  );

  const totalApprovedClients = useMemo(
    () => loadedUsers?.filter((u) => u.userRole?.name === 'client')?.length || 0,
    [loadedUsers]
  );

  const totalPendingClients = useMemo(
    () => loadedPendingUsers?.filter((u) => u.userRole?.name === 'client')?.length || 0,
    [loadedPendingUsers]
  );

  const totalClients = totalApprovedClients + totalPendingClients;

  const totalSpentRewardPoints = useMemo(
    () => approvedRewardPoints?.reduce((total, point) => total + point.totalSpentPoints, 0) || 0,
    [approvedRewardPoints]
  );

  const totalGainedRewardPoints = useMemo(
    () => approvedRewardPoints?.reduce((total, point) => total + point.totalGainedPoints, 0) || 0,
    [approvedRewardPoints]
  );

  const totalAssignedRewardPoints = useMemo(
    () => approvedRewardPoints?.reduce((total, point) => total + point.totalAssignedPoints, 0) || 0,
    [approvedRewardPoints]
  );

  const totalSubstractedRewardPoints = useMemo(
    () => approvedRewardPoints?.reduce((total, point) => total + point.totalSubstractedPoints, 0) || 0,
    [approvedRewardPoints]
  );

  const totalAllPoints = useMemo(
    () => totalSpentRewardPoints + totalGainedRewardPoints + totalAssignedRewardPoints - totalSubstractedRewardPoints,
    [totalSpentRewardPoints, totalGainedRewardPoints, totalAssignedRewardPoints, totalSubstractedRewardPoints]
  );

  const totalRefundedRewardPoints = useMemo(
    () => approvedRewardPointsHistory?.reduce((total, point) => total + point.gainedPoints, 0) || 0,
    [approvedRewardPointsHistory]
  );

  const invoicesAmount = useMemo(
    () => approvedRewardPoints?.reduce((total, point) => total + point.totalAmountInvoices, 0) || 0,
    [approvedRewardPoints]
  );

  const invoicesSeriesByMonth = useMemo(
    () => accumulateByMonth(approvedRewardPoints || [], 'invoices', 'paymentMade', 'date'),
    [approvedRewardPoints]
  );

  const usersSeriesByMonth = useMemo(
    () => accumulateByMonth(loadedUsers || [], null, null, 'createdTime'),
    [loadedUsers]
  );

  const avgUsersTrendPercent = useMemo(() => {
    if (usersSeriesByMonth.length === 0) return 0;
    return usersSeriesByMonth.length > 0 ?
      avgStepTrendPercent(
        usersSeriesByMonth.slice(
          usersSeriesByMonth.length - 12, usersSeriesByMonth.length
        ).map((item) => item.total)
      ) : 0;
  }, [usersSeriesByMonth]);

  const pendingUsersSeriesByMonth = useMemo(
    () => accumulateByMonth(loadedPendingUsers || [], null, null, 'createdTime'),
    [loadedPendingUsers]
  );

  const avgPendingUsersTrendPercent = useMemo(() => {
    if (pendingUsersSeriesByMonth.length === 0) return 0;
    return pendingUsersSeriesByMonth.length > 0 ?
      avgStepTrendPercent(
        pendingUsersSeriesByMonth.slice(
          pendingUsersSeriesByMonth.length - 12, pendingUsersSeriesByMonth.length
        ).map((item) => item.total)
      ) : 0;
  }, [pendingUsersSeriesByMonth]);

  const spentSeriesByMonth = useMemo(
    () => accumulateByMonth(approvedRewardPoints || [], null, 'totalSpentPoints', 'createdTime'),
    [approvedRewardPoints]
  );

  const avgSpentTrendPercent = useMemo(() => {
    if (spentSeriesByMonth.length === 0) return 0;
    return spentSeriesByMonth.length > 0 ?
      avgStepTrendPercent(
        spentSeriesByMonth.slice(
          spentSeriesByMonth.length - 12, spentSeriesByMonth.length
        ).map((item) => item.total)
      ) : 0;
  }, [spentSeriesByMonth]);

  const refundSeriesByMonth = useMemo(
    () => accumulateByMonth(approvedRewardPointsHistory || [], null, 'gainedPoints', 'createdTime'),
    [approvedRewardPointsHistory]
  );

  const avgRefundTrendPercent = useMemo(() => {
    if (refundSeriesByMonth.length === 0) return 0;
    return refundSeriesByMonth.length > 0 ?
      avgStepTrendPercent(
        refundSeriesByMonth.slice(
          refundSeriesByMonth.length - 12, refundSeriesByMonth.length
        ).map((item) => item.total)
      ) : 0;
  }, [refundSeriesByMonth]);

  const seriesPoints = useMemo(
    () => {
      const quantitySpent = approvedRewardPoints?.reduce((acc, point) => acc + point.totalSpentPoints, 0) || 0;
      const quantityRefunded = approvedRewardPointsHistory?.reduce((acc, point) => acc + point.gainedPoints, 0) || 0;
      const quantityGained = approvedRewardPoints?.reduce((acc, point) => acc + point.totalGainedPoints, 0) || 0;
      const quantityAssigned = approvedRewardPoints?.reduce((acc, point) => acc + point.totalAssignedPoints, 0) || 0;
      const total = quantitySpent + quantityRefunded + quantityGained + quantityAssigned;
      return [
        {
          name: 'spent',
          fullName: 'Spent Reward Points',
          quantity: quantitySpent,
          value: total > 0 ? (quantitySpent / total) * 100 : 0,
        },
        {
          name: 'refunded',
          fullName: 'Refunded Reward Points',
          quantity: quantityRefunded,
          value: total > 0 ? (quantityRefunded / total) * 100 : 0,
        },
        {
          name: 'gained',
          fullName: 'Gained Reward Points',
          quantity: quantityGained,
          value: total > 0 ? (quantityGained / total) * 100 : 0,
        },
        {
          name: 'assigned',
          fullName: 'Assigned Reward Points',
          quantity: quantityAssigned,
          value: total > 0 ? (quantityAssigned / total) * 100 : 0,
        }
      ]
    }, [approvedRewardPoints, approvedRewardPointsHistory]
  );

  const reviews = useMemo(
    () => loadedStoreProducts?.flatMap((product) =>
      (product?.reviews || [])?.map((review) => ({
        ...review,
        name: product.name,
        productId: product.id,
        description: product.description || '',
        attachments: product.attachments || [],
      }))
    ) || [],
    [loadedStoreProducts]
  );

  // TIME CHARTS SERIES

  // console.log('approvedRewardPointsGainedHistory', approvedRewardPointsGainedHistory);

  const loadedSeriesHistory = useMemo(() => {
    const gainedSeries = approvedRewardPointsGainedHistory || [];
    const spentSeries = approvedRewardPointsSpentHistory || [];
    return [...gainedSeries, ...spentSeries];
  }, [approvedRewardPointsGainedHistory, approvedRewardPointsSpentHistory]);

  // console.log('loadedSeriesHistory', loadedSeriesHistory);

  const oldest = useMemo(() => {
    if (!loadedSeriesHistory?.length) return dayjs();
    return loadedSeriesHistory
      .map(r => dayjs(r.createdTime))
      .sort((a, b) => a.valueOf() - b.valueOf())[0];
  }, [loadedSeriesHistory]);

  const series = useMemo(() => {
    const buckets = {
      Weekly: {},
      Monthly: {},
      Yearly: {}
    };

    loadedSeriesHistory?.forEach(rec => {
      const dt = dayjs(rec.createdTime);
      const sold = Number(rec.gainedPoints) || 0;
      const canceled = Number(rec.spentPoints) || 0;

      const daysDiff = dt.diff(oldest, 'day');
      const weekIdx = Math.floor(daysDiff / 7) + 1;
      const startWeek = oldest.add((weekIdx - 1) * 7, 'day').startOf('day');
      const endWeek = startWeek.add(6, 'day').endOf('day');
      const wKey = `${fDate(startWeek)} - ${fDate(endWeek)}`;
      if (!buckets.Weekly[wKey]) buckets.Weekly[wKey] = { sold: 0, canceled: 0 };
      buckets.Weekly[wKey].sold += sold;
      buckets.Weekly[wKey].canceled += canceled;

      const mKey = `${dt.format('MMM/YYYY')}`;
      if (!buckets.Monthly[mKey]) buckets.Monthly[mKey] = { sold: 0, canceled: 0 };
      buckets.Monthly[mKey].sold += sold;
      buckets.Monthly[mKey].canceled += canceled;

      const yKey = `${dt.format('YYYY')}`;
      if (!buckets.Yearly[yKey]) buckets.Yearly[yKey] = { sold: 0, canceled: 0 };
      buckets.Yearly[yKey].sold += sold;
      buckets.Yearly[yKey].canceled += canceled;
    });

    return (['Weekly', 'Monthly', 'Yearly']).map(period => {
      const entries = Object.entries(buckets[period]);

      entries.sort((a, b) => {
        const [keyA] = a;
        const [keyB] = b;
        if (period === 'Weekly') {
          const startA = dayjs(keyA.split(' to ')[0].replace('from ', ''), 'DD/MM/YYYY');
          const startB = dayjs(keyB.split(' to ')[0].replace('from ', ''), 'DD/MM/YYYY');
          return startA.valueOf() - startB.valueOf();
        }
        if (period === 'Monthly') {
          const dateA = dayjs(keyA.slice(6), 'MM/YYYY');
          const dateB = dayjs(keyB.slice(6), 'MM/YYYY');
          return dateA.valueOf() - dateB.valueOf();
        }
        const yearA = parseInt(keyA.split(' ')[1], 10);
        const yearB = parseInt(keyB.split(' ')[1], 10);
        return yearA - yearB;
      });
      const top10 = entries.slice(0, 10);
      return {
        name: period,
        categories: top10.map(([key]) => key),
        data: [
          { name: 'Gained', data: top10.map(([, v]) => v.sold) },
          { name: 'Spent', data: top10.map(([, v]) => v.canceled) }
        ]
      };
    });
  }, [loadedSeriesHistory, oldest]);

  // console.log('series', series);

  return (
    <DashboardContent maxWidth="xl">
      {(!loadedRewardPoints &&
        !loadedStoreProducts &&
        !loadedPendingUsers &&
        !loadedRewardPointsHistory &&
        !loadedRewardPointsGainedHistory &&
        !loadedRewardPointsSpentHistory) ? (
        <Box
          sx={{
            width: 350,
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Loading data for admin dashboard...
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
      ) : (
        <Grid container spacing={3} disableEqualOverflow>
          <Grid xs={12} md={3}>
            <AdminWidgetSummary
              title="Total clients"
              percent={avgUsersTrendPercent}
              total={totalClients}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AdminWidgetSummary
              title="Pending approval clients"
              percent={avgPendingUsersTrendPercent}
              total={totalPendingClients}
              icon={<ServerErrorIllustration />}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AdminWidgetSummary
              title="Spent reward points"
              percent={avgSpentTrendPercent}
              total={totalSpentRewardPoints}
              icon={<CheckInIllustration />}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AdminWidgetSummary
              title="Refunded reward points"
              percent={avgRefundTrendPercent}
              total={totalRefundedRewardPoints}
              icon={<CheckoutIllustration />}
            />
          </Grid>

          <Grid container xs={12}>
            <Grid xs={12} md={7} lg={8}>
              <Box
                sx={{
                  mb: 3,
                  p: { md: 1 },
                  display: 'flex',
                  gap: { xs: 3, md: 1 },
                  borderRadius: { md: 2 },
                  flexDirection: 'column',
                  bgcolor: { md: 'background.neutral' },
                }}
              >
                <Box
                  sx={{
                    p: { md: 1 },
                    display: 'grid',
                    gap: { xs: 3, md: 0 },
                    borderRadius: { md: 2 },
                    bgcolor: { md: 'background.paper' },
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                  }}
                >
                  <AdminTotalIncomes
                    title="Total Invoices Amount"
                    total={invoicesAmount}
                    percent={avgStepTrendPercent(invoicesSeriesByMonth?.map((item) => item.total))}
                    chart={{
                      categories: invoicesSeriesByMonth?.slice(
                        invoicesSeriesByMonth.length - 12, invoicesSeriesByMonth.length
                      )?.map((item) => item.period),
                      series: [{
                        data: invoicesSeriesByMonth?.slice(
                          invoicesSeriesByMonth.length - 12, invoicesSeriesByMonth.length
                        )?.map((item) => item.total)
                      }],
                    }}
                  />

                  <AdminBooked
                    title="Reward Points Overview"
                    data={seriesPoints || []}
                    sx={{ boxShadow: { md: 'none' } }}
                  />
                </Box>

                <AdminCheckInWidgets
                  chart={{
                    series: [
                      {
                        label: 'Spent',
                        percent: (((totalSpentRewardPoints / totalAllPoints) * 100) || 0).toFixed(2),
                        total: totalSpentRewardPoints,
                        color: '#FF6B6B'
                      },
                      {
                        label: 'Gained',
                        percent: (((totalGainedRewardPoints / totalAllPoints) * 100) || 0).toFixed(2),
                        total: totalGainedRewardPoints,
                        color: '#FFB74D'
                      },
                      {
                        label: 'Assigned',
                        percent: (((totalAssignedRewardPoints / totalAllPoints) * 100) || 0).toFixed(2),
                        total: totalAssignedRewardPoints,
                        color: '#4DB6AC'
                      },
                    ],
                  }}
                  sx={{ boxShadow: { md: 'none' } }}
                />
              </Box>

              <AdminStatistics
                title="Statistics (Top 10)"
                chart={{ series }}
              />
            </Grid>

            <Grid xs={12} md={5} lg={4}>
              <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', height: 1 }}>
                <AdminAvailable
                  title="Users available"
                  chart={{
                    series: [
                      { id: 'active_clients', label: 'Active Clients', value: totalApprovedClients },
                      { id: 'pending_clients', label: 'Pending', value: totalPendingClients },
                    ],
                  }}
                  seedAttr='active_clients'
                />

                <AdminCustomerReviews
                  title="Customer reviews"
                  subheader={`${reviews?.length} Reviews`}
                  list={reviews}
                  onDeleteReview={onDeleteReview}
                  openConfirmDeleteReview={confirmDeleteReview.value}
                  onConfirmDeleteReview={confirmDeleteReview.onTrue}
                  onCancelDeleteReview={confirmDeleteReview.onFalse}
                />
              </Box>
            </Grid>
          </Grid>

          {/* <Grid xs={12}>
            <AdminNewest
              title="Newest booking"
              subheader={`${_bookingNew.length} bookings`}
              list={_bookingNew}
            />
          </Grid> */}

          {listRolesAndSubroles(roleName).includes(CONFIG.roles.administrator) && (
            <Grid xs={12}>
              <AdminDetails
                title="Last purchases (Top 5)"
              />
              {/* <PurchaseListView lengthLimit={5} /> */}
            </Grid>
          )}
        </Grid>
      )}
    </DashboardContent>
  );
}


function accumulateByMonth(
  data,
  attribute = null,
  cumulateAttribute = null,
  joinAttribute = null
) {

  const allData = attribute ? data?.flatMap(entry => entry[attribute]) : data;

  const byMonth = allData?.reduce((acc, inv) => {
    const d = dayjs(inv[joinAttribute]);
    const key = `${d.year()}-${String(d.month() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + (cumulateAttribute ? inv[cumulateAttribute] : 1);
    return acc;
  }, {});

  return Object.entries(byMonth)?.map(([period, total]) => ({ period, total }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function avgStepTrendPercent(arr) {
  if (!Array.isArray(arr) || arr.length < 1) return null;
  const first = arr[0];
  const last = arr[arr.length - 1];
  const n = arr.length - 1;
  if (first <= 0) return null;
  const factor = last / first;
  return factor !== 1 ? (factor ** (1 / n) - 1) * 100 : (factor) * 100;
}
