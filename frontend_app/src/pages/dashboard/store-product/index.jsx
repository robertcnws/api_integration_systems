import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StoreProductView } from 'src/sections/store-product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Reward Store Products | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>                           
      <StoreProductView />
    </>
  );
}
