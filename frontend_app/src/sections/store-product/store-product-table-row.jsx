import React, { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';

import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

export function StoreProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  onEditRow,
  onManageActiveRow,
  setTableData,
  refetchStoreProducts,
  loadedStoreProducts,
}) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const theme = useTheme();

  const details = useBoolean();

  const confirm = useBoolean();

  const confirmActivation = useBoolean();

  const popover = usePopover();

  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20
            },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
          bgcolor: 'inherit',
        }}
      >
        {(listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(CONFIG.roles.administrator)) && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected}
              onDoubleClick={() => console.info('ON DOUBLE CLICK')}
              onClick={onSelectRow}
              inputProps={{ id: `row-checkbox-${row?.id}`, 'aria-label': `row-checkbox` }}
            />
          </TableCell>
        )}

        <TableCell
          // onClick={handleClick} 
          onClick={() => {
            localStorage.removeItem('storeProductReminderTab');
            onEditRow();
          }}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 'inherit',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <FileThumbnail file="folder" /> */}

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {row?.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          onClick={() => {
            localStorage.removeItem('storeProductReminderTab');
            onEditRow();
          }}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 'inherit',
          }}
        >
          {row?.assignedPoints > 0 ? (
            <Label color="success" sx={{ alignItems: 'center' }}>
              <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
              {row?.assignedPoints || 0}
            </Label>
          ) : (
            <Label color="error">
              0
            </Label>
          )}
        </TableCell>

        <TableCell
          onClick={() => {
            localStorage.removeItem('storeProductReminderTab');
            onEditRow();
          }}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 'inherit',
          }}
        >
          <Label color="default" sx={{ alignItems: 'center' }}>
            {row?.attachments?.length || 0} file(s)
          </Label>
        </TableCell>

        <TableCell
          onClick={() => {
            localStorage.removeItem('storeProductReminderTab');
            onEditRow();
          }}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 'inherit',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {row?.description || 'No description available'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          onClick={() => {
            localStorage.removeItem('storeProductReminderTab');
            onEditRow();
          }}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 'inherit',
          }}
        >
          <Label color={row?.isActive ? 'success' : 'error'} sx={{ alignItems: 'center' }}>
            {row?.isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', cursor: 'pointer', }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              localStorage.removeItem('itemReminderTab');
              onEditRow();
            }}
          >
            <Iconify icon="flowbite:edit-outline" />
            Edit Store Product
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              localStorage.removeItem('itemReminderTab');
              onViewRow();
            }}
          >
            <Iconify icon="lsicon:view-filled" />
            View Store Product
          </MenuItem>

          {listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(CONFIG.roles.superadmin) ? [
            <Divider key="divider" sx={{ borderStyle: 'dashed' }} />,
            <MenuItem
              key="status"
              onClick={() => {
                confirmActivation.onTrue();
                popover.onClose();
              }}
              sx={{ color: row?.isActive ? 'warning.main' : 'success.main' }}
            >
              <Iconify
                icon={row?.isActive ? 'material-symbols:tab-close-inactive' : 'nrk:check-active'}
              />
              {row?.isActive ? 'Deactivate' : 'Activate'} Store Product
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete Store Product
            </MenuItem>
          ] : null}
        </MenuList>
      </CustomPopover >

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Project"
        content={`Are you sure want to delete store product ${row?.name}?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => { 
              await onDeleteRow(row?.id);
              confirm.onFalse(); 
            }}
          >
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmActivation.value}
        onClose={confirmActivation.onFalse}
        title={row?.isActive ? 'Deactivate Store Product' : 'Activate Store Product'}
        content={`Are you sure want to ${row?.isActive ? 'deactivate' : 'activate'} store product ${row?.name}?`}
        action={
          <Button
            variant="contained"
            color={row?.isActive ? 'warning' : 'success'}
            onClick={async () => { 
              await onManageActiveRow(row?.id) 
              confirmActivation.onFalse();
            }}
          >
            {row?.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        }
      />
    </>
  );
}
