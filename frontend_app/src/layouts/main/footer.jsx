import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _socials } from 'src/_mock';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import { Logo } from 'src/components/logo';

import { LoadingContext } from 'src/auth/context/loading-context';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and condition', href: '#' },
      { name: 'Privacy policy', href: '#' },
    ],
  },
  { headline: 'Contact', children: [{ name: 'support@minimals.cc', href: '#' }] },
];

// ----------------------------------------------------------------------

export function Footer({ layoutQuery, sx }) {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ position: 'relative', bgcolor: 'background.default', ...sx }}>
      <Divider />

      <Container
        sx={{
          pb: 5,
          pt: 10,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        }}
      >
        <Logo />

        <Grid
          container
          sx={{
            mt: 3,
            justifyContent: 'center',
            [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
          }}
        >
          <Grid {...{ xs: 12, [layoutQuery]: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              }}
            >
              The starting point for your next project with Minimal UI Kit, built on the newest
              version of Material-UI ©, ready to be customized to your style.
            </Typography>

            <Stack
              direction="row"
              sx={{
                mt: 3,
                mb: 5,
                justifyContent: 'center',
                [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
              }}
            >
              {_socials.map((social) => (
                <IconButton key={social.label} color="inherit">
                  {social.value === 'twitter' && <TwitterIcon />}
                  {social.value === 'facebook' && <FacebookIcon />}
                  {social.value === 'instagram' && <InstagramIcon />}
                  {social.value === 'linkedin' && <LinkedinIcon />}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid {...{ xs: 12, [layoutQuery]: 6 }}>
            <Stack
              spacing={5}
              sx={{
                flexDirection: 'column',
                [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' },
              }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  sx={{
                    width: 1,
                    alignItems: 'center',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
        ...sx,
      }}
    >
      <Container>
        <Logo />
        <Box sx={{ mt: 1, typography: 'caption' }}>
          © All rights reserved.
          <br /> made by
          <Link href="https://minimals.cc/"> minimals.cc </Link>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

export const CustomFooter = () => {

  const currentYear = new Date().getFullYear();

  const { isMobile } = useContext(LoadingContext);

  const { pathname } = useLocation();

  useEffect(() => {
    // console.log('pathname', pathname);
    if (!pathname.includes('installation')) {
      localStorage.removeItem('projectPage');
      localStorage.removeItem('projectRowsPerPage');
      localStorage.removeItem('projectFilterList');
      localStorage.removeItem('projectFilterName');
      localStorage.removeItem('projectFilterType');
      localStorage.removeItem('projectFilterStartDate');
      localStorage.removeItem('projectFilterEndDate');
      localStorage.removeItem('projectFilterInstaller');
      localStorage.removeItem('projectFilterCustom');
    }
    if (!pathname.includes('service')) {
      localStorage.removeItem('servicePage');
      localStorage.removeItem('serviceRowsPerPage');
      localStorage.removeItem('serviceFilterList');
      localStorage.removeItem('serviceFilterName');
      localStorage.removeItem('serviceFilterType');
      localStorage.removeItem('serviceFilterStartDate');
      localStorage.removeItem('serviceFilterEndDate');
      localStorage.removeItem('serviceFilterInstaller');
      localStorage.removeItem('serviceFilterCustom');
      localStorage.removeItem('serviceFilterByFactory');
      localStorage.removeItem('serviceFilterNotByFactory');
    }
  }, [pathname]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #ddd',
        py: 1,
        textAlign: 'center',
        zIndex: 1300,
        mb: 0
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '12px', fontWeight: 'bold' }}
          >
            © {currentYear}{' '}
            {isMobile
              ? 'NWS Reward Points. All rights reserved.'
              : 'Reward Points. New Window System. All rights reserved.'}
          </Typography>
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: { xs: -1, sm: -1 }, mb: { xs: -1, sm: -1 } }}
          >
            {_socials.map((social) => (
              <IconButton key={social.label} color="inherit">
                {social.value === 'twitter' && <TwitterIcon />}
                {social.value === 'facebook' && <FacebookIcon />}
                {social.value === 'instagram' && <InstagramIcon />}
                {social.value === 'linkedin' && <LinkedinIcon />}
              </IconButton>
            ))}
          </Stack>
        </Grid> */}
      </Grid>
    </Box>
  )
};
