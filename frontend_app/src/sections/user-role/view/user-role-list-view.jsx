import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { LinearProgress } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

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

import { UserRoleTableRow } from '../user-role-table-row';
import { UserRoleTableToolbar } from '../user-role-table-toolbar';
import { UserRoleTableFiltersResult } from '../user-role-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All User Roles' }].concat([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]);

const headersCSV = [
  { label: 'Name', key: 'name' },
  { label: 'Description', key: 'description' },
]

const getValidTabValue = (options, currentValue) => options.some(
  (tab) => tab.value === currentValue
) ? currentValue : false;

// ----------------------------------------------------------------------

export function UserRoleListView() {

  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { 
    loadedUserRoles, 
    loadingUserRoles, 
    errorUserRoles, 
    refetchUserRoles 
  } = useDataContext();

  const [updating, setUpdating] = useState(false);

  const [titleLinearProgress, setTitleLinearProgress] = useState('Loading roles data...');

  const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
    { id: 'description', label: 'Description' },
    { id: '' },
  ];

  const TABLE_HEAD_MOBILE = [
    { id: 'info', label: 'INFO' },
    { id: '' },
  ];

  const table = useTable({ defaultDense: true });

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const filters = useSetState({ name: '', status: localStorage.getItem('userRoleStatus') || 'all' });

  const collapse = useBoolean(
    filters.state.status === 'active' || filters.state.status === 'inactive'
  );

  const statusValue = getValidTabValue(STATUS_OPTIONS, filters.state.status);


  useEffect(() => {
    localStorage.removeItem('routeByAnalytics');
    localStorage.removeItem('routeByOrder');
    localStorage.removeItem('routeByShipment');
    localStorage.removeItem('routeByShipmentBySku');
    localStorage.removeItem('currentUserRoleId');
  }, []);


  useEffect(() => {
    const page = localStorage.getItem('itemPage');
    if (page) {
      table.setPage(parseInt(page, 10));
    }
    const rowsPerPage = localStorage.getItem('itemRowsPerPage');
    if (rowsPerPage) {
      table.setRowsPerPage(parseInt(rowsPerPage, 10));
    }
  }, [table]);


  useEffect(() => {
    if (refetchUserRoles) {
      refetchUserRoles();
    }
    setTableData(loadedUserRoles || []);
  }, [refetchUserRoles, loadedUserRoles]);

  useEffect(() => {
    if (loadedUserRoles) {
      setTableData(loadedUserRoles);
    }
  }, [loadedUserRoles]);

  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.userRoles.all);
    //   console.log('WebSocket connected');
    // };
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    // socket.onclose = (e) => {
    //   console.log('WebSocket closed', e);
    // };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated') {
        setTableData((prevData) => {
          const existingItemIndex = prevData.findIndex(item => String(item.id) === String(message.item.id));
          if (existingItemIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingItemIndex] = message.item;
            return updatedData;
          }
          return [message.item, ...prevData];
        });
      }
      else if (message.type === 'deleted') {
        setTableData((prevData) => prevData.filter(item => String(item.id) !== String(message.item.id)));
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);


  const dataFiltered = applyFilter({
    inputData: tableData.filter((role) => role.name !== 'superadmin'),
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.delete(endpoints.user.delete.userRole(id), {
          data: {
            userReporter: userLogged?.data,
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
      await axiosInstanceBackend.delete(endpoints.user.delete.userRoles, {
        data: {
          userRoleIds: table.selected,
          userReporter: userLogged?.data,
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
      localStorage.setItem('itemStatus', newValue);
      filters.setState({ status: newValue });
      if (newValue === 'not_synced' || newValue === 'not_assets' ||
        newValue === 'active' || newValue === 'confirmation_pending' ||
        newValue === 'inactive') {
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
      localStorage.removeItem('routeByAnalytics');
      localStorage.removeItem('routeByOrder');
      localStorage.removeItem('routeByShipment');
      localStorage.removeItem('routeByShipmentBySku');
      localStorage.setItem('stageStatus', filters.state.status);
      router.push(paths.dashboard.role.details(id));
    },
    [router, filters]
  );

  if (errorUserRoles) {
    return (
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            <Typography>Error fetching roles: {errorUserRoles.message}</Typography>
          </Alert>
        </Box>
      </DashboardContent>
    );
  }

  if (loadingUserRoles) {
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
        <CustomBreadcrumbs
          // heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.general.analytics },
            { name: 'User Role', href: paths.dashboard.role.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.role.new}
              // color="inherit"
              // variant="outlined"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User Role
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

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
                        (tab.value === 'active' && 'success') ||
                        (tab.value === 'inactive' && 'warning') ||
                        'default'
                      }
                    >
                      {
                        tab.value === 'active' ?
                          tableData.filter((it) => it.isActive).length :
                          tab.value === 'inactive' ?
                            tableData.filter((it) => !it.isActive).length :
                            tableData.length
                      }
                    </Label>
                  }
                />
              ))}
            </Tabs>
            <Box sx={{ display: 'flex', alignItems: 'right' }}>
              <IconButton
                color={collapse.value ? 'inherit' : 'default'}
                onClick={collapse.onToggle}
                sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
              >
                <Iconify icon={collapse.value ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"} />
              </IconButton>
            </Box>
          </Box>

          <UserRoleTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ values: STATUS_OPTIONS.map((option) => option.label) }}
            dataFiltered={dataFiltered}
            headersCSV={headersCSV}
            setUpdating={setUpdating}
            setTitleLinearProgress={setTitleLinearProgress}
            title={filters.state.status === 'all' ? 'All STages' :
              filters.state.status === 'active' ? 'Active Stages' :
                filters.state.status === 'inactive' ? 'Inactive Stages' :
                  filters.state.status
            }
          />

          {canReset && (
            <UserRoleTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
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
                <TableContainer sx={{ maxHeight: filters.state.status !== 'all' ? 500 : 590 }}>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: !isMobile ? 960 : 380 }} stickyHeader>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={!isMobile ? TABLE_HEAD : TABLE_HEAD_MOBILE}
                      rowCount={dataFiltered.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          dataFiltered.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <UserRoleTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onReturnList={() => handleReturnList()}
                            onViewRow={() => handleViewRow(row.id)}
                          />
                        ))}

                      {dataFiltered.length > 0 && (
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

                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableNoData notFound={tableData.length === 0} />
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
            Are you sure want to delete <strong> {table.selected.length} </strong> stages?
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
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    if (status === 'active') {
      inputData = inputData.filter((item) => item.isActive === true);
    } else if (status === 'inactive') {
      inputData = inputData.filter(item => item.isActive === false);
    }
  }
  return inputData;
}
