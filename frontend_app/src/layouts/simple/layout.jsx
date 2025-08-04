import Alert from '@mui/material/Alert';

import { Logo } from 'src/components/logo';

import { Main, CompactContent } from './main';
import { CustomFooter } from '../main/footer';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

export function SimpleLayout({ sx, children, header, content }) {
  const layoutQuery = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <Logo />,
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
      // footerSection={<Footer layoutQuery={layoutQuery} />}
      footerSection={<CustomFooter />}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-simple-content-compact-width': '448px',
      }}
      sx={sx}
    >
      <Main>
        {content?.compact ? (
          <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
        ) : (
          children
        )}
      </Main>
    </LayoutSection>
  );
}
