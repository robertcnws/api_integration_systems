import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StoreProductCreateView } from 'src/sections/store-product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new store product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StoreProductCreateView />
    </>
  );
}
