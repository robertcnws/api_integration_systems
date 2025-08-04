import dayjs from 'dayjs';
import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Alert, Typography, LinearProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDate, fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { MotivationIllustration } from 'src/assets/illustrations';

import { EcommerceWelcome } from 'src/sections/overview/e-commerce/ecommerce-welcome';
import { EcommerceRewardPointsAttribute } from 'src/sections/overview/e-commerce/ecommerce-amount-spent';
import { EcommerceInvoicesListItems } from 'src/sections/overview/e-commerce/ecommerce-invoices-list-items';
import { EcommerceRewardPointsHistoryClientList } from 'src/sections/overview/e-commerce/ecommerce-reward-points-history-client-list';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export function PurchaseOverviewClientView({
  client,
  loadedRewardPoints,
  refetchRewardPoints,
  loadingRewardPoints,
  errorRewardPoints,
  loadedRewardPointsHistory,
  refetchRewardPointsHistory,
  loadingRewardPointsHistory,
  errorRewardPointsHistory
}) {

  console.log('loadedRewardPointsHistory', loadedRewardPointsHistory);

  const {
    loadedStoreProducts,
    loadingStoreProducts,
  } = useDataContext();

  const router = useRouter();

  const displayFirstName = useMemo(() => client?.firstName, [client]);
  const displayLastName = useMemo(() => client?.lastName, [client]);

  const theme = useTheme();

  const totalAmountInvoices = useMemo(() => loadedRewardPoints?.totalAmountInvoices || 0, [loadedRewardPoints]);
  const totalGainedPoints = useMemo(() => loadedRewardPoints?.totalGainedPoints || 0, [loadedRewardPoints]);
  const totalAssignedPoints = useMemo(() => loadedRewardPoints?.totalAssignedPoints || 0, [loadedRewardPoints]);
  const totalSpentPoints = useMemo(() => loadedRewardPoints?.totalSpentPoints || 0, [loadedRewardPoints]);
  const totalSubstractedPoints = useMemo(() => loadedRewardPoints?.totalSubstractedPoints || 0, [loadedRewardPoints]);
  const totalAvailablePoints = useMemo(() => loadedRewardPoints?.totalAvailablePoints || 0, [loadedRewardPoints]);

  const sortedInvoices = useMemo(() => {
    const invoices = loadedRewardPoints?.invoices ?? [];
    return [...invoices].sort((a, b) => {
      if (a.date && b.date) return dayjs(b.date).diff(dayjs(a.date));
      if (!a.date && b.date) return 1;
      if (a.date && !b.date) return -1;
      return 0;
    });
  }, [loadedRewardPoints?.invoices]);

  // const listItems = useMemo(() => {
  //   if (!sortedInvoices) return [];
  //   return sortedInvoices.flatMap((invoice) =>
  //     invoice.lineItems?.map((item) => ({
  //       id: item?.id,
  //       name: item?.name,
  //       sku: item?.sku,
  //       quantity: item?.quantity,
  //       rate: item?.rate,
  //       itemTotal: item?.itemTotal,
  //       date: invoice?.date,
  //     })) || []
  //   );
  // }, [sortedInvoices]);

  const seriesFromInvoices = useCallback((attributeName, attributeData, sliceNumber = 10) => {
    const finalList = sliceNumber ? sortedInvoices.slice(0, sliceNumber) : sortedInvoices;
    const series = finalList.map((invoice) => {
      const xData = invoice[attributeName] || '';
      const yData = invoice[attributeData] || 0;
      return {
        name: xData,
        value: yData,
      };
    });
    return series || [];
  }, [sortedInvoices]);

  const seriesFromHistory = useCallback((attributeName, types, attributeData, sliceNumber = 10) => {
    const initialList = loadedRewardPointsHistory || [];
    const sortedList = [...initialList].sort((a, b) => {
      if (a[attributeName] && b[attributeName]) return dayjs(b[attributeName]).diff(dayjs(a[attributeName]));
      if (!a[attributeName] && b[attributeName]) return 1;
      if (a[attributeName] && !b[attributeName]) return -1;
      return 0;
    });
    const finalList = sliceNumber ? sortedList.slice(0, sliceNumber) : sortedList;
    const reverseList = finalList.reverse();
    const series = reverseList?.filter(item => types.includes(item.action))
      .map((item) => {
        const xData = item[attributeName] || '';
        const yData = item[attributeData] || 0;
        return {
          name: xData,
          value: yData,
        };
      });
    return series || [];
  }, [loadedRewardPointsHistory]);

  const avgStepTrendPercent = (arr) => {
    if (!Array.isArray(arr) || arr.length < 2) return null;
    const first = arr[0];
    const last = arr[arr.length - 1];
    const n = arr.length - 1;
    if (first <= 0) return null;
    const factor = last / first;
    return (factor ** (1 / n) - 1) * 100;
  }

  const invoicesDateArray = useMemo(
    () => seriesFromInvoices('date', 'paymentMade').map(item => fDate(item.name)),
    [seriesFromInvoices]
  );

  const invoicesPaymentMadeArray = useMemo(
    () => seriesFromInvoices('date', 'paymentMade').map(item => item.value),
    [seriesFromInvoices]
  );

  const invoicesTrendPercent = useMemo(
    () => avgStepTrendPercent(invoicesPaymentMadeArray),
    [invoicesPaymentMadeArray]
  );

  const currentGainedDateArray = useMemo(
    () => seriesFromHistory('createdTime', ['gained', 'refunded'], 'gainedPoints').map(item => fDateTime(item.name)),
    [seriesFromHistory]
  );
  const currentGainedPointsArray = useMemo(
    () => seriesFromHistory('createdTime', ['gained', 'refunded'], 'gainedPoints').map(item => item.value),
    [seriesFromHistory]
  );
  const currentGainedTrendPercent = useMemo(
    () => avgStepTrendPercent(currentGainedPointsArray),
    [currentGainedPointsArray]
  );


  const currentAssignedDateArray = useMemo(
    () => seriesFromHistory('createdTime', ['assigned'], 'gainedPoints').map(item => fDateTime(item.name)),
    [seriesFromHistory]
  );
  const currentAssignedPointsArray = useMemo(
    () => seriesFromHistory('createdTime', ['assigned'], 'gainedPoints').map(item => item.value),
    [seriesFromHistory]
  );
  const currentAssignedTrendPercent = useMemo(
    () => avgStepTrendPercent(currentAssignedPointsArray),
    [currentAssignedPointsArray]
  );


  const currentSpentDateArray = useMemo(
    () => seriesFromHistory('createdTime', ['spent'], 'spentPoints').map(item => fDateTime(item.name)),
    [seriesFromHistory]
  );
  const currentSpentPointsArray = useMemo(
    () => seriesFromHistory('createdTime', ['spent'], 'spentPoints').map(item => item.value),
    [seriesFromHistory]
  );
  const currentSpentTrendPercent = useMemo(
    () => avgStepTrendPercent(currentSpentPointsArray),
    [currentSpentPointsArray]
  );


  const currentSubstractedDateArray = useMemo(
    () => seriesFromHistory('createdTime', ['substracted'], 'spentPoints').map(item => fDate(item.name)),
    [seriesFromHistory]
  );
  const currentSubstractedPointsArray = useMemo(
    () => seriesFromHistory('createdTime', ['substracted'], 'spentPoints').map(item => item.value),
    [seriesFromHistory]
  );
  const currentSubstractedTrendPercent = useMemo(
    () => avgStepTrendPercent(currentSubstractedPointsArray),
    [currentSubstractedPointsArray]
  );


  return (
    <DashboardContent maxWidth="xl">
      {(!loadedRewardPoints
        || loadingRewardPoints
        || !client
        || !loadedStoreProducts
        || loadingStoreProducts
        || !loadedRewardPointsHistory
        || loadingRewardPointsHistory
      ) ? (
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
            {`Loading reward points (${displayFirstName || ''} ${displayLastName || ''})...`}
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
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <EcommerceWelcome
              title={`Profile: \n ${displayFirstName} ${displayLastName}`}
              isCompound
              description={
                <Box sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: -1,
                  }}>
                    <Typography variant="body2" sx={{ opacity: 0.64, mb: 2 }}>
                      Currently: {' '}
                    </Typography>
                    <Alert severity="success" sx={{ mb: 2, fontSize: '1rem', width: '100%' }}>
                      <strong>
                        {totalAvailablePoints || 0}
                      </strong>{' '}reward points
                    </Alert>
                  </Box>
              }
              img={<MotivationIllustration hideBackground />}
            // action={
            //   <Button
            //     variant="contained"
            //     color="primary"
            //     onClick={() => {
            //       router.push(paths.dashboard.storeProduct.root);
            //     }}
            //   >
            //     Go now
            //   </Button>
            // }
            />
          </Grid>

          {/* <Grid xs={12} md={4}>
            <EcommerceNewrewardStoreProducts list={loadedStoreProducts} />
          </Grid> */}

          <Grid xs={12} md={2.4}>
            <EcommerceRewardPointsAttribute
              title="Spent Amount (USD)"
              icon='noto:money-with-wings'
              percent={invoicesTrendPercent || 0}
              total={totalAmountInvoices}
              bgcolor='info.lighter'
              isMoney
              indicatorName='(10 days)'
              chart={{
                categories: invoicesDateArray,
                series: invoicesPaymentMadeArray,
              }}
            />
          </Grid>

          <Grid xs={12} md={2.4}>
            <EcommerceRewardPointsAttribute
              title="Current Points"
              icon='streamline-stickies-color:star'
              percent={currentGainedTrendPercent || 0}
              total={totalAvailablePoints}
              bgcolor='success.lighter'
              chart={{
                colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
                categories: currentGainedDateArray,
                series: currentGainedPointsArray,
              }}
            />
          </Grid>

          <Grid xs={12} md={2.4}>
            <EcommerceRewardPointsAttribute
              title="Assigned Points"
              icon='fluent-color:reward-24'
              percent={currentAssignedTrendPercent || 0}
              total={totalAssignedPoints}
              bgcolor='secondary.lighter'
              chart={{
                colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
                categories: currentAssignedDateArray,
                series: currentAssignedPointsArray,
              }}
            />
          </Grid>

          <Grid xs={12} md={2.4}>
            <EcommerceRewardPointsAttribute
              title="Spent Points"
              icon='streamline-ultimate-color:warehouse-cart-package-ribbon'
              percent={currentSpentTrendPercent || 0}
              total={totalSpentPoints}
              bgcolor='warning.lighter'
              chart={{
                colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
                categories: currentSpentDateArray,
                series: currentSpentPointsArray,
              }}
            />
          </Grid>

          <Grid xs={12} md={2.4}>
            <EcommerceRewardPointsAttribute
              title="Substracted Points"
              icon='fluent-color:error-circle-16'
              percent={currentSubstractedTrendPercent || 0}
              total={totalSubstractedPoints}
              bgcolor='error.lighter'
              chart={{
                colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
                categories: currentSubstractedDateArray,
                series: currentSubstractedPointsArray,
              }}
            />
          </Grid>

          {/* <Grid xs={12} md={6} lg={4}>
            <EcommerceSaleByGender
              title="Sale by gender"
              total={2324}
              chart={{
                series: [
                  { label: 'Mens', value: 25 },
                  { label: 'Womens', value: 50 },
                  { label: 'Kids', value: 75 },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <EcommerceYearlySales
              title="Yearly sales"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                series: [
                  {
                    name: '2022',
                    data: [
                      {
                        name: 'Total income',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                      },
                      {
                        name: 'Total expenses',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                      },
                    ],
                  },
                  {
                    name: '2023',
                    data: [
                      {
                        name: 'Total income',
                        data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                      },
                      {
                        name: 'Total expenses',
                        data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                      },
                    ],
                  },
                ],
              }}
            />
          </Grid> */}

          {/* <Grid xs={12} md={6} lg={8}>
            <EcommerceSalesOverview title="Sales overview" data={_ecommerceSalesOverview} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance
              title="Current balance"
              earning={25500}
              refunded={1600}
              orderTotal={287650}
              currentBalance={187650}
            />
          </Grid> */}

          <Grid xs={12} md={6} lg={8}>
            <EcommerceInvoicesListItems
              title="Invoices History"
              tableData={sortedInvoices}
              headLabel={[
                { id: 'date', label: 'Date', align: 'left' },
                { id: 'order', label: 'Order' },
                { id: 'totalItems', label: 'Qty of Items', align: 'center' },
                { id: 'paymentMade', label: 'Payment', align: 'right' },
              ]}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            {/* <EcommerceLatestProducts title="Latest products" list={_ecommerceLatestProducts} /> */}
            <EcommerceRewardPointsHistoryClientList
              title='Reward Points History'
              subheader='Latest reward points history'
              loadedRewardPoints={loadedRewardPoints}
              refetchRewardPoints={refetchRewardPoints}
              loadedRewardPointsHistory={loadedRewardPointsHistory}
              refetchRewardPointsHistory={refetchRewardPointsHistory}
              loadingRewardPointsHistory={loadingRewardPointsHistory}
              errorRewardPointsHistory={errorRewardPointsHistory}
            />
          </Grid>
        </Grid>
      )}
    </DashboardContent>
  );
}
