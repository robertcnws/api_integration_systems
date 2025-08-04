import 'src/global.css';

// ----------------------------------------------------------------------

import React, { useContext } from 'react';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { CONFIG } from 'src/config-global';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { LoadingContext } from 'src/auth/context/loading-context';
import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as Auth0AuthProvider } from 'src/auth/context/auth0';
import { AuthProvider as AmplifyAuthProvider } from 'src/auth/context/amplify';

import client from './utils/graphql-client';
import { RouteProvider } from './auth/context/router-context';
import { DataProvider } from './auth/context/data/data-context';
import BackdropBackground from './layouts/components/backdrop-background';



// ----------------------------------------------------------------------

const AuthProvider =
  (CONFIG.auth.method === 'amplify' && AmplifyAuthProvider) ||
  (CONFIG.auth.method === 'auth0' && Auth0AuthProvider) ||
  JwtAuthProvider;

const queryClient = new QueryClient();

export default function App() {
  useScrollToTop();

  const { loading, error, setError, component } = useContext(LoadingContext);

  return (
    <I18nProvider>
      <LocalizationProvider>
        <AuthProvider>
          <SettingsProvider settings={defaultSettings}>
            <ThemeProvider>
              <ApolloProvider client={client}>
                <RouteProvider>
                  <MotionLazy>
                    <QueryClientProvider client={queryClient}>
                      <DataProvider>
                        <Snackbar />
                        <ProgressBar />
                        <SettingsDrawer />
                        <Router />
                        <BackdropBackground loading={loading} error={error} setError={setError} component={component} />
                      </DataProvider>
                    </QueryClientProvider>
                  </MotionLazy>
                </RouteProvider>
              </ApolloProvider>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
