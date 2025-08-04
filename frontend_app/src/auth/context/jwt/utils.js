import { paths } from 'src/routes/paths';

import axios, { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { STORAGE_KEY, STORAGE_KEY_REFRESH } from './constant';


// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    // console.log('Decoded Token:', decoded);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;

  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now();
  const gracePeriod = 2 * 60 * 60 * 1000;
  const timeLeft = exp * 1000 - currentTime + gracePeriod;

  setTimeout(() => {
    try {
      // alert('Token expired!');
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(accessToken, refreshToken) {
  // console.log('setSession', accessToken, refreshToken);
  try {
    if (accessToken && refreshToken) {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      sessionStorage.setItem(STORAGE_KEY_REFRESH, refreshToken);

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // const decodedToken = jwtDecode(accessToken);

      // console.log('Decoded Token in setSession:', decodedToken);

      // if (decodedToken && 'exp' in decodedToken) {
      //   tokenExpired(decodedToken.exp);
      // } else {
      //   throw new Error('Invalid access token!');
      // }
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY_REFRESH);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
  return true;
}

// ----------------------------------------------------------------------

export async function renewToken(refreshToken) {
  const refresh = refreshToken || sessionStorage.getItem(STORAGE_KEY_REFRESH);
  if (!refreshToken) {
    sessionStorage.removeItem('accessToken');
    window.location.href = paths.auth.jwt.signIn;
    return;
  }

  try {
    const response = await axiosInstanceBackend.post(endpoints.auth.tokenRefresh, { 
      refresh
    });
    const newAccessToken = response.data.accessToken;
    setSession(newAccessToken, refreshToken);
  } catch (error) {
    console.error('Error renewing token:', error);
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = paths.auth.jwt.signIn;
  }
}