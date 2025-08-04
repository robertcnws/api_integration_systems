import React from 'react';

import { Box, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { isClient, isAdministrator } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';



// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  item: icon('ic-item'),
  shipment: icon('ic-shipment'),
  salesOrder: icon('ic-sale-order'),
  project: icon('ic-project'),
  stage: icon('ic-stage'),
  stageTask: icon('ic-stage-task'),
  task: icon('ic-task'),
  access: icon('ic-access'),
  radar: icon('ic-radar'),
  config: icon('ic-config'),
  track: icon('ic-track'),
  defaultGuideProduct: icon('ic-guide-product'),
  service: icon('ic-service'),
  serviceIssue: icon('ic-service-issue'),
  serviceStage: icon('ic-service-stage'),
  serviceTask: icon('ic-service-task'),
  calendarOverview: icon('ic-calendar-overview'),
  measurement: icon('ic-measurements'),
  defaultMaterial: icon('ic-material'),
  pointsSettings: icon('ic-points-settings'),
  store: icon('ic-store'),
  purchase: icon('ic-purchase'),
  checkout: icon('ic-checkout'),
};

const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

const userRole = userLogged?.data?.user_role?.name;

// const { countLostItems } = useDataContext();

// ----------------------------------------------------------------------

export const navData = (loadedPendingUsers, newPurchases, oldPurchases, isNavMini) => [
  // export const navData = (countLostItems) => [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        key: `${paths.dashboard.general.analytics}-1`,
        title: 'Analytics',
        path: paths.dashboard.general.analytics,
        icon: ICONS.analytics
      },
      ...(userLogged && isClient(userRole) ? [
        {
          key: `${paths.dashboard.storeProduct.root}-2`,
          title: 'Reward Store',
          path: paths.dashboard.storeProduct.root,
          icon: ICONS.store,
        },
        {
          key: `${paths.dashboard.purchase.root}-3`,
          title: (
            <React.Fragment key='purchase-orders-fragment'>
              <Box component="span" key='purchase-orders'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: isNavMini ? 'center' : 'flex-start',
                }}
              >
                <Typography
                  variant={isNavMini ? 'caption' : 'subtitle2'}
                  sx={{
                    mr: 1,
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  My Reward Orders
                </Typography>
                {(newPurchases?.length > 0 && !isNavMini) && (
                  <Box
                    key='purchase-orders-count'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row'
                    }}>
                    {newPurchases.length > 0 && (
                      <Label color="error" sx={{ ml: 1, gap: 0 }}>
                        {newPurchases.length}
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          NEW
                        </Typography>
                      </Label>
                    )}
                    {oldPurchases.length > 0 && (
                      <Label color="info" sx={{ ml: 1, gap: 0 }}>
                        {oldPurchases.length}
                        <Iconify icon='icon-park:shopping-cart-add' width={20} height={20} sx={{ ml: 1 }} />
                      </Label>
                    )}
                  </Box>
                )}
              </Box>
            </React.Fragment>
          ),
          path: paths.dashboard.purchase.root,
          icon: ICONS.purchase,
        },
      ] : []),
    ],
  },
  ...(userLogged && !isClient(userRole) ? [
    {
      subheader: 'Management',
      items: [
        ...(userLogged && !isClient(userRole) ? [
          ...(userLogged && isAdministrator(userRole) ? [
            {
              key: `${paths.dashboard.user.root}-4`,
              title: (
                <React.Fragment key='users-all-fragment'>
                  <Box component="span" key='users'
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: isNavMini ? 'center' : 'flex-start',
                    }}
                  >
                    <Typography
                      key='users-title'
                      variant={isNavMini ? 'caption' : 'subtitle2'}
                      sx={{
                        mr: 1,
                        color: loadedPendingUsers?.length > 0 ? 'error.main' : 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Users
                    </Typography>
                    {(loadedPendingUsers?.length > 0 && !isNavMini) && (
                      <Box
                        key='pending-users-count'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row'
                        }}>
                        <Label
                          key='pending-users-label'
                          color="error"
                          sx={{ ml: 1, gap: 0 }}
                        >
                          {loadedPendingUsers?.length}
                          <Iconify icon='mdi:account-pending' width={20} height={20} sx={{ ml: 1 }} />
                          <Typography
                            key='pending-users-label-text'
                            variant="subtitle2"
                            sx={{ ml: 1 }}
                          >
                            Pending
                          </Typography>
                        </Label>
                      </Box>
                    )}
                  </Box>
                </React.Fragment>
              ),
              path: paths.dashboard.user.root,
              icon: ICONS.user,
              children: [
                {
                  key: `${paths.dashboard.user.pending}-5`,
                  title: (
                    <React.Fragment key='pending-approval-users-fragment'>
                      <Box
                        key='pending-approval-users'
                        component="span"
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mr: 1,
                            color: loadedPendingUsers?.length > 0 ? 'error.main' : 'text.primary',
                          }}
                        >
                          Pending Approval
                        </Typography>
                        {loadedPendingUsers?.length > 0 && (
                          <Label color="error" sx={{ ml: 1 }} key='pending-approval-users-count'>
                            {loadedPendingUsers?.length}
                          </Label>
                        )}
                      </Box>
                    </React.Fragment>
                  ),
                  path: paths.dashboard.user.pending,
                },
                {
                  key: `${paths.dashboard.user.client}-6`,
                  title: 'All Clients',
                  path: paths.dashboard.user.client,
                },
                {
                  key: `${paths.dashboard.user.list}-7`,
                  title: 'Approved Users',
                  path: paths.dashboard.user.list,
                },
                {
                  key: `${paths.dashboard.user.new}-8`,
                  title: 'Create',
                  path: paths.dashboard.user.new,
                },
              ],
            },
          ] : []),
          ...(userLogged && isAdministrator(userRole) ? [
            {
              key: `${paths.dashboard.purchase.root}-9`,
              title: (
                <React.Fragment key='purchases-all-fragment'>
                  <Box
                    key='purchases-all'
                    component="span"
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: isNavMini ? 'center' : 'flex-start',
                    }}
                  >
                    <Typography
                      key='purchase-orders-title'
                      variant={isNavMini ? 'caption' : 'subtitle2'}
                      sx={{
                        mr: 1,
                        color: 'primary',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Reward Orders
                    </Typography>
                    {([...oldPurchases, ...newPurchases]?.length > 0 && !isNavMini) && (
                      <Box
                        key='purchase-all-orders-count'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        <Label
                          key='purchase-all-orders-label'
                          color="info"
                          sx={{ ml: 1, gap: 0 }}
                        >
                          {[...oldPurchases, ...newPurchases]?.length}
                          <Iconify icon='icon-park:shopping-cart-add' width={20} height={20} sx={{ ml: 1 }} />
                        </Label>
                      </Box>
                    )}
                  </Box>
                </React.Fragment>
              ),
              path: paths.dashboard.purchase.root,
              icon: ICONS.purchase,
            },
          ] : []),
          {
            key: `${paths.dashboard.purchase.checkout}-9`,
            title: (
              <React.Fragment key='purchases-checkout-fragment'>
                <Box
                  key='purchases-checkout'
                  component="span"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: isNavMini ? 'center' : 'flex-start',
                  }}
                >
                  <Typography
                    key='purchase-checkout-title'
                    variant={isNavMini ? 'caption' : 'subtitle2'}
                    sx={{
                      mr: 1,
                      color: 'primary',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Checkout
                  </Typography>
                </Box>
              </React.Fragment>
            ),
            path: paths.dashboard.purchase.checkout,
            icon: ICONS.checkout,
          },
        ] : []),
      ]
    },
  ] : []),
  ...(userLogged && isAdministrator(userRole) ? [
    {
      subheader: 'Settings',
      items: [
        ...(userLogged && !isClient(userRole) ? [
          {
            key: `${paths.dashboard.storeProduct.root}-10`,
            title: 'Products',
            path: paths.dashboard.storeProduct.root,
            icon: ICONS.item,
            children: [
              {
                key: `${paths.dashboard.storeProduct.list}-11`,
                title: 'List',
                path: paths.dashboard.storeProduct.list,
              },
              // {
              //   key: `${paths.dashboard.storeProduct.attachments}-12`,
              //   title: 'Attachments',
              //   path: paths.dashboard.storeProduct.attachments,
              // },
              {
                key: `${paths.dashboard.storeProduct.new}-13`,
                title: 'Create',
                path: paths.dashboard.storeProduct.new,
              },
            ],
          },
          ...(userLogged && !isClient(userRole) ? [
            {
              key: `${paths.dashboard.pointsSettings.root}-14`,
              title: 'Points Settings',
              path: paths.dashboard.pointsSettings.root,
              icon: ICONS.pointsSettings,
              children: [
                {
                  key: `${paths.dashboard.pointsSettings.list}-15`,
                  title: 'List',
                  path: paths.dashboard.pointsSettings.list,
                },
                {
                  key: `${paths.dashboard.pointsSettings.new}-16`,
                  title: 'Create',
                  path: paths.dashboard.pointsSettings.new,
                },
              ],
            },
            {
              key: `${paths.dashboard.role.root}-17`,
              title: 'Roles',
              path: paths.dashboard.role.root,
              icon: ICONS.access,
              children: [
                {
                  key: `${paths.dashboard.role.list}-18`,
                  title: 'List',
                  path: paths.dashboard.role.list,
                },
                {
                  key: `${paths.dashboard.role.new}-19`,
                  title: 'Create',
                  path: paths.dashboard.role.new,
                },
              ],
            },
          ] : []),
        ] : []),
      ]
    }
  ] : []),
];
