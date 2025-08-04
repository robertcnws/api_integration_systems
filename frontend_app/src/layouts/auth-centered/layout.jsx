import Alert from '@mui/material/Alert';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { Logo } from 'src/components/logo';

import { Main } from './main';
import { CustomFooter } from '../main/footer';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export function AuthCenteredLayout({ sx, children, header }) {
  const layoutQuery = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
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
                <Logo />
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
      footerSection={<CustomFooter />}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
