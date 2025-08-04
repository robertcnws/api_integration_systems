import { useForm } from 'react-hook-form';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDataContext } from 'src/auth/context/data/data-context';

import { IncrementerButton } from './components/incrementer-button';
import { StoreProductConfirmCheckoutTable } from './store-product-confirm-checkout-table';



// ----------------------------------------------------------------------

export function StoreProductDetailsSummary({
  product,
  totalRatings,
  totalReviews,
  onAddCart,
  onAddBuy,
  // disableActions,
  userLoggedRewardPoints,
  userLoggedRewardPointsLoading,
  userLoggedRewardPointsError,
  refetchUserLoggedRewardPoints,
  ...other
}) {
  const router = useRouter();

  const userLogged = JSON.parse(sessionStorage.getItem('userLogged') || '{}');

  const roleName = userLogged?.data?.user_role?.name || 'client';

  const {
    loadedStoreProducts,
  } = useDataContext();

  const [items, setItems] = useState(loadedStoreProducts || []);

  useEffect(() => {
    if (loadedStoreProducts) {
      setItems(loadedStoreProducts);
    }
  }, [loadedStoreProducts]);

  const confirmBuy = useBoolean(false);

  const confirmCheckout = useBoolean(false);

  const totalAvailablePoints = useMemo(() => {
    if (userLoggedRewardPointsLoading || userLoggedRewardPointsError) {
      return 0;
    }
    return userLoggedRewardPoints?.totalAvailablePoints || 0;
  }, [userLoggedRewardPoints, userLoggedRewardPointsLoading, userLoggedRewardPointsError]);

  const valueInPoints = useMemo(() => product.assignedPoints || 0, [product]);

  const available = roleName === 'client'
    ? Math.floor(totalAvailablePoints / valueInPoints)
    : 100;


  const {
    id,
    name,
    coverUrl = '',
    assignedPoints: price,
    priceSale = 0,
    description: subDescription,
    newLabel = { enabled: false, content: '' },
    saleLabel = { enabled: false, content: '' },
    inventoryType = product?.isActive ? 'in stock' : 'out of stock',
  } = useMemo(() => product || {}, [product]);

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  const isMaxQuantity = useMemo(() => values.quantity > available, [values.quantity, available]);

  const listMappedProducts = useMemo(() => ([
    {
      ...product,
      quantity: values.quantity,
    }
  ]), [product, values]);

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async () => {
    confirmBuy.onTrue();
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.(values.quantity);
      reset()
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values, reset]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {priceSale !== 0 && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
        >
          {fNumber(priceSale)}
        </Box>
      )}

      <Label color="success" sx={{ alignItems: 'center', fontSize: 20 }}>
        <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
        {fNumber(price) || 0}
      </Label>
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={(color) => field.onChange(color)}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  // const renderSizeOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Size
  //     </Typography>

  //     <Field.Select
  //       name="size"
  //       size="small"
  //       helperText={
  //         <Link underline="always" color="textPrimary">
  //           Size chart
  //         </Link>
  //       }
  //       sx={{
  //         maxWidth: 88,
  //         [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' },
  //       }}
  //     >
  //       {sizes.map((size) => (
  //         <MenuItem key={size} value={size}>
  //           {size}
  //         </MenuItem>
  //       ))}
  //     </Field.Select>
  //   </Stack>
  // );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography
          variant="caption"
          component="div"
          sx={{
            textAlign: 'right',
            color: available === 0 ? 'error.main' : 'text.secondary',
          }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || values.quantity < 1}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to cart
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        startIcon={<Iconify icon="mdi:redeem" width={24} />}
        disabled={isMaxQuantity || values.quantity < 1}
      >
        Redeem now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderNeedPoints = (
    <Typography variant="body2" sx={{ color: 'error.main' }}>
      You need <b>{price - totalAvailablePoints}</b> more points to redeem {product?.name}
    </Typography>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ pt: 3 }} {...other}>
          <Stack spacing={2} alignItems="flex-start">
            {renderLabels}

            {renderInventoryType}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 'fontWeightBold',
                  color: 'text.primary',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {product?.name}
              </Typography>
              {!product?.isActive && (
                <Chip label="Inactive" color="error" size="small" />
              )}
            </Box>

            {renderRating}

            {renderPrice}

            {renderSubDescription}
          </Stack>

          {roleName === 'client' && (
            <React.Fragment key="client-quantity">
              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* {renderColorOptions} */}

              {/* {renderSizeOptions} */}

              {product?.isActive && renderQuantity}
            </React.Fragment>
          )}
          {(roleName === 'client' && price > totalAvailablePoints) && (
            <React.Fragment key="client-need-points">
              <Divider sx={{ borderStyle: 'dashed' }} />
              {renderNeedPoints}
            </React.Fragment>
          )}
          {(roleName === 'client' && product?.isActive) && (
            <React.Fragment key="client-actions">
              <Divider sx={{ borderStyle: 'dashed' }} />
              {renderActions}
            </React.Fragment>
          )}
          {/* {renderShare} */}
        </Stack>
      </Form>

      <ConfirmDialog
        open={confirmBuy.value}
        onClose={confirmBuy.onFalse}
        title={`Redeeming Cart: ${product?.name}`}
        content={
          <>
            Are you sure want to redeem <strong> {product?.name} </strong>,
            with quantity <strong> {values.quantity} </strong>
            spending <strong>{fNumber(product.assignedPoints * values.quantity)}</strong> point(s)?
          </>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              confirmBuy.onFalse();
              confirmCheckout.onTrue();
            }}
          >
            Redeem
          </Button>
        }
      />

      <ConfirmDialog
        maxWidth='md'
        open={confirmCheckout.value}
        onClose={confirmCheckout.onFalse}
        // title={`Checking out: ${product?.name}`}
        title={`Proceed to confirm redeemed order of ${listMappedProducts.length} product(s)`}
        content={
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}>
              {/* <Typography>
                You are going to checkout a product <strong> {product?.name} </strong>,
                spending <strong>{fNumber(product.assignedPoints * values.quantity)}</strong> point(s):
              </Typography> */}
              <StoreProductConfirmCheckoutTable
                listMappedProducts={listMappedProducts}
              />
            </Box>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              confirmCheckout.onFalse();
              onAddBuy?.(values.quantity);
              refetchUserLoggedRewardPoints?.();
              reset();
              router.push(paths.dashboard.storeProduct.root);
            }}
          >
            Confirm Redeem
          </Button>
        }
      />

    </>
  );
}
