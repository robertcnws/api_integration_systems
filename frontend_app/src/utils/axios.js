import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });
const axiosInstanceBackend = axios.create({ baseURL: CONFIG.apiUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance ;

axiosInstanceBackend.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export { axiosInstanceBackend };

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const fetcherBackend = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstanceBackend.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: {
    me: '/auth/me',
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    isVerified: '/authorization/is_user_verified/',
    login: '/authorization/login/',
    logout: '/authorization/logout/',
    token: '/authorization/token/',
    tokenRefresh: '/authorization/token/refresh/',
    register: '/authorization/register/',
    verify: '/authorization/verify/',
    sendVerificationCode: '/authorization/send_verification_code/',
    verifyUser: '/authorization/verify_user/'
  },
  rewardPoints: {
    getFileUrl: (key) => `/reward-points/get-file-url/?key=${encodeURIComponent(key)}`,
    download: {
      backup: '/reward-points/download/backup/',
    },
    delete: {
      storeProductSelectionCart: {
        item: (id) => `/reward-points/delete/store-product-selection-cart/${id}/`,
        list: '/reward-points/delete/list/store-product-selection-carts/'
      },
      storeProductReview: {
        item: (id) => `/reward-points/delete/store-product-review/${id}/`,
        list: '/reward-points/delete/list/store-product-reviews/'
      },
      storeProductSelectionBuy: {
        item: (id) => `/reward-points/delete/store-product-selection-buy/${id}/`,
        list: '/reward-points/delete/list/store-product-selection-buys/'
      },
      storeProduct: {
        item: (id) => `/reward-points/delete/store-product/${id}/`,
        list: '/reward-points/delete/list/store-product/'
      },
      file: {
        storeProduct: {
          item: (productId, file) => `/reward-points/delete/file/${productId}/store-product/${file}/`,
          all: (productId) => `/reward-points/delete/files/${productId}/store-product/store_products/`
        }
      }
    },
    create: {
      storeProductSelectionCartBuy: {
        item: (cartId) => `/reward-points/create/store-product-selection-cart-buy/${cartId}/`,
        all: '/reward-points/create-all/store-product-selection-cart-buy/'
      },
      storeProductSelectionCart: {
        item: (productId) => `/reward-points/create/store-product-selection-cart/${productId}/`,
      },
      storeProductSelectionBuy: {
        item: (productId) => `/reward-points/create/store-product-selection-buy/${productId}/`,
      },
      storeProductReview: {
        item: (productId) => `/reward-points/create/store-product-review/${productId}/`,
      },
      storeProduct: '/reward-points/create/store-product/',
      pointsSettings: '/reward-points/create/points-settings/'
    },
    update: {
      pointsSettings: (pointsSettingsId) => `/reward-points/update/points-settings/${pointsSettingsId}/`,
      storeProduct: {
        item: (productId) => `/reward-points/update/store-product/${productId}/`,
      }
    },
    manageUse: {
      storeProductSelectionBuy: {
        item: (id) => `/reward-points/manage-use/store-product-selection-buy/${id}/`,
      },
    },
    manageRefund: {
      storeProductSelectionBuy: {
        item: (id) => `/reward-points/manage-refund/store-product-selection-buy/${id}/`,
      },
    },
    manageRemove: {
      storeProductSelectionBuy: {
        item: (id) => `/reward-points/manage-remove/store-product-selection-buy/${id}/`,
      },
    },
    manageActive: {
      storeProduct: {
        item: (productId) => `/reward-points/manage-active/store-product/${productId}/`,
      }
    },
    managePoints: {
      user: (userId) => `/reward-points/manage-points/${userId}/`,
    },
    manage: {
      storeProductReviewReaction: {
        item: (reviewId) => `/reward-points/manage/store-product-review-reaction/${reviewId}/`,
      },
    },
  },
  user: {
    notifications: {
      markAsRead: '/users/mark-read/notifications/',
      deleteAll: '/users/delete/notifications/',
    },
    delete: {
      userRole: (id) => `/users/delete/user-role/${id}/`,
      userRoles: '/users/delete/user-roles/',
      user: (id) => `/users/delete/user/${id}/`,
      users: '/users/delete/users/',
    },
    create: {
      user: '/users/create/user/',
      userRole: '/users/create/user-role/',
    },
    edit: {
      user: (id) => `/users/edit/user/${id}/`,
      userRole: (id) => `/users/edit/user-role/${id}/`,
    },
    changePassword: {
      user: (id) => `/users/change-password/${id}/`,
    },
    changeApproval: {
      user: (id) => `/users/change-approval/${id}/`,
    },
    changeVerify: {
      user: (id) => `/users/change-verify/${id}/`,
    },
  },
  item: {
    list: '/product/list',
    delete: {
      item: (id) => `/items/delete/item/${id}/`,
      list: '/items/delete/items/'
    },
  },
  graphql: {
    rewardPoints: `${CONFIG.apiUrl}/reward-points/graphql/`,
    users: `${CONFIG.apiUrl}/users/graphql/`,
    rewardIntegration: `${CONFIG.apiUrl}/integration/graphql/`,
    rewardAuthorization: `${CONFIG.apiUrl}/authorization/graphql/`
  }
};

export const wsEndpoints = {
  rewardPoints: {
    storeProduct: {
      byId: (id) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product/${id}/`,
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product/`
    },
    storeProductSelectionCart: {
      byUsername: (username) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-selection-cart/${username}/`,
    },
    storeProductSelectionBuy: {
      byUsername: (username) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-selection-buy/${username}/`,
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-selection-buy/`
    },
    storeProductReview: {
      byUsername: (username) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-review/${username}/`,
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-review/`
    },
    storeProductReviewReaction: {
      byUsername: (username) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-review-reaction/${username}/`,
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/store-product-review-reaction/`
    },
    rewardPoints: {
      byId: (id) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/reward-points/${id}/`,
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/reward-points/`
    },
    rewardPointsHistory: {
      byUsername: (username) => `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/reward-point-history/${username}/`
    },
    pointsSettings: {
      all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/reward-points/ws/points-settings/`
    }
  },
  users: {
    notificationUsers: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/users/ws/notification-users/`,
    all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/users/ws/users/`
  },
  userRoles: {
    all: `${CONFIG.wsProtocol}://${CONFIG.apiHost}/api/users/ws/user-roles/`
  }
};
