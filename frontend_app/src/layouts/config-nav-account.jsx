
import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = ({ role }) => [
  {
    label: 'Home',
    href: '/',
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Change password',
    href: '#',
    icon: <Iconify icon="mdi:password-reset" />,
    info: 'New',
  },
  ...(listRolesAndSubroles(role).includes(CONFIG.roles.administrator)
    ? [
        {
          label: 'Download backup',
          href: '#',
          icon: <Iconify icon="clarity:backup-solid" />,
        },
      ]
    : []),
];
