import { useMemo, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { STORAGE_KEY_REFRESH } from 'src/auth/context/jwt/constant';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

const signOut = jwtSignOut;

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, ...other }) {
  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const refreshToken = useMemo(() => sessionStorage.getItem(STORAGE_KEY_REFRESH), []);

  const { checkUserSession } = useAuthContext();

  const { logout: signOutAuth0 } = useAuth0();

  const handleLogout = useCallback(async () => {
    try {
      const promise = await axiosInstanceBackend.post(endpoints.auth.logout, {
        userReporter: userLogged?.data,
        refreshToken,
      });
      const response = promise.data;

      if (!response.data) {
        throw new Error(response.message);
      }
      else {
        await signOut();
        await checkUserSession?.();
        onClose?.();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userLogged');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, onClose, router, userLogged?.data, refreshToken]);

  const handleLogoutAuth0 = useCallback(async () => {
    try {
      await signOutAuth0();

      onClose?.();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userLogged');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [onClose, router, signOutAuth0]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={CONFIG.auth.method === 'auth0' ? handleLogoutAuth0 : handleLogout}
      {...other}
    >
      Logout
    </Button>
  );
}
