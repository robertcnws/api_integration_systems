import React, { useContext } from 'react';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

// ----------------------------------------------------------------------

export function PointsSettingsTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow, onReturnList }) {

  const { isMobile } = useContext(LoadingContext);

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1} sx={{ cursor: 'pointer' }}>

        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        {!isMobile ? (
          <>
            <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => onEditRow()}>
              {fCurrency(row?.amount)}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => onEditRow()}>
              <Label color="success" sx={{ alignItems: 'center' }}>
                <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                {fNumber(row?.points) || 0}
              </Label>
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => onEditRow()}>
              {row.description ? row.description : 'No description'}
            </TableCell>

          </>
        ) : (
          <TableCell >
            Amount: <Label
              variant="soft"
              color='default'
              sx={{ cursor: 'pointer' }}
              onClick={() => onEditRow()}
            >
              <u>{fCurrency(row?.amount)}</u>
            </Label><br />
            Points: <Label color="success" sx={{ alignItems: 'center' }}>
              <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
              {fNumber(row?.points) || 0}
            </Label><br />
            Description: <Label
              sx={{ cursor: 'pointer' }}
              variant="soft"
              color='default'
              onClick={() => onEditRow()}
            >
              {row.description ? row.description : 'No description'}
            </Label>
          </TableCell>
        )}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
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
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="ph:pencil-line" />
            Edit Points Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete Points Settings
          </MenuItem>

        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete project stage: (${row.name})?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
