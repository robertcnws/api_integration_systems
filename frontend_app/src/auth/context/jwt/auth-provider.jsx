import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { STORAGE_KEY, STORAGE_KEY_REFRESH } from './constant';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      const refreshToken = sessionStorage.getItem(STORAGE_KEY_REFRESH);

      // console.log('Access Token:', accessToken);
      // console.log('Refresh Token:', refreshToken);

      // console.log('Is Access Token Valid:', isValidToken(accessToken));

      if (accessToken && isValidToken(accessToken)) {
        const resp = await setSession(accessToken, refreshToken);
        if (!resp) {
          throw new Error('Failed to set session');
        }
        const res = await axios.get(endpoints.auth.me);
        const { user } = res.data;
        setState({ user: { ...user, accessToken }, loading: false });

      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
