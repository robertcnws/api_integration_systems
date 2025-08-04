import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ItemView } from 'src/sections/items/view';

// ----------------------------------------------------------------------

const metadata = { title: `Items | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>                           
      <ItemView />
    </>
  );
}
