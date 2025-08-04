import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Stack, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { LoadingContext } from 'src/auth/context/loading-context';

import { PurchaseDetailsModalTemplate } from './purchase-details-modal-template';



// ----------------------------------------------------------------------

export function PurchaseUseModalForm({ currentBuy, open, openDetails }) {

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name || '', [userLogged]);

  const { isMobile } = useContext(LoadingContext);

  const productName = useMemo(() => currentBuy?.storeProductSelection?.storeProduct?.name || '', [currentBuy]);

  const userFullName = useMemo(() => {
    const user = currentBuy?.storeProductSelection?.user;
    return user ? `${user.firstName} ${user.lastName}` : 'N/A';
  }, [currentBuy]);

  const assignedPoints = useMemo(() => currentBuy?.storeProductSelection?.storeProduct?.assignedPoints || 0,
    [currentBuy]
  );

  const quantity = useMemo(() => currentBuy?.storeProductSelection?.quantity || 0,
    [currentBuy]
  );

  const totalPoints = useMemo(() => assignedPoints * quantity,
    [assignedPoints, quantity]
  );

  const available = useMemo(() => {
    const used = currentBuy?.quantityUsed || 0;
    return quantity - used;
  }, [quantity, currentBuy]);

  const isUsed = useMemo(
    () => (currentBuy?.hasBeenUsed && currentBuy?.quantityUsed === quantity) || false,
    [currentBuy, quantity]
  );

  const isPartiallyUsed = useMemo(
    () => currentBuy?.hasBeenUsed && currentBuy?.quantityUsed > 0 && currentBuy?.quantityUsed < quantity,
    [currentBuy, quantity]
  );

  const [quantityUsed, setQuantityUsed] = useState(1);

  const [notes, setNotes] = useState(currentBuy?.notes || '');

  const confirmUse = useBoolean();

  const confirmSuccess = useBoolean();

  useEffect(() => {
    if (open.value) {
      setNotes(currentBuy?.notes ?? '');
    }
  }, [open.value, currentBuy?.notes]);

  const handleUsePurchase = useCallback(
    async (id) => {
      try {
        await axiosInstanceBackend.post(endpoints.rewardPoints.manageUse.storeProductSelectionBuy.item(id), {
          userReporter: JSON.stringify(userLogged?.data),
          quantityUsed,
          notes,
        });
        toast.success('Delete success!');
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    },
    [userLogged?.data, quantityUsed, notes]
  );

  const handleNavigateClient = () => {
    const userId = currentBuy?.storeProductSelection?.user?.id;
    if (userId) {
      const userPath = paths.dashboard.purchase.client(userId);
      router.openNew(userPath);
    } else {
      toast.error('User not found');
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open.value}
        onClose={() => open.onFalse()}
        PaperProps={{ sx: { maxWidth: 820 } }}
      >
        <DialogTitle>
          Using Redeemed Order
          {currentBuy?.hasRequestedRefund && (
            <Label color="secondary" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
              Refund Requested
            </Label>
          )}
          {isUsed && (
            <Label color="error" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
              Already Used
            </Label>
          )}
          {isPartiallyUsed && (
            <Label color="warning" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
              Partially Used
            </Label>
          )}
        </DialogTitle>

        <DialogContent>
          <PurchaseDetailsModalTemplate
            currentBuy={currentBuy}
            isMobile={isMobile}
            assignedPoints={assignedPoints}
            quantity={quantity}
            totalPoints={totalPoints}
            roleName={roleName}
            handleNavigateClient={handleNavigateClient}
          />
          {/* <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
              Quantity to use:
            </Typography>

            <Stack spacing={1}>
              <IncrementerButton
                name="quantityUsed"
                quantity={quantityUsed}
                disabledDecrease={quantityUsed <= 1}
                disabledIncrease={quantityUsed >= available}
                onIncrease={() => setQuantityUsed(quantityUsed + 1)}
                onDecrease={() => setQuantityUsed(quantityUsed - 1)}
              />

              <Typography variant="caption" component="div" sx={{ textAlign: 'right', color: 'error.main' }}>
                Available: <b>{available}</b>
              </Typography>
            </Stack>
          </Stack> */}
          {!isUsed && (
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
                NOTES:
              </Typography>

              <TextField
                name="notes"
                value={notes || ''}
                onChange={(e) => setNotes(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={3}
                placeholder="Optional notes for this usage"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1 }}>
                      <Iconify icon="mdi:note-text-outline" width={20} height={20} color='text.disabled' />
                    </Box>
                  ),
                }}
                sx={{ flexGrow: 1 }}
                disabled={isUsed}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          {!isUsed && (
            <Button
              variant="contained"
              disabled={quantityUsed <= 0 || quantityUsed > available}
              onClick={() => confirmUse.onTrue()}
            >
              Checkout!
            </Button>
          )}
          <Button variant="outlined" onClick={() => {
            open?.onFalse();
            openDetails?.onTrue();
          }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmUse.value}
        onClose={confirmUse.onFalse}
        title="Confirmation"
        content={
          <>
            Are you sure want to use this order <strong> {productName} </strong> with quantity <strong> {quantityUsed} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={async () => {
              await handleUsePurchase(currentBuy.id);
              confirmUse.onFalse();
              open.onFalse();
              openDetails.onFalse();
              confirmSuccess.onTrue();
            }}
          >
            Confirm
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmSuccess.value}
        onClose={confirmSuccess.onFalse}
        title="Success"
        content={
          <>
            You have successfully used the order <strong> {productName} </strong> with quantity <strong> {quantityUsed} </strong>.
          </>
        }
      />
    </>
  );
}
