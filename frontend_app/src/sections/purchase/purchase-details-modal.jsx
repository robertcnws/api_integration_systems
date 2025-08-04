import { useMemo, useContext } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { isClient } from 'src/utils/check-permissions';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import { LoadingContext } from 'src/auth/context/loading-context';

import { PurchaseDetailsModalTemplate } from './purchase-details-modal-template';



// ----------------------------------------------------------------------

export function PurchaseDetailsModal({ currentBuy, open, openUse }) {

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name || '', [userLogged]);

  const { isMobile } = useContext(LoadingContext);

  const assignedPoints = useMemo(() => currentBuy?.storeProductSelection?.storeProduct?.assignedPoints || 0,
    [currentBuy]
  );

  const quantity = useMemo(() => currentBuy?.storeProductSelection?.quantity || 0,
    [currentBuy]
  );

  const totalPoints = useMemo(() => assignedPoints * quantity,
    [assignedPoints, quantity]
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
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open.value}
      onClose={() => open.onFalse()}
      PaperProps={{ sx: { maxWidth: 820 } }}
    >
      <DialogTitle>
        {/* Redeemed Order of {currentBuy?.storeProductSelection?.storeProduct?.name} */}
        Redeemed Order Checkout
        {currentBuy?.hasRequestedRefund && (
          <Label color="secondary" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
            Refund Requested
          </Label>
        )}
        {currentBuy?.hasBeenUsed && (
          <Label color="error" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
            Already Used!
          </Label>
        )}
        {!currentBuy?.storeProductSelection?.storeProduct?.isActive && (
          <Label color="warning" sx={{ ml: 1, mt: -3, display: 'inline-flex', alignItems: 'center' }}>
            Inactive
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
      </DialogContent>

      <DialogActions>
        {(!isClient(roleName) &&
          !currentBuy?.hasBeenUsed
          && !currentBuy?.hasRequestedRefund
          // && currentBuy?.storeProductSelection?.storeProduct?.isActive
        ) && (
            <Button variant="contained" onClick={() => {
              openUse.onTrue();
              open.onFalse();
            }}>
              Proceed
            </Button>
          )}
        <Button variant="outlined" onClick={() => open.onFalse()}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
