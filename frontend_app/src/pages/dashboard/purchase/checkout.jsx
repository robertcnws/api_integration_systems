import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PurchaseCheckoutView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

const metadata = { title: `Checkout | Dashboard - ${CONFIG.appName}` };

const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

const roleName = userLogged?.data?.user_role?.name || '';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseCheckoutView />

      {/* {roleName !== 'office staff' ? (
        <PurchaseListView />
      ) : (
        <PurchaseOfficeListView />
      )} */}
    </>
  );
}
