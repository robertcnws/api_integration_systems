import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { TableContainer } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { varAlpha } from 'src/theme/styles';
import { USER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
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

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'username', label: 'Username' },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'phoneNumber', label: 'Phone number' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'lastLogin', label: 'Last Login' },
  { id: '' },
];

const TABLE_HEAD_MOBILE = [
  { id: 'info', label: 'Users' },
];

// ----------------------------------------------------------------------

export function UserListView() {

  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const table = useTable({ defaultDense: true });

  const router = useRouter();

  const confirm = useBoolean();

  const { 
    loadedUsers, 
    refetchUsers, 
    loadedUserRoles,
  } = useDataContext();

  const [tableData, setTableData] = useState([]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  useEffect(() => {
    if (refetchUsers) {
      refetchUsers();
    }
    setTableData(loadedUsers || []);
  }, [refetchUsers, loadedUsers]);

  useEffect(() => {
    if (loadedUsers) {
      setTableData(loadedUsers);
    }
  }, [loadedUsers]);

  useEffect(() => {
    const socket = new WebSocket(wsEndpoints.users.all);
    // socket.onopen = () => {
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


  const dataFiltered = useMemo(() => applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  }), [tableData, table.order, table.orderBy, filters.state]);

  const dataInPage = useMemo(() => rowInPage(dataFiltered, table.page, table.rowsPerPage), [dataFiltered, table.page, table.rowsPerPage]);

  const canReset = useMemo(() => (
    !!filters.state.name ||
    filters.state.role.length > 0 ||
    filters.state.status !== 'all'
  ), [filters.state]);

  const notFound = useMemo(() => (!dataFiltered.length && canReset) || !dataFiltered.length, [dataFiltered.length, canReset]);

  const handleDeleteRow = useCallback(
    async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      const response = await axiosInstanceBackend.delete(endpoints.user.delete.user(id), {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          userReporter: userLogged?.data,
        },
      });

      if (response.data.message) {
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.error);
      }
    },
    [dataInPage.length, table, tableData, userLogged]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const rows = tableData.filter((row) => !table.selected.includes(row.id));

      const payload = {
        userIds: table.selected.filter((id) => id !== userLogged?.data.id),
        userReporter: userLogged?.data,
      }

      const response = await axiosInstanceBackend.delete(endpoints.user.delete.users, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setTableData(rows);
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        refetchUsers?.();
      }
      else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }

  }, [dataFiltered.length, dataInPage.length, table, tableData, userLogged, refetchUsers]);

  const handleChangeApprovalRow = useCallback(
    async (id) => {

      const response = await axiosInstanceBackend.post(endpoints.user.changeApproval.user(id), {
        userReporter: userLogged?.data,
      });

      if (response.data.message) {
        refetchUsers?.();
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.error);
      }
    },
    [userLogged, refetchUsers]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          // heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.general.analytics },
            { name: 'User', href: paths.dashboard.user.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New user
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
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
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'inactive'].includes(tab.value)
                      ? tableData.filter((user) => tab.value === 'active' ? user.isActive : !user.isActive).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: loadedUserRoles }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.filter((id) => id !== userLogged?.data.id).length}
              rowCount={dataFiltered.filter((row) => row.id !== userLogged?.data.id).length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.filter((row) => row.id !== userLogged?.data.id).map((row) => row.id)
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

            <TableContainer sx={{
              px: { md: 1 },
              minWidth: !isMobile ? 960 : 380,
              maxHeight: filters.state.status === 'all' ? 'calc(100vh - 380px)' : 'calc(100vh - 480px)',
              overflowY: 'auto',
            }} >
              <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onChangeApprovalRow={() => handleChangeApprovalRow(row.id)}
                      />
                    ))}

                  {dataFiltered?.length > 0 && (
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
          </Box>

          {/* <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          /> */}
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.filter((id) => id !== userLogged?.data.id).length} </strong> items?
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
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user?.username?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.firstName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.lastName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.phoneNumber?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.companyName?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    if (status === 'active') {
      inputData = inputData.filter((user) => user?.isActive);
    }
    else {
      inputData = inputData.filter((user) => !user?.isActive);
    }
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user?.userRole?.name));
  }

  return inputData;
}
