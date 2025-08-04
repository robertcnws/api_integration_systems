import { useContext } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';

import { LoadingContext } from 'src/auth/context/loading-context';

import { Section } from './section';
import { Main, Content } from './main';
import { CustomFooter } from '../main/footer';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';



// ----------------------------------------------------------------------

export function AuthSplitLayout({ sx, section, children, header }) {
  const layoutQuery = 'md';

  const { isMobile } = useContext(LoadingContext);

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' }, ...header?.sx }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Logo -- */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  // mt: !isMobile ? 150 : 120,
                  // ml: !isMobile ? 1 : 0,
                  // mb: !isMobile ? 0 : 10,
                  mt: !isMobile ? 100 : 40,
                  ml: !isMobile ? 4 : 6,
                }}>
                  <Logo
                    isSingle={false}
                    sx={{
                      width: 350,
                      height: 'auto'
                    }}
                  />
                </Box>
              </>
            ),
            // rightArea: (
            //   <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
            //     <Link
            //       href={paths.faqs}
            //       component={RouterLink}
            //       color="inherit"
            //       sx={{ typography: 'subtitle2' }}
            //     >
            //       Need help?
            //     </Link>
            //     <SettingsButton />
            //   </Box>
            // ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      // footerSection={null}
      // footerSection={homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />}
      // footerSection={<Footer layoutQuery={layoutQuery} />}
      footerSection={<CustomFooter />}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={sx}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section?.title}
          layoutQuery={layoutQuery}
          imgUrl={section?.imgUrl}
          // imgUrl='/logo/logo.png'
          method={CONFIG.auth.method}
          subtitle={section?.subtitle}
          methods={[
            {
              label: 'Jwt',
              path: paths.auth.jwt.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-jwt.svg`,
            },
            {
              label: 'Firebase',
              path: paths.auth.firebase.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-firebase.svg`,
            },
            {
              label: 'Amplify',
              path: paths.auth.amplify.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-amplify.svg`,
            },
            {
              label: 'Auth0',
              path: paths.auth.auth0.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-auth0.svg`,
            },
            {
              label: 'Supabase',
              path: paths.auth.supabase.signIn,
              icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-supabase.svg`,
            },
          ]}
        />

        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection >
  );
}
