import { useContext } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Typography, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

import { UserQuickEditForm } from './user-quick-edit-form';
import { UserQuickChangePasswordForm } from './user-quick-change-password';



// ----------------------------------------------------------------------

export function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onChangeApprovalRow
}) {

  const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

  const { isMobile } = useContext(LoadingContext)

  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  const quickChangePassword = useBoolean();

  const confirmApproval = useBoolean();

  return (
    <>
      {!isMobile ? (
        <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
          <TableCell padding="checkbox">
            {userLogged?.data.id !== row.id && (
              <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
            )}
          </TableCell>

          <TableCell sx={{ cursor: 'pointer' }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.username} src={row.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                  {row.username}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.email}
                </Box>
              </Stack>
            </Stack>
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>{row.firstName}</TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>{row.lastName}</TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>{row.phoneNumber}</TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>{row.userRole.name}</TableCell>

          <TableCell sx={{ cursor: 'pointer' }} onClick={quickEdit.onTrue}>
            <Label
              variant="soft"
              color={
                (row.isActive && 'success') ||
                (!row.isActive && 'error') ||
                'default'
              }
            >
              {row.isActive ? 'Active' : 'Inactive'}
            </Label>
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>{fDateTime(row.lastLogin)}</TableCell>

          <TableCell align="right">
            <Stack direction="row" alignItems="right" sx={{ justifyContent: 'flex-end' }}>
              {userLogged?.data.username !== row.username && (
                <Tooltip title="Disapprove" placement="top" arrow>
                  <IconButton
                    color={confirmApproval.value ? 'inherit' : 'default'}
                    onClick={confirmApproval.onTrue}
                  >
                    <Iconify icon="material-symbols:disabled-by-default-rounded" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Change Password" placement="top" arrow>
                <IconButton
                  color={quickChangePassword.value ? 'inherit' : 'default'}
                  onClick={quickChangePassword.onTrue}
                >
                  <Iconify icon="mdi:password-reset" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Quick Edit" placement="top" arrow>
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'default'}
                  onClick={quickEdit.onTrue}
                >
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>

              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
          <TableCell padding="checkbox">
            <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
          </TableCell>

          <TableCell sx={{ cursor: 'pointer' }}>
            <Stack spacing={0} direction="column" alignItems="left">
              <Stack spacing={1} direction="row" alignItems="left">
                <Avatar alt={row.username} src={row.avatarUrl} />

                <Stack sx={{ typography: 'body2', flex: '0 0 auto', alignItems: 'flex-start' }}>
                  <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                    {row.username}
                  </Link>
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    {row.email}
                  </Box>
                </Stack>
              </Stack>
              <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0} direction="column" alignItems="left">
                  <Typography variant='body2'>
                    Company: <b>{row.companyName}</b>
                  </Typography>
                  <Typography variant='body2'>
                    Name: <b>{row.firstName} {row.lastName}</b>
                  </Typography>
                  <Typography variant='body2'>
                    Phone: <b>{row.phoneNumber}</b>
                  </Typography>
                  <Typography variant='body2'>
                    Role: <b>{row.userRole.name}</b>
                  </Typography>
                  <Typography variant='body2'>
                    Status: <Label
                      variant="soft"
                      color={
                        (row.isActive && 'success') ||
                        (!row.isActive && 'error') ||
                        'default'
                      }
                    >
                      {row.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </Typography>
                  <Typography variant='body2'>
                    Last Login: <b>{fDateTime(row.lastLogin)}</b>
                  </Typography>
                  <Typography variant='body2'>
                    Created: <b>{fDateTime(row.createdTime)}</b>
                  </Typography>
                </Stack>
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>
            </Stack>
          </TableCell>
        </TableRow>
      )}

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <UserQuickChangePasswordForm currentUser={row} open={quickChangePassword.value} onClose={quickChangePassword.onFalse} />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {userLogged?.data.username !== row.username && (
            <MenuItem
              onClick={() => {
                confirmApproval.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="material-symbols:disabled-by-default-rounded" />
              Disapprove
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              quickEdit.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              quickChangePassword.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:password-reset" />
            Change password
          </MenuItem>
          {userLogged?.data.username !== row.username && (
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}

        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        maxWidth='md'
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete User"
        content={
          <ListItemText
            primary={`Do you want to delete this user (${row.firstName} ${row.lastName}, username: ${row.username}) ?`}
            secondary="Once you delete this user, you can't recover it."
          />
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        maxWidth='md'
        open={confirmApproval.value}
        onClose={confirmApproval.onFalse}
        title="Disapprove User"
        content={
          <ListItemText
            primary={`Do you want to disapprove this user (${row.firstName} ${row.lastName}, username: ${row.username}) ?`}
            secondary={`Company: ${row.companyName}, Email: ${row.email}`}
          />
        }
        action={
          <Button variant="contained" color="warning" onClick={onChangeApprovalRow}>
            Disapprove
          </Button>
        }
      />
    </>
  );
}
