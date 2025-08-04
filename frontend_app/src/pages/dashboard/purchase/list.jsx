import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PurchaseListView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

const metadata = { title: `Purchases list | Dashboard - ${CONFIG.appName}` };

const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

const roleName = userLogged?.data?.user_role?.name || '';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseListView />

      {/* {roleName !== 'office staff' ? (
        <PurchaseListView />
      ) : (
        <PurchaseOfficeListView />
      )} */}
    </>
  );
}
