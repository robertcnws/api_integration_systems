import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserRoleCreateView } from 'src/sections/user-role/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new user role | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserRoleCreateView />
    </>
  );
}
