import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Tooltip, IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { StoreProductFolderItemCarousel } from 'src/sections/store-product/store-product-folder-item-carousel';


// ----------------------------------------------------------------------

export function CartItem({
  cart,
  drawer,
  onClickBuy,
  totalAvailablePoints,
  storeProductSelectionCarts,
  refetchStoreProductSelectionCarts,
}) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const router = useRouter();

  const [currentCart, setCurrentCart] = useState(null);

  useEffect(() => {
    if (refetchStoreProductSelectionCarts) {
      refetchStoreProductSelectionCarts();
    }
  }, [refetchStoreProductSelectionCarts]);

  useEffect(() => {
    if (storeProductSelectionCarts) {
      setCurrentCart(
        storeProductSelectionCarts.find(c => c.id === cart?.id)
      );
    }
  }, [cart, storeProductSelectionCarts]);

  const points = useMemo(() => currentCart?.storeProductSelection?.storeProduct?.assignedPoints || 0,
    [currentCart?.storeProductSelection?.storeProduct?.assignedPoints]
  );

  const totalPoints = useMemo(() =>
    points * (currentCart?.storeProductSelection?.quantity || 0),
    [points, currentCart?.storeProductSelection?.quantity]
  );

  const isActiveProduct = useMemo(
    () => currentCart?.storeProductSelection?.storeProduct?.isActive,
    [currentCart?.storeProductSelection?.storeProduct?.isActive]
  );

  const confirmDelete = useBoolean();

  const handleViewDetailsCart = useCallback(
    async () => {
      if (currentCart?.storeProductSelection?.storeProduct) {
        const storeProductId = currentCart?.storeProductSelection?.storeProduct?.id;
        localStorage.setItem('storeProductId', storeProductId);
        router.push(paths.dashboard.storeProduct.details(storeProductId));
      }
    },
    [currentCart?.storeProductSelection?.storeProduct, router]
  );

  const handleDeleteCart = useCallback(async () => {
    if (currentCart?.storeProductSelection && currentCart?.storeProductSelection?.id) {
      try {
        const payload = {
          userReporter: JSON.stringify(userLogged?.data),
        };

        const url = endpoints.rewardPoints.delete.storeProductSelectionCart.item(currentCart?.id);

        const promise = axiosInstanceBackend.delete(url, {
          data: payload
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        toast.promise(promise, {
          loading: 'Loading...',
          success: `Store product removed from cart successfully!`,
          error: `Store product removed from cart error!`,
        });

        await promise;


      } catch (err) {
        console.error('Error adding product to cart:', err);
      }
    }
  }, [userLogged, currentCart]);

  const renderAvatar = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          p: 1,
          mt: 4,
          mr: 2,
          ml: 2,
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.neutral'
        }}
      >
        <StoreProductFolderItemCarousel images={currentCart?.storeProductSelection?.storeProduct?.attachments} />
      </Stack>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, mt: -1 }}>
          {points > 0 && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Label color="success" sx={{ alignItems: 'center' }}>
                <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                {points}
              </Label>
            </Box>
          )}
          {reader(`${cart?.storeProductSelection.storeProduct.name}`)}
        </Box>
      }
      secondary={
        <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled' }}
            divider={
              <Box
                sx={{
                  width: 2,
                  height: 2,
                  bgcolor: 'currentColor',
                  mx: 0.5,
                  borderRadius: '50%',
                }}
              />
            }
          >
            <Box sx={{
              color: 'text.disabled',
              ml: 1,
              display: 'flex',
              flexDirection: 'column',
            }}>

              {totalPoints > totalAvailablePoints ? (
                <Box>
                  <Label color="error" >
                    You need at least {fNumber(totalPoints - totalAvailablePoints)} more points
                  </Label>
                </Box>
              ) : !isActiveProduct && (
                <Box>
                  <Label color="error" >
                    This product is inactive
                  </Label>
                </Box>
              )}
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                Created at {fDateTime(cart?.createdTime)}
              </Typography>
              <Box sx={{
                color: 'text.disabled',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5 }}>
                  Qty: <b>x{currentCart?.storeProductSelection?.quantity}</b>
                </Typography>
                {totalPoints > 0 ? (
                  <Label color="info" sx={{ alignItems: 'center' }}>
                    <Iconify icon="streamline-cyber-color:bookmark-favorite-star" />
                    TOTAL: {totalPoints}
                  </Label>
                ) : (
                  <Label color="error">
                    0
                  </Label>
                )}
              </Box>
            </Box>
            {/* {notification.notification.module} */}
          </Stack>
      }
    />
  );

  const renderUnReadBadge = (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  const projectAction = (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {reader(
          `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`
        )}
      </Box>

      <Button size="small" variant="contained">
        Reply
      </Button>
    </Stack>
  );

  const fileAction = (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <FileThumbnail file="http://localhost:8080/httpsdesign-suriname-2015.mp3" />

      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} flexGrow={1} sx={{ minWidth: 0 }}>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }} noWrap>
              design-suriname-2015.mp3
            </Typography>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.disabled' }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  }}
                />
              }
            >
              <span>2.3 GB</span>
              <span>30 min ago</span>
            </Stack>
          }
        />

        <Button size="small" variant="outlined">
          Download
        </Button>
      </Stack>
    </Stack>
  );

  const tagsAction = (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">
        Design system
      </Label>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Pay
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  const notificationAction = (
    <Stack direction="column" spacing={0} sx={{ mt: 0.2 }}>
      {/* <Label variant="outlined" color='info' sx={{ cursor: 'pointer' }}
      // onClick={() => handleLink(
      //   notification.notification.module, notification.notification.info_id, notification.notification.type
      // )}
      >
        See in Details
      </Label> */}
      <IconButton
        color='success'
        disabled={(totalPoints > totalAvailablePoints || !isActiveProduct)}
        onClick={() => onClickBuy(cart)}
        sx={{
          cursor: (totalPoints > totalAvailablePoints || !isActiveProduct) ? 'not-allowed' : 'pointer',
          '&.Mui-disabled': {
            cursor: 'not-allowed !important',
            pointerEvents: 'auto',
          }
        }}
      >
        <Tooltip
          title={totalPoints > totalAvailablePoints ?
            `You need at least ${fNumber(totalPoints - totalAvailablePoints)} more points to redeem this product` :
            !isActiveProduct ?
              "This product is inactive" :
              "Click to redeem this product"
          }
          arrow
          placement='top'
          sx={{ width: 40, height: 40 }}
        >
          <Iconify
            icon={(totalPoints > totalAvailablePoints || !isActiveProduct) ?
              "streamline-ultimate:e-commerce-touch-buy-bold" :
              "streamline-ultimate-color:e-commerce-touch-buy"
            }
            width={40} height={40}
          />
        </Tooltip>
      </IconButton>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <IconButton onClick={handleViewDetailsCart}>
          <Tooltip title="View details" arrow placement='top' sx={{ width: 25, height: 25 }}>
            <Iconify icon="streamline-freehand-color:view-eye-1" width={25} height={25} />
          </Tooltip>
        </IconButton>
        <IconButton color='error' onClick={confirmDelete.onTrue}>
          <Tooltip title="Delete cart" arrow placement='top' sx={{ width: 20, height: 20 }}>
            <Iconify icon="streamline-freehand-color:delete-bin-2" width={20} height={20} color='error' />
          </Tooltip>
        </IconButton>
      </Box>
    </Stack>
  );

  return (
    <>
      <ListItemButton
        disableRipple
        sx={{
          p: 2.5,
          alignItems: 'flex-start',
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        {/* {paymentAction} */}

        {renderAvatar}

        <Stack sx={{ flexGrow: 1 }} direction="column">
          {renderText}
          {/* {notificationAction} */}
          {/* {notification.type === 'friend' && friendAction}
        {notification.type === 'project' && projectAction}
        {notification.type === 'file' && fileAction}
        {notification.type === 'tags' && tagsAction}
        {notification.type === 'payment' && paymentAction} */}
        </Stack>
        {notificationAction}
      </ListItemButton>
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Delete Cart: ${currentCart?.storeProductSelection?.storeProduct?.name}`}
        content={
          <>
            Are you sure want to delete <strong> {currentCart?.storeProductSelection?.storeProduct?.name} </strong>,
            with quantity <strong> {currentCart?.storeProductSelection?.quantity} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteCart();
              confirmDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        ml: 0,
        mr: 1,
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'body2' },
      }}
    />
  );
}
