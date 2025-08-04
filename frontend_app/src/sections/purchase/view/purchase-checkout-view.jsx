import { useMemo, useState, useContext, useCallback } from 'react';

import { Box, Button, TextField, Typography, FormHelperText, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';

import { PurchaseDetailsModal } from '../purchase-details-modal';
import { PurchaseUseModalForm } from '../purchase-use-modal-form';

// ----------------------------------------------------------------------

const headersCSV = [
  { label: 'Name', key: 'name' },
  { label: 'Description', key: 'description' },
]

const getValidTabValue = (options, currentValue) => options.some(
  (tab) => tab.value === currentValue
) ? currentValue : false;

// ----------------------------------------------------------------------

export function PurchaseCheckoutView() {

  const {
    loadedStoreProductSelectionBuys: loadedPurchases,
    loadingStoreProductSelectionBuys: loadingPurchases,
    errorStoreProductSelectionBuys: errorPurchases,
    refetchStoreProductSelectionBuys: refetchPurchases,
    loadedUsers,
    refetchUsers,
  } = useDataContext();

  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  const [filters, setFilters] = useState({
    confirmationNumber: '',
    pinNumber: '',
  });

  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleFilterText = useCallback(
    (event, property) => {
      setFilters((prev) => ({ ...prev, [property]: event.target.value }));
    },
    [setFilters]
  );

  const validConfirmationNumber = (value) => value.length === 15 && /^[0-9A-Z]+$/.test(value);

  const validPinNumber = (value) => value.length === 4 && /^[0-9]+$/.test(value);

  const confirmError = filters.confirmationNumber !== '' && !validConfirmationNumber(filters.confirmationNumber);

  const pinError = filters.pinNumber !== '' && !validPinNumber(filters.pinNumber);

  const openPurchaseInfo = useBoolean();

  const openUsePurchase = useBoolean();

  const handleFindOrder = useCallback(
    () => {
      refetchPurchases?.().catch((error) => {
        console.error('Error fetching purchases:', error);
        toast.error('Failed to fetch purchases. Please try again later.');
      });
      if (validConfirmationNumber(filters.confirmationNumber) && validPinNumber(filters.pinNumber)) {
        const purchase = loadedPurchases.find(
          (p) =>
            p.confirmationNumber === filters.confirmationNumber &&
            p.pinNumber === filters.pinNumber
        );

        if (purchase) {
          setSelectedPurchase(purchase);
          // toast.success('Order found successfully!'); 
          setFilters({ confirmationNumber: '', pinNumber: '' });
          filters.pinNufiltersmber = '';
          openPurchaseInfo.onTrue();
        } else {
          toast.error('No order found with the provided CONFIRMATION CODE and PIN NUMBER.');
        }
      }
    },
    [filters, loadedPurchases, refetchPurchases, openPurchaseInfo, setFilters]
  );

  return (
    <>
      <DashboardContent sx={{
        alignItems: 'center',
        justifyContent: 'center',
        mt: { xs: -15, md: 0 },
      }}>
        <Box
          sx={{
            width: { xs: '100%', md: 0.4 },
            p: { md: 1 },
            display: 'flex',
            gap: { xs: 1, md: 1 },
            borderRadius: { md: 1 },
            flexDirection: 'column',
            bgcolor: 'background.neutral',
          }}
        >
          <Box
            sx={{
              p: { md: 3 },
              display: 'column',
              gap: { xs: 2, md: 2 },
              borderRadius: { md: 2 },
              bgcolor: 'background.paper',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
              <Iconify
                icon="ic:twotone-shopping-cart-checkout"
                sx={{ width: 24, height: 24, mr: 1, verticalAlign: 'middle' }}
              />
              Redeemed Order Checkout
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ fontWeight: 'bold' }}>Enter CONFIRMATION CODE:</Box>
              <Box sx={{ mb: 2, gap: 0 }}>
                <TextField
                  fullWidth
                  value={filters.confirmationNumber}
                  onChange={e => {
                    const upper = e.target.value.toUpperCase();
                    handleFilterText({ target: { value: upper } }, 'confirmationNumber');
                  }}
                  onFocus={(e) => e.target.select()}
                  placeholder="CONFIRMATION CODE"
                  error={confirmError}
                  inputProps={{
                    maxLength: 15,
                    style: {
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      letterSpacing: !isMobile ? '0.3em' : '0.15em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon="eva:search-fill"
                          // aquí cambiamos el color dinámicamente:
                          sx={{
                            color: confirmError
                              ? 'error.main'
                              : 'text.disabled',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    maxWidth: { xs: '100%', md: 400 },
                    minWidth: { xs: '100%', md: 400 },
                  }}
                />
                {confirmError && (
                  <FormHelperText error>
                    Must be 15 characters and contain only uppercase letters and numbers.
                  </FormHelperText>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ fontWeight: 'bold' }}>Enter PIN #:</Box>
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  value={filters.pinNumber}
                  onChange={(e) => handleFilterText(e, 'pinNumber')}
                  onFocus={(e) => e.target.select()}
                  placeholder="PIN #"
                  error={pinError}
                  inputProps={{
                    maxLength: 4,
                    style: {
                      fontFamily: 'monospace',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.4em',
                      textAlign: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon="eva:search-fill"
                          sx={{
                            color: pinError
                              ? 'error.main'
                              : 'text.disabled'
                          }}
                        />
                      </InputAdornment>
                    ),
                  }} sx={{
                    maxWidth: { xs: '100%', md: 200 },
                    minWidth: { xs: '100%', md: 200 },
                  }}
                />
                {pinError && (
                  <FormHelperText error>
                    Must be 4 digits.
                  </FormHelperText>
                )}
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              mb: 1,
            }}>
              <Button
                variant="contained"
                sx={{
                  cursor: !validConfirmationNumber(filters.confirmationNumber) || !validPinNumber(filters.pinNumber) ?
                    'not-allowed' : 'pointer',
                  '&.Mui-disabled': {
                    cursor: 'not-allowed !important',
                    pointerEvents: 'auto',
                  }
                }}
                disabled={!validConfirmationNumber(filters.confirmationNumber) || !validPinNumber(filters.pinNumber)}
                onClick={handleFindOrder}
              >
                <Iconify icon="lsicon:find-filled" sx={{ mr: 1 }} />
                Find Order
              </Button>
            </Box>
          </Box>

        </Box>
      </DashboardContent>
      <PurchaseDetailsModal
        currentBuy={selectedPurchase}
        open={openPurchaseInfo}
        openUse={openUsePurchase}
      />
      <PurchaseUseModalForm
        currentBuy={selectedPurchase}
        open={openUsePurchase}
        openDetails={openPurchaseInfo}
      />
    </>
  );
}