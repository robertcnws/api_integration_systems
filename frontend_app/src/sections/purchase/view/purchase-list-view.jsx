import dayjs from 'dayjs';
import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { TextField, Autocomplete, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { isClient } from 'src/utils/check-permissions';
import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { useRewardStoreProductSelectionBuyByUsername } from 'src/_mock/__reward-store-product-selection-buys';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableCustomPaginationZohoStyleRow } from 'src/components/table/table-pagination-custom-zoho-style-row';
import {
  useTable,
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';
import { fieldsRewardStoreProductSelectionBuys } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-store-product-selection';

import { PurchaseTableRow } from '../purchase-table-row';
import { PurchaseTableToolbar } from '../purchase-table-toolbar';
import { PurchaseTableFiltersResult } from '../purchase-table-filters-result';

// ----------------------------------------------------------------------

const headersCSV = [
  { label: 'Name', key: 'name' },
  { label: 'Description', key: 'description' },
]

const getValidTabValue = (options, currentValue) => options.some(
  (tab) => tab.value === currentValue
) ? currentValue : false;

// ----------------------------------------------------------------------

export function PurchaseListView({ lengthLimit = null, order = 'asc' }) {

  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  const STATUS_OPTIONS = [].concat([
    { value: 'not_used', label: 'Not Used Rewards' },
    // { value: 'partially_used', label: 'PARTIALLY USED PURCHASES!' },
    { value: 'used', label: 'USED REWARDS!' },
    // ...!isClient(roleName) ? [
    //   { value: 'hasRequestedRefund', label: 'Refund Requested?' },
    // ] : []
    { value: 'hasRequestedRefund', label: 'Refund Requested?' },
  ]);

  const rewardHook = useRewardStoreProductSelectionBuyByUsername(
    userLogged?.data?.username,
    fieldsRewardStoreProductSelectionBuys
  );
  const dataContextHook = useDataContext();

  const {
    data: clientData,
    loading: clientLoading,
    error: clientError,
    refetch: clientRefetch
  } = rewardHook;

  const {
    loadedStoreProductSelectionBuys: otherData,
    loadingStoreProductSelectionBuys: otherLoading,
    errorStoreProductSelectionBuys: otherError,
    refetchStoreProductSelectionBuys: otherRefetch,
    loadedUsers,
  } = dataContextHook;

  const loadedPurchases = roleName === 'client' ? clientData : otherData;
  const loadingPurchases = roleName === 'client' ? clientLoading : otherLoading;
  const errorPurchases = roleName === 'client' ? clientError : otherError;
  const refetchPurchases = roleName === 'client' ? clientRefetch : otherRefetch;

  const [updating, setUpdating] = useState(false);

  const [titleLinearProgress, setTitleLinearProgress] = useState('Loading purchases data...');

  const filters = useSetState({
    name: '',
    status: 'not_used',
    client: {
      id: '',
      name: ''
    }
  });

  const statusValue = getValidTabValue(STATUS_OPTIONS, filters.state.status) || 'not_used';

  const TABLE_HEAD = [
    { id: 'file', label: 'Product' },
    { id: 'orderNumber', label: 'Order' },
    { id: 'confirmationNumber', label: 'Confirmation #' },
    { id: 'pinNumber', label: 'PIN #' },
    { id: 'name', label: 'Name' },
    ...!isClient(roleName) ? [
      { id: 'client', label: 'Client' },
    ] : [],
    { id: 'assignedPoints', label: 'Points' },
    { id: 'createdTime', label: 'Created At' },
    ...statusValue === 'used' ? [
      { id: 'redeemedTime', label: 'Redeemed At' },
    ] : [
      { id: 'expirationTime', label: 'Expiration At' },
    ],
    { id: '' },
  ];

  const TABLE_HEAD_MOBILE = [
    { id: 'info', label: 'INFO' },
    { id: '' },
  ];

  const table = useTable({
    defaultDense: true,
    defaultOrderBy: statusValue !== 'not_used' ? 'createdTime' : 'redeemedTime',
    defaultOrder: 'desc'
  });

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const collapse = useBoolean();

  useEffect(() => {
    const page = localStorage.getItem('purchasePage');
    if (page) {
      table.setPage(parseInt(page, 10));
    }
    const rowsPerPage = localStorage.getItem('purchaseRowsPerPage');
    if (rowsPerPage) {
      table.setRowsPerPage(parseInt(rowsPerPage, 10));
    }
  }, [table]);

  useEffect(() => {
    if (loadedPurchases && loadedPurchases?.length > 0) {
      if (lengthLimit && loadedPurchases.length > lengthLimit) {
        const sortedPurchases = [...loadedPurchases]
          .filter((purchase) => !purchase.isRemoved)
          .sort(
            (a, b) => dayjs(b.createdTime).valueOf() - dayjs(a.createdTime).valueOf()
          );
        setTableData(sortedPurchases.slice(0, lengthLimit));
      }
      else {
        setTableData(loadedPurchases);
      }
    }
  }, [loadedPurchases, lengthLimit]);

  useEffect(() => {
    const url = !isClient(roleName) ?
      wsEndpoints.rewardPoints.storeProductSelectionBuy.all :
      wsEndpoints.rewardPoints.storeProductSelectionBuy.byUsername(userLogged?.data?.username);
    const socket = new WebSocket(url);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // console.log('message', message);

      // setTableData((prev) => {
      //   switch (message.type) {
      //     case 'created':
      //       return [message.item, ...prev];

      //     case 'updated':
      //       return prev.map((row) =>
      //         row.id === message.item.id ? message.item : row
      //       );

      //     case 'deleted':
      //       return prev.filter((row) => row.id !== message.item.id);

      //     default:
      //       return prev;
      //   }
      // });
      refetchPurchases?.().catch(console.error);
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userLogged?.data?.username, roleName, refetchPurchases, loadedPurchases]);


  const dataFiltered = applyFilter({
    inputData: lengthLimit ? tableData.slice(0, lengthLimit) : tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'not_used' ||
    !!filters.state.client.id ||
    !!filters.state.client.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const someRowsUsed = useMemo(
    () => dataFiltered.some((row) => row.hasBeenUsed),
    [dataFiltered]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.delete(endpoints.rewardPoints.delete.storeProductSelectionBuy.item(id), {
          data: {
            userReporter: JSON.stringify(userLogged?.data),
          }
        });
        const updatedRows = tableData.filter((row) => row.id !== id);
        setTableData(updatedRows);
        table.onUpdatePageDeleteRow(dataInPage.length);
        toast.success('Delete success!');
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    },
    [dataInPage.length, table, tableData, userLogged?.data]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await axiosInstanceBackend.delete(endpoints.rewardPoints.delete.storeProductSelectionBuy.list, {
        data: {
          ids: table.selected,
          userReporter: JSON.stringify(userLogged?.data),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const updatedRows = tableData.filter((row) => !table.selected.includes(row.id));
      setTableData(updatedRows);
      table.onUpdatePageDeleteRows({
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
      toast.success('Delete success!');
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData, userLogged?.data]);


  const handleRemoveRow = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.post(endpoints.rewardPoints.manageRemove.storeProductSelectionBuy.item(id), {
          userReporter: JSON.stringify(userLogged?.data),
        });
        const updatedRows = tableData.filter((row) => row.id !== id);
        setTableData(updatedRows);
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        toast.success('Remove success!');
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    },
    [userLogged?.data, table, tableData, dataInPage.length, dataFiltered.length]
  );


  const handleCancelRefundRow = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.post(endpoints.rewardPoints.manageRefund.storeProductSelectionBuy.item(id), {
          userReporter: JSON.stringify(userLogged?.data),
        });
        toast.success('Manage refund success!');
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    },
    [userLogged?.data]
  );

  const handleEditRow = useCallback(
    (id) => {
      localStorage.setItem('currentUserRoleId', id);
      router.push(paths.dashboard.role.edit(id));
    },
    [router]
  );

  const handleReturnList = useCallback(
    () => {
      router.push(paths.dashboard.role.list);
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      localStorage.setItem('purchaseStatus', newValue);
      filters.setState({ status: newValue });
      if (newValue === 'used' || newValue === 'not_used') {
        collapse.onTrue();
      }
      else {
        collapse.onFalse();
      }
    },
    [filters, table, collapse]
  );

  const handleViewRow = useCallback(
    (id) => {
      localStorage.setItem('purchaseStatus', filters.state.status);
      router.push(paths.dashboard.role.details(id));
    },
    [router, filters]
  );

  const openClientFilter = useBoolean()

  // const handleFilterClient = useCallback(
  //   (event) => {
  //     const client = event.target.value;
  //     console.log('client', client);
  //     const clientName = `${client.firstName} ${client.lastName}` || null;
  //     filters.setState({ client: { id: client.id, name: clientName } });
  //     localStorage.setItem('purchaseFilterClient', JSON.stringify({ id: client.id, name: clientName }));
  //     setTableData(dataFiltered.filter((item) => item.storeProductSelection.user.id === client.id))
  //     table.onResetPage();
  //   },
  //   [filters, table, dataFiltered]
  // );

  const renderFilterClient = (
    <>
      <Button
        color="inherit"
        onClick={openClientFilter.onTrue}
        endIcon={
          <Iconify
            icon={openClientFilter.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {!!filters.state.client.id && !!filters.state.client.name
          ? `Client: ${filters.state.client.name}`
          : 'Select Client'}
      </Button>

      <ConfirmDialog
        open={openClientFilter.value}
        onClose={openClientFilter.onFalse}
        title="Select Client"
        content={
          <Autocomplete
            disablePortal={false}
            PopperProps={{ container: document.body }}
            options={loadedUsers.filter((user) => isClient(user.userRole.name))}
            value={filters.state.client.id ? loadedUsers.find((user) => user.id === filters.state.client.id) : null}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.username})`}
            onChange={(_, value) => {
              if (value) {
                const clientName = `${value.firstName} ${value.lastName}` || '';
                filters.setState({ client: { id: value.id, name: clientName } });
                localStorage.setItem('purchaseFilterClient', JSON.stringify({ id: value.id, name: clientName }));
              } else {
                filters.setState({ client: { id: '', name: '' } });
                localStorage.removeItem('purchaseFilterClient');
              }
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
            sx={{
              width: '100%'
            }}
          />
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              // onCloseClientFilter();
              filters.setState({ client: { id: '', name: '' } });
              localStorage.removeItem('purchaseFilterClient');
            }}
            color='warning'
          >
            Clear
          </Button>
        }
      />
    </>
  );

  if (errorPurchases) {
    return (
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            <Typography>Error fetching purchases: {errorPurchases.message}</Typography>
          </Alert>
        </Box>
      </DashboardContent>
    );
  }

  if (loadingPurchases) {
    return (
      <DashboardContent>
        <Box
          sx={{
            width: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            margin: 'auto'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {titleLinearProgress}
          </Typography>
          <LinearProgress
            key="error"
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'black',
              },
              backgroundColor: '#e0e0e0',
            }}
          />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <DashboardContent>
        {!lengthLimit && (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <CustomBreadcrumbs
              // heading="List"
              links={[
                { name: 'Dashboard', href: paths.dashboard.general.analytics },
                { name: 'Reward Orders', href: paths.dashboard.purchase.root },
                { name: 'List' },
              ]}
              sx={{ mb: { xs: 3, md: 5 } }}
            // action={
            //   !isClient(roleName) ? renderFilterClient : null
            // }

            />
            {!isClient(roleName) && renderFilterClient}
          </Box>
        )}

        <Card>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Tabs
              value={statusValue}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                // boxShadow: (theme) =>
                //   `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                width: '97%',
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'used' && 'error') ||
                        (tab.value === 'partially_used' && 'warning') ||
                        (tab.value === 'not_used' && 'info') ||
                        (tab.value === 'hasRequestedRefund' && 'secondary') ||
                        'default'
                      }
                    >
                      {
                        tab.value === 'used' ?
                          tableData.filter(
                            (it) => it.hasBeenUsed &&
                              !it.hasRequestedRefund &&
                              it.quantityUsed === it.storeProductSelection.quantity
                          ).length :
                          tab.value === 'partially_used' ?
                            tableData.filter(
                              (it) => it.hasBeenUsed &&
                                !it.hasRequestedRefund &&
                                it.quantityUsed !== 0 &&
                                it.quantityUsed < it.storeProductSelection.quantity
                            ).length :
                            tab.value === 'not_used' ?
                              tableData.filter((it) => !it.hasBeenUsed && !it.hasRequestedRefund).length :
                              tab.value === 'hasRequestedRefund' ?
                                tableData.filter((it) => it.hasRequestedRefund).length :
                                tableData.length
                      }
                    </Label>
                  }
                />
              ))}
            </Tabs>
            {/* <Box sx={{ display: 'flex', alignItems: 'right' }}>
              <IconButton
                color={collapse.value ? 'inherit' : 'default'}
                onClick={collapse.onToggle}
                sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
              >
                <Iconify icon={collapse.value ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"} />
              </IconButton>
            </Box> */}
          </Box>

          {!lengthLimit && (
            <>
              <PurchaseTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                options={{ values: STATUS_OPTIONS.map((option) => option.label) }}
                dataFiltered={dataFiltered}
                headersCSV={headersCSV}
                setUpdating={setUpdating}
                setTitleLinearProgress={setTitleLinearProgress}
                title={filters.state.status === 'all' ? 'All Purchases' :
                  filters.state.status === 'used' ? 'Used Purchases' :
                    filters.state.status === 'not_used' ? 'Not Used Purchases' :
                      filters.state.status === 'hasRequestedRefund' ? 'Refund Requested Purchases' :
                        filters.state.status
                }
              />
              {canReset && (
                <PurchaseTableFiltersResult
                  filters={filters}
                  totalResults={dataFiltered.length}
                  onResetPage={table.onResetPage}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )}
            </>

          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={
                (!isClient(roleName) && !someRowsUsed) ? ((checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )) : null
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Scrollbar>
              {tableData && tableData.length > 0 ? (
                <TableContainer sx={{
                  maxHeight: !isMobile && !lengthLimit ? (filters.state.status !== 'not_used' ? 500 : 590) : '100%',
                  minHeight: !isMobile && !lengthLimit ? (filters.state.status !== 'not_used' ? 500 : 590) : '100%',
                }}>
                  <Table
                    size={table.dense ? 'small' : 'medium'}
                    sx={{ minWidth: !isMobile ? 960 : 380 }}
                    stickyHeader
                  >
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={!isMobile ? TABLE_HEAD : TABLE_HEAD_MOBILE}
                      rowCount={dataFiltered.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={
                        (!isClient(roleName) && !someRowsUsed) ? (checked) =>
                          table.onSelectAllRows(
                            checked,
                            dataFiltered.map((row) => row.id)
                          ) : null
                      }
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <PurchaseTableRow
                            key={row.id}
                            row={row}
                            statusValue={statusValue}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onRemoveRow={() => handleRemoveRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onReturnList={() => handleReturnList()}
                            onViewRow={() => handleViewRow(row.id)}
                            onCancelRefundRow={() => handleCancelRefundRow(row.id)}
                          />
                        ))}

                      {(dataFiltered.length > 0 && !lengthLimit) && (
                        <TableCustomPaginationZohoStyleRow
                          columnsLength={isMobile ? TABLE_HEAD_MOBILE.length : TABLE_HEAD.length}
                          data={dataFiltered}
                          page={table.page}
                          rowsPerPage={table.rowsPerPage}
                          handleChangePage={(event, newPage) => {
                            localStorage.setItem('itemPage', newPage);
                            table.onChangePage(event, newPage);
                          }}
                          handleChangeRowsPerPage={(event) => {
                            localStorage.setItem('itemRowsPerPage', event.target.value);
                            table.onChangeRowsPerPage(event);
                          }}
                          dense={table.dense}
                          onChangeDense={table.onChangeDense}
                        />
                      )}

                      <TableNoData notFound={notFound} colSpan={20} />
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableNoData notFound={tableData.length === 0} colSpan={20} />
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Scrollbar>
          </Box>
        </Card>
      </DashboardContent >

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> purchases and refund points?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, client } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item?.storeProductSelection?.storeProduct?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.quantity?.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.storeProduct?.description?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.storeProduct?.assignedPoints?.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.user?.username?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.user?.firstName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.storeProductSelection?.user?.lastName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.confirmationNumber?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.orderNumber?.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (client.id) {
    inputData = inputData.filter(
      (item) => item.storeProductSelection.user.id === client.id
    );
  }

  if (status !== 'all') {
    if (status === 'used') {
      inputData = inputData.filter(
        (item) => item.hasBeenUsed === true &&
          item.hasRequestedRefund === false &&
          item.quantityUsed === item.storeProductSelection.quantity
      );
    } else if (status === 'partially_used') {
      inputData = inputData.filter(
        item => item.hasBeenUsed === true &&
          item.hasRequestedRefund === false &&
          item.quantityUsed !== 0 &&
          item.quantityUsed < item.storeProductSelection.quantity
      );
    } else if (status === 'not_used') {
      inputData = inputData.filter(
        item => item.hasBeenUsed === false &&
          item.hasRequestedRefund === false
      );
    } else if (status === 'hasRequestedRefund') {
      inputData = inputData.filter(item => item.hasRequestedRefund === true);
    }
  }
  return inputData;
}
