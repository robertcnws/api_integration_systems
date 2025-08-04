import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserRoleListView } from 'src/sections/user-role/view';

// ----------------------------------------------------------------------

const metadata = { title: `User Roles list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserRoleListView />
    </>
  );
}
