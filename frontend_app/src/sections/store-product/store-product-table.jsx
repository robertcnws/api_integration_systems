import { useMemo, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';

import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import {
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';
import { TableCustomPaginationZohoStyleRow } from 'src/components/table/table-pagination-custom-zoho-style-row';

import { LoadingContext } from 'src/auth/context/loading-context';

import { StoreProductTableRow } from './store-product-table-row';

// ----------------------------------------------------------------------

export function StoreProductTable({
  sx,
  table,
  dataFiltered,
  onDeleteRow,
  onViewRow,
  onEditRow,
  onManageActiveRow,
  notFound,
  onOpenConfirm,
  setTableData,
  refetchStoreProducts,
  loadedStoreProducts,
  canReset,
  ...other
}) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const TABLE_HEAD = [
    { id: 'name', label: 'Item' },
    { id: 'assignedPoints', label: 'Value in Points' },
    { id: 'attachments', label: 'Files' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: '', width: 88 },
  ];

  const TABLE_HEAD_MOBILE = [
    { id: 'name', label: 'Item' },
    { id: 'assignedPoints', label: 'Value in Points' },
    { id: 'attachments', label: 'Files' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: '' },
  ];

  useEffect(() => {
    if (refetchStoreProducts) {
      refetchStoreProducts?.()
        .catch((error) => {
          console.error('Error refetching store products:', error);
        });
    }
  }, [refetchStoreProducts]);

  return (
    <Box
        sx={{
          position: 'relative',
          m: (theme) => ({ md: theme.spacing(-2, -3, 0, -3) }),
          ...sx,
        }}
        {...other}
      >
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete" arrow>
                <IconButton color="error" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        />

        <TableContainer sx={{ px: { md: 3 }, overflowY: 'auto' }}>
          <Table
            stickyHeader
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: !isMobile ? !canReset ? 900 : 960 : 0,
              borderCollapse: 'separate',
              borderSpacing: '0 2px',
            }}
          >
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={!isMobile ? TABLE_HEAD : TABLE_HEAD_MOBILE}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={
                listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(CONFIG.roles.superadmin) ?
                  (checked) =>
                    onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    ) : null
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StoreProductTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => onDeleteRow(row.id)}
                    onViewRow={() => onViewRow(row.id)}
                    onEditRow={() => onEditRow(row.id)}
                    onManageActiveRow={() => onManageActiveRow(row.id)}
                    setTableData={setTableData}
                    refetchStoreProducts={refetchStoreProducts}
                    loadedStoreProducts={loadedStoreProducts}
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

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
}
