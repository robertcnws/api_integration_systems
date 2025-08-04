import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserPendingListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pending User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserPendingListView />
    </>
  );
}
