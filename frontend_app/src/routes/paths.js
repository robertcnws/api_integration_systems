
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  DASHBOARD_CONFIG: '/dashboard/config',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      verificationCode: `${ROOTS.AUTH}/verification-code`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/analytics`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      calendar: `${ROOTS.DASHBOARD}/calendar`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      pending: `${ROOTS.DASHBOARD}/user/pending`,
      client: `${ROOTS.DASHBOARD}/user/client`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    purchase: {
      root: `${ROOTS.DASHBOARD}/purchase`,
      list: `${ROOTS.DASHBOARD}/purchase/list`,
      checkout: `${ROOTS.DASHBOARD}/purchase/checkout`,
      client: (id) => `${ROOTS.DASHBOARD}/purchase/client/${id}`,
    },
    item: {
      root: `${ROOTS.DASHBOARD}/item`,
      list: `${ROOTS.DASHBOARD}/item/list`,
      attachments: `${ROOTS.DASHBOARD}/item/attachments`,
      edit: (id) => `${ROOTS.DASHBOARD}/item/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/item/${id}/details`,
    },
    config: {
      root: `${ROOTS.DASHBOARD_CONFIG}`,
    },
    storeProduct: {
      root: `${ROOTS.DASHBOARD_CONFIG}/store-product`,
      list: `${ROOTS.DASHBOARD_CONFIG}/store-product/list`,
      attachments: `${ROOTS.DASHBOARD_CONFIG}/store-product/attachments`,
      new: `${ROOTS.DASHBOARD_CONFIG}/store-product/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/store-product/${id}/details`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/store-product/${id}/edit`,
    },
    role: {
      root: `${ROOTS.DASHBOARD_CONFIG}/role`,
      list: `${ROOTS.DASHBOARD_CONFIG}/role/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/role/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/role/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/role/${id}/edit`,
    },
    pointsSettings: {
      root: `${ROOTS.DASHBOARD_CONFIG}/points-settings`,
      list: `${ROOTS.DASHBOARD_CONFIG}/points-settings/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/points-settings/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/points-settings/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/points-settings/${id}/edit`,
    },
  },
};
