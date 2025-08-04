import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserClientListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Client list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserClientListView />
    </>
  );
}
