import React, { useMemo, useContext } from 'react';

import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';
import { isClient } from 'src/utils/check-permissions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

import { PurchaseDetailsModal } from './purchase-details-modal';
import { PurchaseUseModalForm } from './purchase-use-modal-form';
import { StoreProductFolderItemCarousel } from '../store-product/store-product-folder-item-carousel';


// ----------------------------------------------------------------------

export function PurchaseTableRow({
  row,
  statusValue,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onRemoveRow,
  onViewRow,
  onReturnList,
  onCancelRefundRow,
}) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  const { isMobile } = useContext(LoadingContext);

  const confirm = useBoolean();

  const confirmRefund = useBoolean();

  const confirmInactive = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const openDetails = useBoolean();

  const openUse = useBoolean();

  const assignedPoints = useMemo(() => row?.storeProductSelection?.storeProduct?.assignedPoints || 0, [row]);

  const quantity = useMemo(() => row?.storeProductSelection?.quantity || 0, [row]);

  const total = useMemo(() => assignedPoints * quantity, [assignedPoints, quantity]);

  const isSetExpired = useMemo(() => !!(row?.expirationTime && statusValue !== 'used'), [row, statusValue]);

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{ 
          cursor: 'pointer',
          bgcolor: isSetExpired ? 'rgba(243, 240, 240, 1)' : 'background.paper', 
        }}
      >

        {(!isClient(roleName) && !row?.hasBeenUsed) && (

          <TableCell padding="checkbox">
            <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}

        {/* { id: 'file', label: 'Product' },
    { id: 'name', label: 'Name' },
    { id: 'assignedPoints', label: 'Points' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'total', label: 'Total' },
    { id: 'status', label: 'Status' },
    { id: 'createdTime', label: 'Created At' },
    { id: 'actions', label: 'Actions', align: 'right' }, */}

        {!isMobile ? (
          <>
            <TableCell sx={{
              whiteSpace: 'nowrap',
              fontStyle: isSetExpired ? 'italic' : 'normal',
            }}>
              <StoreProductFolderItemCarousel
                images={row?.storeProductSelection?.storeProduct?.attachments ?? []}
                maxWidth={50}
                maxHeight={50}
                overflow='hidden'
              />
            </TableCell>

            <TableCell sx={{
              whiteSpace: 'nowrap',
              fontStyle: isSetExpired ? 'italic' : 'normal',
              color: isSetExpired ? 'text.disabled' : 'text.primary',
            }}
              onClick={openDetails.onTrue}>
              {row?.orderNumber || 'N/A'}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Mono, monospace',
                  fontSize: 17,
                  // fontStyle: isSetExpired ? 'italic' : 'normal',
                  color: isSetExpired ? 'text.disabled' : 'text.primary',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}>
                {row?.confirmationNumber || 'N/A'}
              </Typography>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: 15,
                // fontStyle: isSetExpired ? 'italic' : 'normal',
                color: isSetExpired ? 'text.disabled' : 'text.primary',
              }}
              onClick={openDetails.onTrue}>
              {row?.pinNumber || 'N/A'}
            </TableCell>

            <TableCell sx={{
              fontStyle: isSetExpired ? 'italic' : 'normal',
              color: isSetExpired ? 'text.disabled' : 'text.primary',
            }}
              onClick={openDetails.onTrue}
            >
              {row?.storeProductSelection?.storeProduct?.name}
            </TableCell>

            {/* <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
              <Label
                color={row?.storeProductSelection?.storeProduct?.isActive ? 'success' : 'warning'}
              >
                {row?.storeProductSelection?.storeProduct?.isActive ? 'YES' : 'NO'}
              </Label>
            </TableCell> */}

            {!isClient(roleName) && (
              <TableCell sx={{
                whiteSpace: 'nowrap',
                fontStyle: isSetExpired ? 'italic' : 'normal',
                color: isSetExpired ? 'text.disabled' : 'text.primary',
              }} onClick={openDetails.onTrue}>
                {row?.storeProductSelection?.user?.firstName} {row?.storeProductSelection?.user?.lastName}
              </TableCell>
            )}

            <TableCell sx={{
              whiteSpace: 'nowrap',
              fontStyle: isSetExpired ? 'italic' : 'normal',
              color: isSetExpired ? 'text.disabled' : 'text.primary',
            }} onClick={openDetails.onTrue}>
              <Label color={isSetExpired ? "default" : "success"} sx={{ alignItems: 'center', fontSize: 14 }}>
                <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                {fNumber(assignedPoints) || 0}
              </Label>
            </TableCell>

            {/* <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
              x{quantity}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
              <Label color="info" sx={{ alignItems: 'center', fontSize: 14 }}>
                <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                {fNumber(total) || 0}
              </Label>
            </TableCell> */}

            {/* <TableCell onClick={openDetails.onTrue}>
              <Label
                variant="soft"
                color={
                  (row?.hasBeenUsed && row?.quantityUsed === quantity && 'error') ||
                  (row?.hasBeenUsed && row?.quantityUsed !== 0 && row?.quantityUsed < quantity && 'warning') ||
                  (!row?.hasBeenUsed && 'info') ||
                  'default'
                }
                sx={{ cursor: 'pointer' }}
              >
                {
                  (row?.hasBeenUsed && row?.quantityUsed === quantity) ? 'Used!!' :
                    (row?.hasBeenUsed && row?.quantityUsed !== 0 && row?.quantityUsed < quantity) ? 'Partially Used!' :
                      'Not Used'
                }
              </Label>
            </TableCell> */}

            {/* <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
              <b>{row?.quantityUsed ? `x${row?.quantityUsed}` : 0}</b>
            </TableCell> */}

            {/* {isClient(roleName) && (
              <TableCell
                sx={{ whiteSpace: 'nowrap' }}
                onClick={openDetails.onTrue}
              >
                <Label
                  variant="soft"
                  color={
                    (row.hasRequestedRefund && 'secondary') ||
                    (!row.hasRequestedRefund && 'success') ||
                    'default'
                  }
                  sx={{ cursor: 'pointer' }}
                >
                  {row?.hasRequestedRefund ? 'YES!' : 'NO'}
                </Label>
              </TableCell>
            )} */}

            <TableCell sx={{
              whiteSpace: 'nowrap',
              fontStyle: isSetExpired ? 'italic' : 'normal',
              color: isSetExpired ? 'text.disabled' : 'text.primary',
            }} onClick={openDetails.onTrue}>
              {fDateTime(row?.createdTime)}
            </TableCell>

            {statusValue === 'used' ? (
              <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={openDetails.onTrue}>
                {fDateTime(row?.redeemedTime)}
              </TableCell>
            ) : (
              <TableCell sx={{
                whiteSpace: 'nowrap',
                fontStyle: isSetExpired ? 'italic' : 'normal',
                color: isSetExpired ? 'text.disabled' : 'text.primary',
              }} onClick={openDetails.onTrue}>
                {fDateTime(row?.expirationTime) || 'N/A'}
              </TableCell>
            )}

          </>
        ) : (
          <TableCell align="left" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <StoreProductFolderItemCarousel
                images={row?.storeProductSelection?.storeProduct?.attachments ?? []}
                maxWidth={80}
                maxHeight={80}
                overflow='hidden'
              />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }} onClick={openDetails.onTrue}>
                <Typography>Order #: <b>{row.orderNumber}</b></Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  CONFIRMATION #:
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: 'Mono, monospace',
                      fontSize: 17,
                      cursor: 'pointer',
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' }
                    }}>
                    {row?.confirmationNumber || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  PIN #:
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 'bold',
                    }}>
                    {row?.pinNumber || 'N/A'}
                  </Typography>
                </Box>
                <Typography>
                  Product: <b>{row?.storeProductSelection?.storeProduct?.name}</b>
                </Typography>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Is Active?:
                  <Label
                    color={row?.storeProductSelection?.storeProduct?.isActive ? 'success' : 'warning'}
                  >
                    {row?.storeProductSelection?.storeProduct?.isActive ? 'YES' : 'NO'}
                  </Label>
                  Status:
                  <Label
                    variant="soft"
                    color={
                      (row?.hasBeenUsed && row?.quantityUsed === quantity && 'error') ||
                      (row?.hasBeenUsed && row?.quantityUsed !== 0 && row?.quantityUsed < quantity && 'warning') ||
                      (!row?.hasBeenUsed && 'info') ||
                      'default'
                    }
                    sx={{ cursor: 'pointer' }}
                  >
                    {
                      (row?.hasBeenUsed && row?.quantityUsed === quantity) ? 'Used!!' :
                        (row?.hasBeenUsed && row?.quantityUsed !== 0 && row?.quantityUsed < quantity) ? 'Partially Used!' :
                          'Not Used'
                    }
                  </Label>
                </Box> */}
                {!isClient(roleName) && (
                  <Typography>
                    Client: <b>{row?.storeProductSelection?.user?.firstName} {row?.storeProductSelection?.user?.lastName}</b>
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Points:
                  <Label color="success" sx={{ alignItems: 'center', fontSize: 14 }}>
                    <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                    {fNumber(assignedPoints) || 0}
                  </Label>
                  {/* Qty:
                  <Typography><b>x{fNumber(quantity) || 0}</b></Typography>
                  Total:
                  <Label color="info" sx={{ alignItems: 'center', fontSize: 14 }}>
                    <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                    {fNumber(total) || 0}
                  </Label> */}
                </Box>
                {/* <Typography>Qty Used: <b>x{fNumber(row?.quantityUsed) || 0}</b></Typography>
                {isClient(roleName) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Has Refund Request?
                    <Label
                      variant="soft"
                      color={
                        (row.hasRequestedRefund && 'secondary') ||
                        (!row.hasRequestedRefund && 'success') ||
                        'default'
                      }
                      sx={{ cursor: 'pointer' }}
                    >
                      {row?.hasRequestedRefund ? 'YES!' : 'NO'}
                    </Label>
                  </Box>
                )} */}
                <Typography>Created At: <b>{fDateTime(row?.createdTime)}</b></Typography>
                {statusValue === 'used' ? (
                  <Typography>Redeemed At: <b>{fDateTime(row?.redeemedTime)}</b></Typography>
                ) : (
                  <Typography>Expiration At: <b>{fDateTime(row?.expirationTime) || 'N/A'}</b></Typography>
                )}
              </Box>
            </Stack>
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
              openDetails.onTrue();
              popover.onClose();
            }}
          >
            <Iconify
              icon="hugeicons:view"
            />
            View Order Details
          </MenuItem>
          {!row?.hasBeenUsed && (
            <MenuItem
              onClick={() => {
                confirmRefund.onTrue();
                popover.onClose();
              }}
            >
              <Iconify
                icon={
                  row.hasRequestedRefund ? "si:cancel-presentation-fill" : "heroicons-solid:receipt-refund"
                }
              />
              {row.hasRequestedRefund ? 'Cancel Refund Request' : 'Request Refund'}
            </MenuItem>
          )}
          {(roleName !== 'client' && !row.hasRequestedRefund) && [
            <MenuItem
              key="use-purchase"
              onClick={() => {
                // if (row.storeProductSelection?.storeProduct?.isActive) {
                //   openUse.onTrue();
                // } else {
                //   confirmInactive.onTrue();
                // }
                openUse.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="bxs:purchase-tag" />
              Use Order
            </MenuItem>
          ]}
          {(roleName !== 'client' && !row.hasBeenUsed) && [
            <MenuItem
              key='edit-purchase'
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete Order
            </MenuItem>
          ]}
          {(roleName !== 'client' && row.hasBeenUsed) && [
            <MenuItem
              key='edit-purchase'
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="mdi:tag-remove" />
              Remove Order
            </MenuItem>
          ]}


        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmInactive.value}
        onClose={confirmInactive.onFalse}
        title="Warning"
        content={`You can not use product: (${row.storeProductSelection?.storeProduct?.name}) because it is inactive.`}

      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={row.hasBeenUsed ? "Remove" : "Delete"}
        content={`Are you sure want to ${row.hasBeenUsed ? "remove" : "delete"} order: (${row.storeProductSelection?.storeProduct?.name})?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={
              async () => {
                if (row.hasBeenUsed) {
                  await onRemoveRow(row?.id);
                } else {
                  await onDeleteRow(row?.id);
                }
                confirm.onFalse();
              }}>
            {row.hasBeenUsed ? "Remove Order" : "Delete Order"}
          </Button>
        } />

      <ConfirmDialog
        open={confirmRefund.value}
        onClose={confirmRefund.onFalse}
        title={row.hasRequestedRefund ? "Cancel Refund Request" : "Request Refund"}
        content={`Are you sure want to ${row.hasRequestedRefund ? "cancel" : "request"} refund for purchase: (${row.storeProductSelection?.storeProduct?.name})?`}
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              onCancelRefundRow(row?.id);
              confirmRefund.onFalse();
            }}
          >
            {row.hasRequestedRefund ? "Cancel Refund" : "Request Refund"}
          </Button>
        }
      />

      <PurchaseDetailsModal
        currentBuy={row}
        open={openDetails}
        openUse={openUse}
      />

      <PurchaseUseModalForm
        currentBuy={row}
        open={openUse}
      />

    </>
  );
}
