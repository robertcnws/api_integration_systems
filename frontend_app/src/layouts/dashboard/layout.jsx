import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { wsEndpoints } from 'src/utils/axios';
import { isClient } from 'src/utils/check-permissions';

import { allLangs } from 'src/locales';
import { useRewardStoreProductSelectionBuyByUsername } from 'src/_mock/__reward-store-product-selection-buys';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

import { useDataContext } from 'src/auth/context/data/data-context';
import { fieldsRewardStoreProductSelectionBuys } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-store-product-selection';

import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { CustomFooter } from '../main/footer';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../config-nav-account';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { CartsDrawer } from '../components/cart-drawer';
import { StyledDivider, useNavColorVars } from './styles';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';
import { navData as dashboardNavData } from '../config-nav-dashboard';
import { NotificationsDrawer } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

export function DashboardLayout({ sx, children, header, data }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const roleName = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

  // const {
  //   countLostItems,
  // } = useDataContext();

  // const countLostItems = 11;

  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery = 'lg';

  // const navData = data?.nav ?? dashboardNavData(countLostItems);

  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';


  const {
    loadedPendingUsers,
    refetchUsers,
    refetchRewardPoints,
  } = useDataContext();

  const rewardHook = useRewardStoreProductSelectionBuyByUsername(
    userLogged?.data?.username,
    fieldsRewardStoreProductSelectionBuys
  );
  const dataContextHook = useDataContext();

  const {
    data: clientData,
    loading: clientLoading,
    error: clientError,
    refetch: clientRefetch
  } = rewardHook;

  const {
    loadedStoreProductSelectionBuys: otherData,
    loadingStoreProductSelectionBuys: otherLoading,
    errorStoreProductSelectionBuys: otherError,
    refetchStoreProductSelectionBuys: otherRefetch
  } = dataContextHook;

  const loadedPurchases = roleName === 'client' ? clientData : otherData;
  const loadingPurchases = roleName === 'client' ? clientLoading : otherLoading;
  const errorPurchases = roleName === 'client' ? clientError : otherError;
  const refetchPurchases = roleName === 'client' ? clientRefetch : otherRefetch;

  const [pendingUsers, setPendingUsers] = useState(loadedPendingUsers);

  const [purchases, setPurchases] = useState(loadedPurchases);

  useEffect(() => {
    refetchUsers?.();
    setPendingUsers(loadedPendingUsers);
    refetchRewardPoints?.();
  }, [refetchUsers, loadedPendingUsers, refetchRewardPoints]);

  useEffect(() => {
    if (loadedPurchases && Array.isArray(loadedPurchases) && loadedPurchases.length > 0) {
      setPurchases(loadedPurchases);
    }
  }, [loadedPurchases]);

  useEffect(() => {
    const url = !isClient(roleName) ?
      wsEndpoints.rewardPoints.storeProductSelectionBuy.all :
      wsEndpoints.rewardPoints.storeProductSelectionBuy.byUsername(userLogged?.data?.username);
    const socket = new WebSocket(url);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
        refetchPurchases().catch((err) => console.error('Error fetching purchases data:', err));
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userLogged?.data?.username, roleName, refetchPurchases]);

  const newPurchases = useMemo(
    () => {
      const today = dayjs().format('YYYY-MM-DD');
      return purchases?.filter(p => {
        const purchaseDate = dayjs(p.createdTime, 'YYYY-MM-DD');
        return purchaseDate.isSame(today, 'day');
      }) || [];
    },
    [purchases]
  );

  const oldPurchases = useMemo(
    () => {
      const today = dayjs().format('YYYY-MM-DD');
      return purchases?.filter(p => {
        const purchaseDate = dayjs(p.createdTime, 'YYYY-MM-DD');
        return !purchaseDate.isSame(today, 'day');
      }) || [];
    },
    [purchases]
  );

  const navData = data?.nav ?? dashboardNavData(pendingUsers, newPurchases, oldPurchases, isNavMini);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          disableElevation={isNavVertical}
          slotProps={{
            toolbar: {
              sx: {
                ...(isNavHorizontal && {
                  bgcolor: 'var(--layout-nav-bg)',
                  [`& .${iconButtonClasses.root}`]: {
                    color: 'var(--layout-nav-text-secondary-color)',
                  },
                  [theme.breakpoints.up(layoutQuery)]: {
                    height: 'var(--layout-nav-horizontal-height)',
                  },
                }),
              },
            },
            container: {
              maxWidth: false,
              sx: {
                ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
              },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            bottomArea: isNavHorizontal ? (
              <NavHorizontal
                data={navData}
                layoutQuery={layoutQuery}
                cssVars={navColorVars.section}
              />
            ) : null,
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                  cssVars={navColorVars.section}
                />
                {/* -- Logo -- */}
                {isNavHorizontal && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Logo isSingle={false} sx={{ width: '100px', height: 'auto' }} />
                  </Box>
                  // <Logo
                  //   isSingle={false}
                  //   sx={{
                  //     width: '500px',
                  //     display: 'none',
                  //     [theme.breakpoints.up(layoutQuery)]: {
                  //       display: 'inline-flex',
                  //     },
                  //   }}
                  // />
                )}
                {/* -- Divider -- */}
                {isNavHorizontal && (
                  <StyledDivider
                    sx={{
                      [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
                    }}
                  />
                )}
                {/* -- Workspace popover -- */}
                {/* <WorkspacesPopover
                  data={_workspaces}
                  sx={{ color: 'var(--layout-nav-text-primary-color)' }}
                /> */}
              </>
            ),
            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 0, sm: 0.75 }}>
                {/* -- Searchbar -- */}
                <Searchbar data={navData} />
                {/* -- Language popover -- */}
                <LanguagePopover data={allLangs} />
                {/* -- Cart popover -- */}
                {isClient(roleName) && (
                  <CartsDrawer />
                )}
                {/* -- Notifications popover -- */}
                <NotificationsDrawer />
                {/* -- Contacts popover -- */}
                {/* <ContactsPopover data={_contacts} /> */}
                {/* -- Settings button -- */}
                <SettingsButton />
                {/* -- Account drawer -- */}
                <AccountDrawer data={_account({ role: userLogged?.data?.user_role?.name })} />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        isNavHorizontal ? null : (
          <NavVertical
            data={navData}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navColorVars.section}
            onToggleNav={() =>
              settings.onUpdateField(
                'navLayout',
                settings.navLayout === 'vertical' ? 'mini' : 'vertical'
              )
            }
          />
        )
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
        ...navColorVars.layout,
        '--layout-transition-easing': 'linear',
        '--layout-transition-duration': '120ms',
        '--layout-nav-mini-width': '88px',
        '--layout-nav-vertical-width': '300px',
        '--layout-nav-horizontal-height': '64px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            transition: theme.transitions.create(['padding-left'], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
