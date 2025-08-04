import { lazy, useMemo, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';


// ----------------------------------------------------------------------

// const HomePage = lazy(() => import('src/pages/home'));
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
};

export function Router() {

  // console.log('listPermissions', listPermissions);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  // useEffect(() => {
  //   if (loadedPermissions && userLogged) {
  //     const results = loadedPermissions?.results;

  //     const permissions = results?.filter((item) => item.username === userLogged?.data.username);

  //     if (permissions.length > 0) {
  //       setListPermissions(permissions[0].permissions);
  //     }

  //   }
  // }, [loadedPermissions, userLogged]);

  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      // element: (
      //   <Suspense fallback={<SplashScreen />}>
      //     <MainLayout>
      //       <HomePage />
      //     </MainLayout>
      //   </Suspense>
      // ),
      element: (
        <Suspense fallback={<SplashScreen />}>
          <GuestGuard>
            <AuthSplitLayout section={{ title: '' }}>
              <Jwt.SignInPage />
            </AuthSplitLayout>
          </GuestGuard>
        </Suspense>
      ),
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes(userLogged?.data),

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
