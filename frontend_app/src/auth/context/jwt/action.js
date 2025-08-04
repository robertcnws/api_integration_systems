
import axios, { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { setSession } from './utils';


/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);


    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const signInWithUsernameAndPassword = async ({ username, password, rememberMe }) => {
  try {
    // console.log('Signing in with username and password:', { username, password, rememberMe });

    const resVerified = await axiosInstanceBackend.post(endpoints.auth.isVerified, {
      username,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (resVerified.status === 200) {

      const params = { username, password, rememberMe };

      // console.log('params:', params);

      const res = await axiosInstanceBackend.post(endpoints.auth.token, params, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (res.data && res.data.access && res.data.refresh) {
        // console.log('Response data:', res.data);
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);
        const resSession = await setSession(res.data.access, res.data.refresh);

        if (!resSession) {
          throw new Error('Failed to set session');
        }

        // console.log('Session set successfully:', resSession);

        const accessToken = res.data.access;


        if (!accessToken) {
          throw new Error('Access token not found in response');
        }

        const loginResponse = await axiosInstanceBackend.post(endpoints.auth.login, params, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (loginResponse.status === 200) {
          const loggedUser = {
            data: {
              ...loginResponse.data.data,
              id: loginResponse.data.data._id,
            }
          };
          delete loginResponse.data.data.password;
          sessionStorage.setItem('userLogged', JSON.stringify(loggedUser));
          localStorage.setItem('userLogged', JSON.stringify(loggedUser));
        }
      }
    } else {
      throw new Error('User is not verified');
    }
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  username,
  companyName,
  email, password,
  firstName,
  lastName,
  phoneNumber
}) => {
  const params = {
    username,
    companyName,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  };

  const res = await axiosInstanceBackend.post(endpoints.auth.register, params);

  // console.log('Sign up response in function:', res);

  return res?.data || res?.error || 'An error occurred during sign up';

};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null, null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
